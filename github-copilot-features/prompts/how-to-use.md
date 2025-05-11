Prompt files describe a standalone, complete chat request, including the prompt text, chat mode, and tools to use. Prompt files are useful for creating reusable chat requests for common tasks. For example, you can add a prompt file for creating a front-end component, or to perform a security review.

Prompt files use the .prompt.md file suffix. They can be located in your user data folder or in the workspace. The chat.promptFilesLocations setting lists the folder where prompt files are looked for.

There are several ways to run a prompt file:

Type / in the chat input field, followed by the prompt file name.Screenshot that shows running a prompt in the Chat view with a slash command.

Open the prompt file in an editor and press the 'Play' button in the editor tool bar. This enables you to quickly iterate on the prompt and run it without having to switch back to the Chat view.Screenshot that shows running a prompt by using the play button in the editor.

Use the Chat: Run Prompt File... command from the Command Palette.



Prompt files can have the following Front Matter metadata headers to indicate how they should be run:

mode: the chat mode to use when invoking the prompt (ask, edit, or agent mode).
tools: if the mode is agent, the list of tools that are available for the prompt.



To create a prompt file, use the Chat: New Prompt File... command from the Command Palette.