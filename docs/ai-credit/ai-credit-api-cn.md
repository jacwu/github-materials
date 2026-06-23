# Github Copilot AI Credit 用量 API说明

## 目录

- [1. 企业级 AI Credit 用量](#1-企业级-ai-credit-用量)
- [2. 组织级 AI Credit 用量](#2-组织级-ai-credit-用量)
- [3. 用户级 AI Credit 用量](#3-用户级-ai-credit-用量)
- [4. 查询预算列表](#4-查询预算列表)
- [5. 查询单个预算](#5-查询单个预算)
- [6. 创建预算](#6-创建预算)
- [7. 修改预算](#7-修改预算)
- [8. 删除预算](#8-删除预算)
- [9. 查询用量报告导出列表](#9-查询用量报告导出列表)
- [10. 创建用量报告导出](#10-创建用量报告导出)
- [11. 查询用量报告状态](#11-查询用量报告状态)

---

## 1. 企业级 AI Credit 用量

`GET /enterprises/{enterprise}/settings/billing/ai_credit/usage`

返回指定月份的 AI Credit 总消耗，按 **(product, sku, model)** 维度聚合。

### 企业级参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| year | query | integer | 可选，年份，默认当前年 |
| month | query | integer | 可选，月份（1-12），默认当前月 |
| day | query | integer | 可选，天（1-31） |
| model | query | string | 可选，筛选模型 |
| product | query | string | 可选，筛选产品 |

### 企业级示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/ai_credit/usage?year=2026&month=6"
```

### 企业级示例响应

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

## 2. 组织级 AI Credit 用量

`GET /organizations/{org}/settings/billing/ai_credit/usage`

返回与企业端点相同结构，按组织维度聚合。顶层 `enterprise` 字段替换为 `organization`。

### 组织级参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| org | path | string | 组织 slug |
| year | query | integer | 可选，年份，默认当前年 |
| month | query | integer | 可选，月份（1-12），默认当前月 |
| day | query | integer | 可选，天（1-31） |
| user | query | string | 可选，筛选单个用户 |
| model | query | string | 可选，筛选模型 |
| product | query | string | 可选，筛选产品 |

### 组织级示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/organizations/<org_slug>/settings/billing/ai_credit/usage?year=2026&month=6"
```

### 组织级示例响应

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

## 3. 用户级 AI Credit 用量

`GET /enterprises/{enterprise}/settings/billing/ai_credit/usage?year={YYYY}&month={M}&user={login}`

按企业计费口径查询单个用户的 AI Credit 用量，返回与企业端点相同结构，并在顶层额外包含 `user` 字段。实测该方式适用于由企业统一管理 Copilot 授权的用户。

> **注意：** `GET /users/{username}/settings/billing/ai_credit/usage` 仅当用户自行购买个人版 Copilot 计划时才有数据。如果用户的 Copilot 授权由组织或企业统一管理，请使用本节的企业级端点加 `user` query 参数。

### 用户级参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| year | query | integer | 可选，年份，默认当前年 |
| month | query | integer | 可选，月份（1-12），默认当前月 |
| day | query | integer | 可选，天（1-31） |
| user | query | string | GitHub login，用于筛选单个用户 |
| model | query | string | 可选，筛选模型 |
| product | query | string | 可选，筛选产品 |

### 用户级示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/ai_credit/usage?year=2026&month=6&user=<login>"
```

### 用户级示例响应

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

## 4. 查询预算列表

`GET /enterprises/{enterprise}/settings/billing/budgets`

### 查询预算列表参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| scope | query | string | 可选，筛选预算范围，例如 `user`、`multi_user_customer`、`enterprise` |
| user | query | string | 可选，筛选某个用户适用的预算 |
| budgetTarget | query | string | 可选，筛选 SKU；AI Credit 场景填 `ai_credits` |

### 查询预算列表示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?scope=user"
```

### 查询预算列表示例响应

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

也可以查询某个用户的 AI Credit 预算：

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?user=<username>&budgetTarget=ai_credits"
```

查询通用用户级预算：

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets?scope=multi_user_customer"
```

---

## 5. 查询单个预算

`GET /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### 查询单个预算参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| budget_id | path | string | 预算 ID |

### 查询单个预算示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets/<budget_id>"
```

### 查询单个预算示例响应

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

## 6. 创建预算

`POST /enterprises/{enterprise}/settings/billing/budgets`

### 创建预算参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| budget_amount | body | number | 预算金额（美元） |
| budget_scope | body | string | 预算范围，例如 `enterprise`、`organization`、`user` |
| budget_entity_name | body | string | 预算目标名称；单用户预算时与 `user` 填同一个 GitHub login |
| user | body | string | 当 `budget_scope` 为 `user` 时填写 GitHub 用户名 |
| organization | body | string | 当 `budget_scope` 为 `organization` 时填写组织 slug |
| prevent_further_usage | body | boolean | 是否达到预算后阻止继续使用；`user` scope 必须为 `true` |
| budget_product_sku | body | string | AI Credit 场景固定填 `ai_credits` |
| budget_type | body | string | 通常填 `BundlePricing` |
| consumed_amount | body | number | 可选，创建时通常填 `0` |
| budget_alerting | body | object | 告警配置，包含 `will_alert` 和 `alert_recipients` |
| budget_thresholds | body | object | 可选，阈值配置；通用用户级预算示例中可能使用 |
| exclude_cost_center_usage | body | boolean | 可选，仅 enterprise scope 有意义；是否排除成本中心用量 |

### 创建单用户 AI Credit 预算示例请求

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

### 创建预算示例响应

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

### 创建通用用户级 AI Credit 预算示例请求

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

## 7. 修改预算

`PATCH /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### 修改预算参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| budget_id | path | string | 预算 ID |
| budget_amount | body | number | 新预算金额（美元） |
| prevent_further_usage | body | boolean | 是否达到预算后阻止继续使用；`user` scope 必须为 `true` |
| budget_alerting | body | object | 告警配置 |

### 修改预算示例请求

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

### 修改预算示例响应

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

## 8. 删除预算

`DELETE /enterprises/{enterprise}/settings/billing/budgets/{budget_id}`

### 删除预算参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| budget_id | path | string | 预算 ID |

### 删除预算示例请求

```bash
curl -X DELETE \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/budgets/<budget_id>"
```

### 删除预算示例响应

```json
{
  "message": "Budget successfully deleted.",
  "id": "<budget_id>"
}
```

---

## 9. 查询用量报告导出列表

`GET /enterprises/{enterprise}/settings/billing/reports`

列出 enterprise 下已创建的用量报告导出任务。返回结果包含每个导出任务的状态，以及已完成任务的下载链接。

### 查询用量报告导出列表参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |

### 查询用量报告导出列表示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/reports"
```

### 查询用量报告导出列表示例响应

```json
{
  "usage_report_exports": [
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
  ]
}
```

---

## 10. 创建用量报告导出

`POST /enterprises/{enterprise}/settings/billing/reports`

触发异步导出，生成可下载的 CSV，包含每人每模型的明细。`report_type` 填 `ai_credit`（仅适用于6月1日后的数据）。

### 创建用量报告参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| report_type | body | string | 固定填 `ai_credit` |
| start_date | body | string | 开始日期，格式 `YYYY-MM-DD` |
| end_date | body | string | 结束日期，格式 `YYYY-MM-DD` |

### 创建用量报告示例请求

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

### 创建用量报告示例响应

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

## 11. 查询用量报告状态

`GET /enterprises/{enterprise}/settings/billing/reports/{report_id}`

### 查询用量报告状态参数

| 参数 | 位置 | 类型 | 说明 |
| --- | --- | --- | --- |
| enterprise | path | string | 企业 slug |
| report_id | path | string | 报告 ID（POST 返回的 id） |

### 查询用量报告状态示例请求

```bash
curl -X GET \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "https://api.github.com/enterprises/<enterprise_slug>/settings/billing/reports/<report_id>"
```

### 查询用量报告状态示例响应

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
