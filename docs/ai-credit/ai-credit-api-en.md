# GitHub Copilot AI Credit Usage API Guide

## Table of Contents

- [1. Enterprise AI Credit Usage](#1-enterprise-ai-credit-usage)
- [2. Organization AI Credit Usage](#2-organization-ai-credit-usage)
- [3. User AI Credit Usage](#3-user-ai-credit-usage)
- [4. List Budgets](#4-list-budgets)
- [5. Get a Single Budget](#5-get-a-single-budget)
- [6. Create a Budget](#6-create-a-budget)
- [7. Update a Budget](#7-update-a-budget)
- [8. Delete a Budget](#8-delete-a-budget)
- [9. Create a Usage Report Export](#9-create-a-usage-report-export)
- [10. Get Usage Report Status](#10-get-usage-report-status)

---

## 1. Enterprise AI Credit Usage

`GET /enterprises/{enterprise}/settings/billing/ai_credit/usage`

Returns the total AI Credit consumption for the specified month, aggregated by **(product, sku, model)**.

### Enterprise Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| year | query | integer | Optional. Year. Defaults to the current year. |
| month | query | integer | Optional. Month, from 1 to 12. Defaults to the current month. |
| day | query | integer | Optional. Day, from 1 to 31. |
| model | query | string | Optional. Filters by model. |
| product | query | string | Optional. Filters by product. |

### Enterprise Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/ai_credit/usage?year=2026&month=6"
```

### Enterprise Example Response

```json
{
  "timePeriod": { "year": 2026, "month": 6 },
  "enterprise": "<enterprise_slug>",
  "usageItems": [
    {
      "product": "Copilot",
      "sku": "Copilot AI Credits",
      "model": "gpt-4o",
      "unitType": "ai-credits",
      "pricePerUnit": 0.01,
      "grossQuantity": 500.0,
      "grossAmount": 5.0,
      "discountQuantity": 300.0,
      "discountAmount": 3.0,
      "netQuantity": 200.0,
      "netAmount": 2.0
    }
  ]
}
```

---

## 2. Organization AI Credit Usage

`GET /organizations/{org}/settings/billing/ai_credit/usage`

Returns the same structure as the enterprise endpoint, aggregated at the organization level. The top-level `enterprise` field is replaced by `organization`.

### Organization Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| org | path | string | Organization slug |
| year | query | integer | Optional. Year. Defaults to the current year. |
| month | query | integer | Optional. Month, from 1 to 12. Defaults to the current month. |
| day | query | integer | Optional. Day, from 1 to 31. |
| user | query | string | Optional. Filters by a single user. |
| model | query | string | Optional. Filters by model. |
| product | query | string | Optional. Filters by product. |

### Organization Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/organizations/<org_slug>/settings/billing/ai_credit/usage?year=2026&month=6"
```

### Organization Example Response

```json
{
  "timePeriod": { "year": 2026, "month": 6 },
  "organization": "<org_slug>",
  "usageItems": [
    {
      "product": "Copilot",
      "sku": "Copilot AI Credits",
      "model": "claude-sonnet-4.5",
      "unitType": "ai-credits",
      "pricePerUnit": 0.01,
      "grossQuantity": 120.0,
      "grossAmount": 1.2,
      "discountQuantity": 120.0,
      "discountAmount": 1.2,
      "netQuantity": 0.0,
      "netAmount": 0.0
    }
  ]
}
```

---

## 3. User AI Credit Usage

`GET /enterprises/{enterprise}/settings/billing/ai_credit/usage?year={YYYY}&month={M}&user={login}`

Returns AI Credit usage for a single user under the enterprise billing context. The response uses the same structure as the enterprise endpoint and also includes a top-level `user` field. This was verified for users whose Copilot entitlement is managed by the enterprise.

> **Note:** `GET /users/{username}/settings/billing/ai_credit/usage` only returns data when the user has purchased a Copilot plan directly. If the user's Copilot entitlement is managed by an organization or enterprise, use the enterprise endpoint in this section with the `user` query parameter.

### User Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| year | query | integer | Optional. Year. Defaults to the current year. |
| month | query | integer | Optional. Month, from 1 to 12. Defaults to the current month. |
| day | query | integer | Optional. Day, from 1 to 31. |
| user | query | string | GitHub login used to filter a single user. |
| model | query | string | Optional. Filters by model. |
| product | query | string | Optional. Filters by product. |

### User Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/ai_credit/usage?year=2026&month=6&user=<login>"
```

### User Example Response

```json
{
  "timePeriod": { "year": 2026, "month": 6 },
  "enterprise": "<enterprise_slug>",
  "user": "<login>",
  "usageItems": [
    {
      "product": "Copilot",
      "sku": "Copilot AI Credits",
      "model": "gpt-4o",
      "unitType": "ai-credits",
      "pricePerUnit": 0.01,
      "grossQuantity": 42.0,
      "grossAmount": 0.42,
      "discountQuantity": 30.0,
      "discountAmount": 0.30,
      "netQuantity": 12.0,
      "netAmount": 0.12
    }
  ]
}
```

---

## 4. List Budgets

`GET /enterprises/{enterprise}/settings/billing/budgets`

### List Budgets Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| scope | query | string | Optional. Filters by budget scope, such as `user`, `multi_user_customer`, or `enterprise`. |
| user | query | string | Optional. Filters by the budget that applies to a specific user. |
| budgetTarget | query | string | Optional. Filters by SKU. Use `ai_credits` for AI Credit scenarios. |

### List Budgets Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?scope=user"
```

### List Budgets Example Response

```json
{
  "budgets": [
    {
      "id": "<budget_id>",
      "budget_type": "BundlePricing",
      "budget_product_sku": "ai_credits",
      "budget_scope": "user",
      "budget_amount": 50,
      "prevent_further_usage": true,
      "budget_entity_name": "<username>",
      "user": "<username>",
      "consumed_amount": 0.0,
      "budget_alerting": {
        "will_alert": false,
        "alert_recipients": []
      }
    }
  ]
}
```

You can also query the AI Credit budget for a specific user:

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?user=<username>&budgetTarget=ai_credits"
```

Query the default multi-user customer budget:

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?scope=multi_user_customer"
```

---

## 5. Get a Single Budget

`GET /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### Get a Single Budget Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| budget_id | path | string | Budget ID |

### Get a Single Budget Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets/<budget_id>"
```

### Get a Single Budget Example Response

```json
{
  "id": "<budget_id>",
  "budget_type": "BundlePricing",
  "budget_product_sku": "ai_credits",
  "budget_scope": "user",
  "budget_amount": 50,
  "prevent_further_usage": true,
  "budget_entity_name": "<username>",
  "user": "<username>",
  "consumed_amount": 0.0
}
```

---

## 6. Create a Budget

`POST /enterprises/{enterprise}/settings/billing/budgets`

### Create a Budget Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| budget_amount | body | number | Budget amount in USD |
| budget_scope | body | string | Budget scope, such as `enterprise`, `organization`, or `user` |
| budget_entity_name | body | string | Budget target name. For single-user budgets, use the same GitHub login as `user`. |
| user | body | string | GitHub username. Required when `budget_scope` is `user`. |
| organization | body | string | Organization slug. Required when `budget_scope` is `organization`. |
| prevent_further_usage | body | boolean | Whether to block further usage after the budget is reached. Must be `true` for `user` scope. |
| budget_product_sku | body | string | Use `ai_credits` for AI Credit scenarios. |
| budget_type | body | string | Usually `BundlePricing`. |
| consumed_amount | body | number | Optional. Usually `0` when creating a budget. |
| budget_alerting | body | object | Alert configuration, including `will_alert` and `alert_recipients`. |
| budget_thresholds | body | object | Optional. Threshold configuration; commonly used in the default multi-user budget example. |
| exclude_cost_center_usage | body | boolean | Optional. Only meaningful for enterprise scope. Indicates whether cost center usage should be excluded. |

### Create a Single-User AI Credit Budget Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  -H "Content-Type: application/json" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets" \
  -d '{
    "budget_type": "BundlePricing",
    "budget_product_sku": "ai_credits",
    "budget_scope": "user",
    "budget_entity_name": "<username>",
    "user": "<username>",
    "budget_amount": 50.00,
    "prevent_further_usage": true,
    "consumed_amount": 0,
    "budget_alerting": {
      "will_alert": false,
      "alert_recipients": []
    }
  }'
```

### Create a Budget Example Response

```json
{
  "message": "Budget successfully created.",
  "budget": {
    "id": "<budget_id>",
    "budget_type": "BundlePricing",
    "budget_product_sku": "ai_credits",
    "budget_scope": "user",
    "budget_amount": 50,
    "prevent_further_usage": true,
    "budget_entity_name": "<username>",
    "user": "<username>",
    "consumed_amount": 0.0,
    "budget_alerting": {
      "will_alert": false,
      "alert_recipients": []
    }
  }
}
```

### Create a Default Multi-User AI Credit Budget Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  -H "Content-Type: application/json" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets" \
  -d '{
    "budget_type": "BundlePricing",
    "budget_product_sku": "ai_credits",
    "budget_scope": "multi_user_customer",
    "budget_entity_name": "<enterprise_slug>",
    "budget_amount": 20,
    "prevent_further_usage": true,
    "budget_thresholds": {
      "75": 0,
      "90": 0,
      "100": 0
    },
    "budget_alerting": {
      "will_alert": true,
      "alert_recipients": ["<billing_admin_username>"]
    }
  }'
```

---

## 7. Update a Budget

`PATCH /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### Update a Budget Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| budget_id | path | string | Budget ID |
| budget_amount | body | number | New budget amount in USD |
| prevent_further_usage | body | boolean | Whether to block further usage after the budget is reached. Must be `true` for `user` scope. |
| budget_alerting | body | object | Alert configuration |

### Update a Budget Example Request

```bash
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  -H "Content-Type: application/json" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets/<budget_id>" \
  -d '{
    "budget_amount": 75.00,
    "prevent_further_usage": true,
    "budget_alerting": {
      "will_alert": false,
      "alert_recipients": []
    }
  }'
```

### Update a Budget Example Response

```json
{
  "message": "Budget successfully updated.",
  "budget": {
    "id": "<budget_id>",
    "budget_type": "BundlePricing",
    "budget_product_sku": "ai_credits",
    "budget_scope": "user",
    "budget_amount": 75,
    "prevent_further_usage": true,
    "budget_entity_name": "<username>",
    "user": "<username>"
  }
}
```

---

## 8. Delete a Budget

`DELETE /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### Delete a Budget Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| budget_id | path | string | Budget ID |

### Delete a Budget Example Request

```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets/<budget_id>"
```

### Delete a Budget Example Response

```json
{
  "message": "Budget successfully deleted.",
  "id": "<budget_id>"
}
```

---

## 9. Create a Usage Report Export

`POST /enterprises/{enterprise}/settings/billing/reports`

Starts an asynchronous export and generates a downloadable CSV with per-user, per-model detail. Set `report_type` to `ai_credit`. This applies only to data from June 1 onward.

### Create a Usage Report Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| report_type | body | string | Fixed value: `ai_credit` |
| start_date | body | string | Start date in `YYYY-MM-DD` format |
| end_date | body | string | End date in `YYYY-MM-DD` format |

### Create a Usage Report Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  -H "Content-Type: application/json" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/reports" \
  -d '{
    "report_type": "ai_credit",
    "start_date": "2026-06-01",
    "end_date": "2026-06-01"
  }'
```

### Create a Usage Report Example Response

```json
{
  "id": "<report_id>",
  "report_type": "ai_credit",
  "start_date": "2026-06-01",
  "end_date": "2026-06-01",
  "status": "processing",
  "created_at": "2026-06-01T07:14:02Z",
  "actor": "<username>"
}
```

---

## 10. Get Usage Report Status

`GET /enterprises/{enterprise}/settings/billing/reports/{report_id}`

### Get Usage Report Status Parameters

| Parameter | Location | Type | Description |
| --- | --- | --- | --- |
| enterprise | path | string | Enterprise slug |
| report_id | path | string | Report ID returned by the POST request |

### Get Usage Report Status Example Request

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/reports/<report_id>"
```

### Get Usage Report Status Example Response

```json
{
  "id": "<report_id>",
  "report_type": "ai_credit",
  "start_date": "2026-06-01",
  "end_date": "2026-06-01",
  "status": "completed",
  "created_at": "2026-06-01T07:14:02Z",
  "actor": "<username>",
  "download_urls": [
    "<download_url>"
  ]
}
```
