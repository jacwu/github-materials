import argparse
import os
import sys
from dotenv import load_dotenv
from azure.identity import AzureCliCredential
from azure.ai.agents import AgentsClient

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Call an Azure Foundry Agent.")
    parser.add_argument("prompt", help="The prompt to send to the agent.")
    parser.add_argument(
        "--agent-id",
        default=os.environ.get("AZURE_AI_AGENT_ID"),
        help="The ID of the agent to call. Defaults to AZURE_AI_AGENT_ID environment variable.",
    )
    parser.add_argument(
        "--endpoint",
        default=os.environ.get("AZURE_AI_PROJECT_ENDPOINT"),
        help="The Azure AI Project Endpoint. Defaults to AZURE_AI_PROJECT_ENDPOINT environment variable.",
    )

    args = parser.parse_args()

    if not args.endpoint:
        print("Error: Azure AI Project Endpoint is required. Set AZURE_AI_PROJECT_ENDPOINT env var or use --endpoint.", file=sys.stderr)
        sys.exit(1)
    
    if not args.agent_id:
        print("Error: Agent ID is required. Set AZURE_AI_AGENT_ID env var or use --agent-id.", file=sys.stderr)
        sys.exit(1)

    try:
        credential = AzureCliCredential()
        with AgentsClient(endpoint=args.endpoint, credential=credential) as client:
            # Create a thread and run the agent, then wait for completion
            result = client.create_thread_and_process_run(
                agent_id=args.agent_id,
                thread={"messages": [{"role": "user", "content": args.prompt}]},
            )

            if result.status == "failed":
                print(f"Run failed: {result.last_error}", file=sys.stderr)
                sys.exit(1)

            # Get the agent's response
            messages = client.messages.list(thread_id=result.thread_id)
            for message in messages:
                if message.role == "assistant":
                    for content in message.content:
                        if hasattr(content, "text"):
                            print(content.text.value)
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
