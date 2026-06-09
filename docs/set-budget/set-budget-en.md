# Set a GitHub Copilot Usage-Based Billing Budget

GitHub Copilot will officially switch to **Usage-Based Billing** on June 1.

The following recommendations can help enterprises control costs and avoid unexpected billing overages:

1. Set a reasonable ULB for each user: `$19/user` is recommended for Copilot Business, and `$39/user` is recommended for Copilot Enterprise. Any additional granted credits can be added later.
2. Set an Enterprise or Organization Budget as an overage backstop, and make sure to enable **Stop usage when budget limit is reached**.

---

## Step 1: Start Creating a Budget

1. Go to your GitHub Enterprise.
2. In the top navigation, select **Billing and licensing**.
3. In the left menu, select **Budgets and alerts**.
4. In the upper-right corner of the page, click **New budget**.

![New budget button on the Budgets and alerts page](./step1_newbudget.png)

## Step 2: Set an Enterprise Budget

On the budget creation page, configure the enterprise-level budget as follows:

1. For **Budget type**, select **AI credits budget**.
	- This budget covers all SKUs that consume AI Credits.
2. For **Budget scope**, select **Enterprise**.
	- Enterprise scope tracks spending across all organizations, repositories, and cost centers in the enterprise.
	- If you need cost center usage to be excluded from this budget limit, you can select **Exclude cost center usage from this budget**. In most cases, it is recommended to leave this unchecked so the enterprise budget acts as the unified backstop.
3. For **Budget amount**, enter the enterprise-level monthly budget amount.
	- This amount limits additional usage spending after the included AI Credits Pool is exhausted.
	- You can start with a conservative amount and adjust it later after observing actual usage.
4. Select **Stop usage when budget limit is reached**.
	- This is the key setting. When enabled, GitHub stops additional overage usage once the budget reaches its limit, preventing the bill from continuing to grow.
5. It is recommended to select **Receive budget threshold alerts** so you receive email notifications when the budget reaches 90% and 100%, helping you monitor usage in time.
6. Review the configuration and create the budget.

![Enterprise budget configuration page](./step2_enterprisebudget.png)

## Step 3: Set the Default Budget for Each User

Create another new budget to set the default User-Level Budget for each user:

1. For **Budget type**, select **AI credits budget**.
	- This budget covers all SKUs that consume AI Credits.
2. For **Budget scope**, select **Users**.
	- Users scope gives each user in the enterprise their own independent budget.
3. Leave **Select user** blank, without selecting a specific user.
	- Leaving this blank creates a universal budget that applies to every user.
	- If you later need to set a different budget for a high-usage user, you can create a separate budget for that specific user.
4. For **Budget amount**, enter the monthly budget amount per user.
	- `$19/user` is recommended for Copilot Business.
	- `$39/user` is recommended for Copilot Enterprise.
5. Select **Stop usage when user's budget limit is reached**.
	- When enabled, a user who reaches their own budget limit will not continue to generate overage charges.
6. Review the configuration and create the budget.

![Users budget configuration page with Select user left blank](./step3_universaluserbudget.png)

## Step 4: Set a Separate Budget for a Specific User

If some users need a higher or lower budget, you can create additional User-Level Budgets for specific users. A budget set for a specific user takes precedence over the universal user budget created in Step 3.

1. For **Budget type**, select **AI credits budget**.
	- This budget covers all SKUs that consume AI Credits.
2. For **Budget scope**, select **Users**.
	- Users scope applies the budget at the user level.
3. In **Select user**, choose the specific user who needs an individual budget.
	- After you select a specific user, this budget applies only to that user.
	- That user will use this individual budget instead of the universal budget created in Step 3 with no user selected.
4. For **Budget amount**, enter the monthly budget amount for that user.
	- You can set a higher or lower amount based on the user's actual usage needs.
	- For example, you can set a higher budget for high-frequency users.
5. Select **Stop usage when user's budget limit is reached**.
	- When enabled, the user will not continue to generate overage usage after reaching their own budget limit.
6. Review the configuration and create the budget.

![Users budget for a specific user](./step4_individualuserbudget.png)

## Budget Enforcement and Billing Check Order

When users in the enterprise use Copilot features that consume AI Credits, GitHub checks budget controls in a fixed order to determine whether the request should be served normally, move into metered billing, or be blocked.

Each request that consumes AI Credits is checked in the following order:

1. **User-level budget check**: The system first checks whether the user has exceeded their User-Level Budget.
	- If the user has already exceeded it, the current request is blocked immediately.
	- User-Level Budget is always a hard stop.
	- If the user has not exceeded the budget, or if no ULB is configured, the request proceeds to the next step.
2. **Shared pool check**: The system then checks whether the shared pool still has included AI Credits available.
	- If the pool still has credits, the request is deducted from the shared pool and no additional cost is incurred.
	- If the pool is exhausted, the request moves into metered usage and is charged at `$0.01 USD / AI Credit`.
3. **Cost center or enterprise check**: For requests that enter metered usage, the system checks whether the user is assigned to a cost center.
	- If the user is in a cost center, the system checks that cost center's budget. If budget remains, the cost center pays. If the budget is exhausted, the system continues to check whether **Stop usage when budget limit is reached** is enabled.
	- If the user is not in any cost center, the system checks the enterprise spending limit. If the limit has not been reached, the enterprise pays. If the limit has been reached, the system continues to check whether **Stop usage when budget limit is reached** is enabled.

In both the cost center and enterprise cases, as long as **Stop usage when budget limit is reached** is enabled, users are blocked from generating additional overage usage after the budget limit is reached. If it is not enabled, charges continue to accumulate and are not automatically capped.
