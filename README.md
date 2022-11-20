## Dependencies
```
$ cd vscode-textmate
$ git submodule init  
$ git submodule update
$ npm install
$ npm run compile
```

## Run
```
$ cd vscode-textmate  
$ npm run inspect-terse ../tm/n3.tmLanguage.json ../tm/test0.n3 | grep -E "(Tokenizing| - token)"
```
