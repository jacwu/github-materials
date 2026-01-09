import argparse
import os
import sys
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description="Call an Azure Foundry Agent.")
    parser.add_argument("prompt", help="The prompt to send to the agent.")
    parser.add_argument(
        "--agent-name",
        default=os.environ.get("AZURE_AI_AGENT_NAME"),
        help="The name of the agent to call. Defaults to AZURE_AI_AGENT_NAME environment variable.",
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
    
    if not args.agent_name:
        print("Error: Agent Name is required. Set AZURE_AI_AGENT_NAME env var or use --agent-name.", file=sys.stderr)
        sys.exit(1)

    try:
        project_client = AIProjectClient(
            endpoint=args.endpoint,
            credential=DefaultAzureCredential(),
        )

        # Get an existing agent
        agent = project_client.agents.get(agent_name=args.agent_name)

        openai_client = project_client.get_openai_client()

        # Reference the agent to get a response
        response = openai_client.responses.create(
            input=[{"role": "user", "content": args.prompt}],
            extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
        )

        print(response.output_text)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
