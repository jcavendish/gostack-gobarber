# ts-node-bootstrap
This is a typescript node.js bootstrap project

## Installing
To install this project just clone it and run:

```
yarn
```
or
```
npm install
```

## What is ts-node-bootstrap
This project was created in order to give us the boiler-plate code of a typescript node/express project. Here is included a basic folder structure, express with a simple GET route, cors, and some utilities as: 
 - eslint
 - prettier
 - editorconfig
 - ts-node-dev
 
 ## More configs
 
### VS Code Debugger 
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "protocol": "inspector",
      "restart": true,
      "name": "Debug",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "outFiles": [
        "${workspaceFolder}/**/*.js"
      ]
    }
  ]
}

```

### VS Code setting.json additional settings:
```
    "[javascript]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
        }
    },
    "[javascriptreact]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
        }
    },
    "[typescript]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
        }
    },
    "[typescriptreact]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
        }
    },
```
