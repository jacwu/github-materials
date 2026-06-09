# Copilot 用量计费 CSV 表结构说明和 AIC 费用计算方法

本文件描述上传到应用的 **Copilot usage-based billing**（按用量计费）报告的 CSV 列结构，配合示例帮助理解每一列的含义。

---

## 列定义

| # | 列名 | 类型 | 说明 |
|---|------|------|------|
| 1 | `date` | ISO 日期（`YYYY-MM-DD`） | 该条用量发生的日期。 |
| 2 | `username` | 字符串 | 发起这次调用的 GitHub 用户名。 |
| 3 | `product` | 字符串 | 产品名，常见为 `copilot` 或 `spark`。 |
| 4 | `sku` | 字符串 | 被计费动作的 SKU 标识，例如 `copilot_premium_request`、`coding_agent_premium_request`、`copilot_ai_credit`、`coding_agent_ai_credit`、`spark_ai_credit`。 |
| 5 | `model` | 字符串 | 实际调用的模型名，如 `Claude Sonnet 4.6`、`Claude Opus 4.6`、`GPT-5.4`、`Auto: GPT-5.4`。`Auto: XXX` 表示由 Auto 模型路由到 XXX。 |
| 6 | `quantity` | 数字 | 该行计费的「单位数量」。当 `unit_type = requests` 时，等于消耗的 PRU（高级请求）数；否则等于消耗的 AI Credits 数。 |
| 7 | `unit_type` | 字符串 | 计费单位类型。`requests` 表示按请求计费（PRU），其它值（如 `ai-credits`）表示按 AI Credits 计费。 |
| 8 | `applied_cost_per_quantity` | 数字 | 每个单位的单价（美元）。CSV 中典型值为 `0.04`，即 1 个 PRU = $0.04。 |
| 9 | `gross_amount` | 数字（美元） | **毛额**：折扣前的标价。等于 `quantity × applied_cost_per_quantity`。 |
| 10 | `discount_amount` | 数字（美元） | 折扣金额。常见来源：当月免费额度（quota）抵扣。 |
| 11 | `net_amount` | 数字（美元） | **净额**：实际要付的钱。等于 `gross_amount − discount_amount`。 |
| 12 | `exceeds_quota` | 布尔（`True` / `False`） | 这一行是否超出当月免费额度。`True` 时通常 `discount = 0`、`net = gross`。 |
| 13 | `total_monthly_quota` | 数字 | 该用户当月免费额度（PRU 上限）。Business 通常 `300`，Enterprise 通常 `1000`，无 quota 时为 `0`。 |
| 14 | `organization` | 字符串 | 该用户所属组织的 slug。个人账号或未关联组织时为空。 |
| 15 | `cost_center_name` | 字符串 / 空 | 可选的成本中心标签，用于在组织内归类账单。 |
| 16 | `aic_quantity` | 数字 | 同一笔用量换算成 AI Credits 后的消耗量。 |
| 17 | `aic_gross_amount` | 数字（美元） | AI Credits 口径下的毛额。 |

---

## 关键计算公式

```
net_amount = gross_amount - discount_amount
gross_amount = quantity × applied_cost_per_quantity   （PRU 行）
```

| 概念 | 含义 |
|------|------|
| Gross | 标价（折扣前） |
| Discount | 被抵扣的金额（一般是免费额度） |
| Net | 实付（折扣后） |

PRU 口径与 AIC 口径**并行存在**：每一行同时携带两套数字，前者用 `quantity / gross / discount / net`，后者用 `aic_quantity / aic_gross_amount`（以及推算的 `aic_net_amount`），方便做「换一种计费方式会花多少」的对比。

---

## 示例

### 示例 1：未超额度（`net = 0`）
```
date=2026-04-01, username=octocat, model=Claude Opus 4.6
quantity=15, applied_cost_per_quantity=0.04
gross_amount=0.60, discount_amount=0.60, net_amount=0
exceeds_quota=False, total_monthly_quota=300
aic_quantity=688.72, aic_gross_amount=6.89
```
含义：调用 15 次 Claude Opus 4.6，标价 $0.60，但仍在免费额度内，**实付 $0**。同样的用量按 AIC 计费会消耗约 688 信用点（≈ $6.89）。

### 示例 2：超额度（`net > 0`）
```
date=2026-04-02, username=hubot, model=Claude Opus 4.6
quantity=23.3, applied_cost_per_quantity=0.04
gross_amount=0.932, discount_amount=0, net_amount=0.932
exceeds_quota=True, total_monthly_quota=300
aic_quantity=7.92, aic_gross_amount=0.0792
```

含义：调用 23.3 次 Claude Opus 4.6，标价 $0.93，由于已超出当月免费额度（`exceeds_quota=True`），没有折扣，**实付 $0.93**。

---

## Overview页面数据说明

Overview 页面用两张卡片并排展示两种计费口径：左侧是当前 **PRU 计费**，右侧是 **AIC / usage-based billing 计费**。

### PRU 计费口径

| 界面值 | 含义 | 计算方法 |
|--------|------|----------|
| Consumed (PRUs) | PRU 口径下，所有用量的折扣前费用。 | `sum(gross_amount)` |
| Discount (included PRUs) | 被用户自己的 included PRU 额度抵掉的金额。 | `sum(discount_amount)` |
| Overages | included PRU 抵扣后还需要支付的超额费用。 | `sum(net_amount)`，也等于 `Consumed (PRUs) - Discount (included PRUs)` |
| License cost | Copilot seat 月费。 | 根据 Business / Enterprise seat 数量和对应月费计算。 |
| Total (license + overages) | 当前 PRU 计费方式下的总账单。 | `License cost + Overages` |

PRU 口径的关键点：**included PRUs 按用户独立抵扣**。某个用户没用完的 PRU，不会自动转给另一个用超的用户。

### AIC 计费口径

| 界面值 | 含义 | 计算方法 |
|--------|------|----------|
| Consumed (AICs) | AIC 口径下，所有用量的折扣前费用。 | `sum(aic_gross_amount)` |
| Discount (included AICs) | 被 included AIC pool 抵掉的金额。 | `sum(aic_gross_amount) - sum(aic_net_amount)` |
| Additional usage | included AIC pool 用完后还需要支付的额外费用。 | `sum(aic_net_amount)`，也等于 `Consumed (AICs) - Discount (included AICs)` |
| License cost | Copilot seat 月费。 | 和 PRU 侧相同，根据 Business / Enterprise seat 数量和对应月费计算。 |
| Total (license + additional usage) | AIC 计费方式下的总账单。 | `License cost + Additional usage` |

AIC 口径的关键点：**included AICs 是账号/组织共享池子**。所有用户一起消耗这个池子，池子用完之后，后续用量才进入 Additional usage。


---
## User表 UI 列的对应关系

| UI 列 | 对应 CSV 字段 | 聚合方式 |
|-------|--------------|----------|
| User | `username` | 分组键 |
| PRUs | `quantity`（仅 PRU 行） | 累加 |
| AICs | `aic_quantity` | 累加 |
| Models used | `model` | 去重计数 |
| PRU Net Cost | `net_amount` | 累加 |
| AIC Net Cost | `aic_net_amount`（推算） | 累加 |
| Difference | `net_amount − aic_net_amount` | 用户级差值 |
---

## `aic_net_amount` 是怎么算出来的

> CSV 本身**只有** `aic_quantity` 和 `aic_gross_amount`，**没有** `aic_net_amount`。它是应用根据 included credits 池子按行实时推算出来的

### 第 1 步：确定 included credits 池子

| 报告类型 | 池子规则 | 月度信用点数额 |
|----------|----------|----------------|
| **Organization**（多用户/带组织） | 全组织共享一个大池 | `Business 座位 × 3000 + Enterprise 座位 × 7000` |

座位数默认从 CSV 推断（`total_monthly_quota = 300` → Business，`= 1000` → Enterprise）。

### 第 2 步：按 CSV 行顺序逐行扣减池子

对每一行：


covered        = min(aic_quantity, 剩余池子)
uncovered      = aic_quantity − covered
aic_net_amount = aic_gross_amount × (uncovered / aic_quantity)
剩余池子      -= covered


含义：**这一行有多少比例的信用点超出了免费池，就按那个比例收钱。**

### 一句话总结

> `aic_net_amount = aic_gross_amount × (该行未被免费池抵掉的 AIC 比例)`，全报告按 CSV 行顺序流式扣减一个 included credits 池子。

