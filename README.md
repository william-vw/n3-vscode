## Dependencies
Clone & install [https://github.com/william-vw/vscode-textmate](https://github.com/william-vw/vscode-textmate)  
(fork of original; added 'inspect-terse.ts' for simpler test output)


## Run
```
cd vscode-textmate  
npm run inspect-terse <repo>/tm/n3.tmLanguage.json <repo>/tm/test0.n3 | grep -E "(Tokenizing| - token)"
```