Instructions files (also known as custom instructions or rules) provide a way to describe common guidelines and context for the AI model in a Markdown file, such as code style rules, or which frameworks to use. Instructions files are not standalone chat requests, but rather provide context that you can apply to a chat request.

Instructions files use the .instructions.md file suffix. They can be located in your user data folder or in the workspace. The chat.instructionsFilesLocations setting lists the folders that contain instruction files.

You can manually attach instructions to a specific chat request, or they can be automatically added:

To add them manually, use the Add Context button in the Chat view, and then select Instructions.... Alternatively use the Chat: Attach Instructions... command from the Command Palette. This brings up a picker that lets you select existing instructions files or create a new one to attach.

To automatically add instructions to a prompt, add the applyTo Front Matter header to the instructions file to indicate which files the instructions apply to. If a chat request contains a file that matches the given glob pattern, the instructions file is automatically attached.

The following example provides instructions for TypeScript files (applyTo: '**/*.ts')



You can create instruction files with the Chat: New Instructions File... command. Moreover, the files created in the user data folder can be automatically synchronized across multiple user machines through the Settings Sync service. Make sure to check the Prompts and Instructions option in the Backup and Sync Settings... dialog.