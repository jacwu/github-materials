# Configure Azure Foundry Models for GitHub Copilot

GitHub Copilot supports **Bring your own API keys**, which lets you add models deployed in Microsoft Foundry as custom models available in VS Code. This feature is currently in Preview, so the UI and fields may change in future GitHub updates.

This guide uses `DeepSeek-V3.2` deployed in Azure Foundry as an example. It shows how to get the model deployment information, add a Microsoft Foundry API key in a GitHub enterprise or organization, and verify that the model is available in VS Code.

> Reference: GitHub Docs - [Using your LLM provider API keys with Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/use-your-own-api-keys)

---

## Prerequisites

Before you start, make sure you have the following:

1. The target model has already been deployed in Azure AI Foundry.
2. You can copy the **Project endpoint** and **API Key** from the Foundry model deployment page.
3. You have GitHub Enterprise or Organization administrator permissions and can access **AI Controls** and Copilot model settings.
4. The users who will use this custom model can access the corresponding GitHub Enterprise or Organization.

---

## Step 1: Get Model Deployment Information from Azure Foundry

In your Azure AI Foundry project, select **Deployments** in the left navigation, open the **Deployed models** list, and select the model deployment that you want to connect to GitHub Copilot.

In the details panel on the right, record two values:

1. **API Key**: Click the copy button to copy the key for this deployment.
2. **Project endpoint**: The Foundry screenshot shows a project endpoint in the following format:

```text
https://<foundry-service-name>.services.ai.azure.com/openai/v1
```

![Copy the Project endpoint and API Key from the Azure Foundry model deployment page](./1.jpg)

When adding a Microsoft Foundry custom model in GitHub Copilot, you need to enter the deployment's **chat completions** URL instead of the `services.ai.azure.com/openai/v1` URL shown directly in Foundry. Convert the endpoint to the following format:

```text
https://<foundry-service-name>.cognitiveservices.azure.com/openai/deployments/<deployment-name>/chat/completions?api-version=2024-05-01-preview
```

For example, if the endpoint shown in Foundry is:

```text
https://contoso-foundry.services.ai.azure.com/openai/v1
```

And the deployment name is:

```text
DeepSeek-V3.2
```

Then the **Deployment URL** to enter in GitHub should be:

```text
https://contoso-foundry.cognitiveservices.azure.com/openai/deployments/DeepSeek-V3.2/chat/completions?api-version=2024-05-01-preview
```

## Step 2: Enable Custom Models in GitHub

Go to the GitHub Enterprise administration page and select **AI Controls** in the top navigation. In the Copilot settings, find **Enable custom models** and set it to **Enabled**.

After this setting is enabled, the enterprise or organization can add third-party or self-hosted models by using API keys.

![Enable custom models in GitHub AI Controls](./2.jpg)

## Step 3: Open the Copilot Model Configuration Page

Still under **AI Controls**, select **Copilot** in the left navigation, then click **Configure allowed models**.

This page is used to manage the Copilot models that enterprise or organization members are allowed to use, including GitHub default models and custom models added through API keys.

![Open Configure allowed models in AI Controls](./3.jpg)

## Step 4: Add a Microsoft Foundry API Key

On the **Models** page, switch to **Custom models**, then add or edit an API key.

In the drawer on the right, fill in the fields as follows:

1. **Provider**: Select **Microsoft Foundry**.
2. **Name**: Enter a recognizable name, such as `deepseek`. This name helps identify the group of models under this key.
3. **API key**: Paste the API Key copied from the Azure Foundry deployment page.
4. **Deployment URL**: Enter the chat completions URL converted in Step 1:

    ```text
    https://<foundry-service-name>.cognitiveservices.azure.com/openai/deployments/<deployment-name>/chat/completions?api-version=2024-05-01-preview
    ```

5. **Available models**: Enter the model ID that you want to expose to Copilot, then click the plus button to add the model.
6. Select the model you want to enable, then save the configuration.

![Add a Microsoft Foundry API key, Deployment URL, and model in Custom models](./4.jpg)

## Step 5: Confirm Model Capabilities and Endpoint Type

After saving the API key, switch to **Added models** and click the newly added model to open its configuration page.

On the **General** tab, confirm the following settings:

1. Set **Endpoint type** to **Chat completions API**.
2. If you want the model to be available in Agent mode, select **Tool calling**.
3. If the server supports streaming responses, select **Streaming**.
4. If the model supports thinking or reasoning capabilities, select **Thinking** as appropriate.
5. Set the maximum input and output token values based on the model and deployment capabilities. You can also leave these fields empty.

![Confirm Endpoint type and model capabilities in Added models](./5.jpg)

## Step 6: Verify the Model in VS Code

After saving the model configuration, wait a few minutes for the GitHub Copilot model configuration to take effect. Then restart VS Code, open GitHub Copilot Chat, and check the model picker for the custom model you added, such as `DeepSeek-V3.2`.

If the model appears in the model picker, select it and send a simple prompt to confirm that it returns a response successfully. If the model is available, Copilot Chat will show the response and display the selected model name near the input box.

![Select and test the custom model in VS Code Copilot Chat](./6.jpg)

## Step 7: If the Model Does Not Appear in VS Code, Configure Access

If the custom model still does not appear in the VS Code model picker after waiting a few minutes, go back to the GitHub model configuration page, switch to the **Access** tab, and check which organizations can use the model.

Start by selecting **Allow for all organizations** to allow all organizations in the enterprise to use the model. Save the setting, then return to VS Code, wait a few minutes, and refresh the model list. If your enterprise needs more granular access control, you can change the setting to **Choose per organization** after confirming that the model works.

Click **Save** after updating the access configuration.

![Configure organization access on the model Access tab](./7.jpg)
