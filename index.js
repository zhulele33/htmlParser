const HTMLLexicalParser  = require('./HTMLLexicalParser') 
const testHTML = `<html>
    <body>
        <span>html解析</span>
        <img src="a" alt='wwww'/>
    </body>
`
const lexer = new HTMLLexicalParser(function(token){
    console.log(token)
})

for (let c of testHTML) {
    lexer.receiveInput(c)
  }