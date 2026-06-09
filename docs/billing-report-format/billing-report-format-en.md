# Copilot Usage Billing CSV Format and AIC Cost Calculation

This document describes the CSV column schema of the **Copilot usage-based billing** report uploaded, with examples to clarify each column's meaning.

---

## Column definitions

| # | Column | Type | Description |
|---|--------|------|-------------|
| 1 | `date` | ISO date (`YYYY-MM-DD`) | Day on which the usage occurred. |
| 2 | `username` | string | GitHub username that generated the request. |
| 3 | `product` | string | Product name, commonly `copilot` or `spark`. |
| 4 | `sku` | string | SKU identifier for the billed action, e.g. `copilot_premium_request`, `coding_agent_premium_request`, `copilot_ai_credit`, `coding_agent_ai_credit`, `spark_ai_credit`. |
| 5 | `model` | string | Model name actually invoked, such as `Claude Sonnet 4.6`, `Claude Opus 4.6`, `GPT-5.4`, `Auto: GPT-5.4`. `Auto: XXX` means routed by the Auto model to XXX. |
| 6 | `quantity` | number | Billable unit count for the row. When `unit_type = requests`, this equals the number of PRUs (premium requests) consumed; otherwise it equals the number of AI Credits consumed. |
| 7 | `unit_type` | string | Billing unit type. `requests` means billed by request (PRU); any other value (e.g. `ai-credits`) means billed by AI Credits. |
| 8 | `applied_cost_per_quantity` | number | Unit price (USD) per unit. The typical value in the CSV is `0.04`, i.e. 1 PRU = $0.04. |
| 9 | `gross_amount` | number (USD) | **Gross**: list price before discounts. Equals `quantity × applied_cost_per_quantity`. |
| 10 | `discount_amount` | number (USD) | Discount amount. Most commonly the monthly free quota offset. |
| 11 | `net_amount` | number (USD) | **Net**: amount actually owed. Equals `gross_amount − discount_amount`. |
| 12 | `exceeds_quota` | boolean (`True` / `False`) | Whether this row exceeded the monthly free quota. When `True`, typically `discount = 0` and `net = gross`. |
| 13 | `total_monthly_quota` | number | This user's monthly free quota (PRU cap). Business is typically `300`, Enterprise is typically `1000`, and `0` when there is no quota. |
| 14 | `organization` | string | Organization slug the user belongs to. Empty for individual accounts or unaffiliated usage. |
| 15 | `cost_center_name` | string / empty | Optional cost center label, used to categorize bills inside an organization. |
| 16 | `aic_quantity` | number | AI Credits consumed for the same usage. |
| 17 | `aic_gross_amount` | number (USD) | Gross amount under the AI Credits view. |

---

## Key formulas

```
net_amount = gross_amount - discount_amount
gross_amount = quantity × applied_cost_per_quantity   (PRU rows)
```

| Concept | Meaning |
|---------|---------|
| Gross | List price (before discount) |
| Discount | Amount offset (typically by the free quota) |
| Net | Actually paid (after discount) |

The PRU view and the AIC view exist **in parallel**: each row carries both sets of numbers — the former uses `quantity / gross / discount / net`, the latter uses `aic_quantity / aic_gross_amount` (plus an inferred `aic_net_amount`) — to support the comparison "how much would this cost under the other billing scheme?".

---

## Examples

### Example 1: within quota (`net = 0`)
```
date=2026-04-01, username=octocat, model=Claude Opus 4.6
quantity=15, applied_cost_per_quantity=0.04
gross_amount=0.60, discount_amount=0.60, net_amount=0
exceeds_quota=False, total_monthly_quota=300
aic_quantity=688.72, aic_gross_amount=6.89
```
Meaning: 15 calls to Claude Opus 4.6, list price $0.60, but still within the free quota, so **actually paid $0**. The same usage under AIC billing would consume about 688 credits (≈ $6.89).

### Example 2: over quota (`net > 0`)
```
date=2026-04-02, username=hubot, model=Claude Opus 4.6
quantity=23.3, applied_cost_per_quantity=0.04
gross_amount=0.932, discount_amount=0, net_amount=0.932
exceeds_quota=True, total_monthly_quota=300
aic_quantity=7.92, aic_gross_amount=0.0792
```
Meaning: 23.3 calls to Claude Opus 4.6, list price $0.93. Because the monthly free quota has been exceeded (`exceeds_quota=True`), there is no discount, so **actually paid $0.93**.

---

## Overview page data explanation

The Overview page shows two billing views side by side: **current PRU billing** on the left and **AIC / usage-based billing** on the right. License cost is the same on both sides; the main difference is how usage is offset by included credits.

### PRU billing view

| UI value | Meaning | Calculation |
|----------|---------|-------------|
| Consumed (PRUs) | Pre-discount cost of all usage under the PRU view. | `sum(gross_amount)` |
| Discount (included PRUs) | Amount offset by each user's own included PRU allowance. | `sum(discount_amount)` |
| Overages | Usage cost still owed after included PRUs are applied. | `sum(net_amount)`, also `Consumed (PRUs) - Discount (included PRUs)` |
| License cost | Monthly Copilot seat cost. | Calculated from Business / Enterprise seat counts and monthly prices. |
| Total (license + overages) | Total bill under current PRU billing. | `License cost + Overages` |

Key point for PRUs: **included PRUs are applied independently per user**. Unused PRUs from one user do not automatically transfer to another user who exceeded their allowance.

### AIC billing view

| UI value | Meaning | Calculation |
|----------|---------|-------------|
| Consumed (AICs) | Pre-discount cost of all usage under the AIC view. | `sum(aic_gross_amount)` |
| Discount (included AICs) | Amount offset by the included AIC pool. | `sum(aic_gross_amount) - sum(aic_net_amount)` |
| Additional usage | Usage cost still owed after the included AIC pool is exhausted. | `sum(aic_net_amount)`, also `Consumed (AICs) - Discount (included AICs)` |
| License cost | Monthly Copilot seat cost. | Same as the PRU side, calculated from Business / Enterprise seat counts and monthly prices. |
| Total (license + additional usage) | Total bill under AIC billing. | `License cost + Additional usage` |

Key point for AICs: **included AICs are shared at the account / organization pool level**. All users draw from the same pool; once it is exhausted, later usage becomes Additional usage.

---

## Mapping to the Users view UI columns

| UI column | CSV field | Aggregation |
|-----------|-----------|-------------|
| User | `username` | Group key |
| PRUs | `quantity` (PRU rows only) | Sum |
| AICs | `aic_quantity` | Sum |
| Models used | `model` | Distinct count |
| PRU Net Cost | `net_amount` | Sum |
| AIC Net Cost | `aic_net_amount` (inferred) | Sum |
| Difference | `net_amount − aic_net_amount` | Per-user delta |
---

## How `aic_net_amount` is computed

> The CSV itself **only** contains `aic_quantity` and `aic_gross_amount`; it does **not** contain `aic_net_amount`. The app infers it row by row based on the included credits pool.

### Step 1: determine the included credits pool

| Report scope | Pool rule | Monthly credits |
|--------------|-----------|-----------------|
| **Organization** (multi-user / has org) | One pool shared across the organization | `Business seats × 3000 + Enterprise seats × 7000` |

Seat counts are inferred from the CSV by default (`total_monthly_quota = 300` → Business, `= 1000` → Enterprise).

### Step 2: deduct the pool row by row, in CSV order

For each row:

```
covered        = min(aic_quantity, remaining_pool)
uncovered      = aic_quantity − covered
aic_net_amount = aic_gross_amount × (uncovered / aic_quantity)
remaining_pool -= covered
```

Meaning: **whatever fraction of this row's credits exceeds the free pool is the fraction that gets charged.**

### One-line summary

> `aic_net_amount = aic_gross_amount × (fraction of the row's AIC not covered by the free pool)`. The whole report is processed by streaming through CSV rows in order, deducting from a single included credits pool.

