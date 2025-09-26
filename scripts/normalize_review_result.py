import os
import sys
from pathlib import Path

from openai import AzureOpenAI

PROMPT = (
    "From the provided source text, locate the table whose first header cell is \"File\". "
    "If no such table exists, output exactly \"No Code Review Result Generated\". "
    "If the source already forms a valid GitHub-flavored Markdown table with exactly these four "
    "columns in this exact order: File | Concern | Recommendation | Severity, output it verbatim "
    "(no extra lines, no code fences, no prose). If it is NOT a valid table (e.g., missing the "
    "separator row, header and data crammed into one line, inconsistent or extra pipes, wrong "
    "column count/order), repair it using ONLY the existing cells’ content as follows:\n\n"
    "Rules for repairing:\n\n"
    "Split the content into exactly four columns: File, Concern, Recommendation, Severity (do not "
    "rename or reorder columns).\n"
    "Preserve every cell’s text exactly (trim only leading/trailing whitespace around each cell).\n"
    "Do not invent, rephrase, summarize, merge, or delete concerns; do not add new rows.\n"
    "If multiple data rows are accidentally concatenated, separate them only if a clear repeated "
    "pattern of the four columns exists; otherwise treat everything after the header as a single "
    "data row.\n"
    "Insert (or fix) the mandatory separator line: | --- | --- | --- | --- |\n"
    "Remove duplicate consecutive pipe characters (||) unless representing an empty cell; collapse "
    "them to a single pipe delimiter.\n"
    "Ensure there are no extra leading/trailing pipes beyond the standard Markdown form (a leading "
    "and trailing pipe are both allowed but must be consistent across all lines).\n"
    "Output must be exactly: header line, separator line, data row(s). No blank lines before/after.\n\n"
    "Source Text:\n\n"
)


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        print(f"Environment variable '{name}' is required.", file=sys.stderr)
        raise SystemExit(1)
    return value


def main() -> None:
    source_path = Path("raw_review.md")
    if not source_path.exists():
        print("raw_review.md not found; cannot repair review output.", file=sys.stderr)
        raise SystemExit(1)

    source_text = source_path.read_text(encoding="utf-8")

    api_key = require_env("AZURE_OPENAI_API_KEY")
    base_url = require_env("AZURE_OPENAI_BASE_URL")
    api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2025-03-01-preview")
    model = os.environ.get("AZURE_OPENAI_MODEL", "gpt-5-codex")

    client = AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=base_url,
    )

    prompt = f"{PROMPT}{source_text}"

    print(f"prompt: {prompt}")

    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "system",
                "content": "You are a meticulous code review formatter who never alters substantive content.",
            },
            {"role": "user", "content": prompt},
        ],
        max_output_tokens=2048,
    )

    print(f"response: {response}")

    output_text = response.output_text

    print(f"output_text: {output_text}")


    output_path = Path("review_result.md")
    if not output_text.endswith("\n"):
        output_text += "\n"
    output_path.write_text(output_text, encoding="utf-8")

    print(f"Wrote repaired review to {output_path}.")


if __name__ == "__main__":
    main()
