# 🤔 InMind

InMind is a web application designed to show how LLMs like ChatGPT can find answers by reflecting on information and using the provided tools to arrive at the final answer.

## Features

### Question Answering

![Ask Question mode](./screenshot-1.png)

### English grammar fixer

![English Grammar fixer](./screenshot-2.png)

## Project setup
```
npm install -g pnpm@8.0.0

pnpm install
```

### Compiles and hot-reloads for development
```
pnpm run serve
```

### Compiles and minifies for production
```
pnpm run build
```

### Lints and fixes files
```
pnpm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## To Do
- [ ] [Question Answering] Clear the observation if it does not help to find the answer in order to save memory.
- [ ] [Question Answering] Summarize all the steps taken before providing the final answer to the prompt in order to save memory.
- [ ] [English Grammar fixer] Add writing style
- [ ] [English Grammar fixer] Auto copy the improved text to the clipboard