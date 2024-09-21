# Codemirror Typespec Demo

This project serves as a demo of useing Typespec with Codemirror.

A Node.js server is running the Typespec compiler language server, connected via [codemirror-languageserver](https://github.com/FurqanSoftware/codemirror-languageserver), because the [@typespec/compiler](https://github.com/microsoft/typespec/tree/main/packages/compiler) does not support browser environments.

![preview](./preview.png)

## preview

```bash
pnpm install

pnpm run dev
```
