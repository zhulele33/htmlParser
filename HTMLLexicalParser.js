
class StartTagToken {}

class EndTagToken {}

class Attribute {}

function HTMLLexicalParser(syntaxer){
    var token = null
    var attribute = null
    var data = function(c){
        if(c=="<") { //< 开始标签
            return tagOpenState;
        }
        emitToken(c);
        return data;
    }
    var tagName = function(c){
        if(c == '/'){
            return selfClosingTag
        }
        if(/[\t \f\n]/.test(c)){
            return beforeAttributeName
        }
        if(/[a-zA-Z]/.test(c)){
            token.name += c
            return tagName
        }
        if(c == '>') {
            emitToken(token)
            return data
        }
    }
    var selfClosingTag = function(c){
        if (c === '>') {
            emitToken(token)
            return data
        }
        error(c)
    }
    var beforeAttributeName = function(c){
        if(c =='/'){
            return selfClosingTag
        }
        if(c == '>'){
            emitToken(token)
            return data
        }
        if (/[\t \f\n]/.test(c)) {
            return beforeAttributeName
        }
        if(/[a-zA-Z]/.test(c)){
            return attributeName
        }
        attribute = new Attribute()
        attribute.name = c.toLowerCase()
        attribute.value = ''
        return attributeName
    }
    var attributeName = function(c){
        if(c == '='){
            return beforeAttributeValue
        }
        if(c == '/'){
            token[attribute.name] = attribute.value
            return selfClosingTag
        }
        if (/[\t \f\n]/.test(c)) {
            return beforeAttributeName
        }
        attribute.name += c.toLowerCase()
        return attributeName
    }
    var beforeAttributeValue = function(c){
        if (c === '"' || c === "'") {
            return attributeValueQuoted
        }
        if (/\t \f\n/.test(c)) {
            return beforeAttributeValue
        }
        attribute.value += c
        return attributeValue
    }
    var attributeValueQuoted = function(c){
        if(c == '"'||c == "'"){
            return beforeAttributeName
        }
        attribute.value += c
        return attributeValueQuoted
    }
    var attributeValue = function(c){
        if (/\t \f\n/.test(c)) {
            token[attribute.name] = attribute.value
            return beforeAttributeName
        }
        attribute.value += c
        return attributeValue
    }
    var tagOpenState = function(c){
        if(c=="/") { //结束标签
            return endTagOpenState;
        }
        if(c.match(/[a-zA-Z]/)) { //
            token = new StartTagToken();
            token.name = c.toLowerCase();
            return tagName;
        }
        // if(c=="?") { 
        //     return bogusCommentState;
        // }
        // if(c=="%") { 模版语言
        //     return bogusCommentState;
        // }
        // if(c=="!") { CDATA 或者注释
        //     return bogusCommentState;
        // }
        error(c);
    };
    var endTagOpenState = function(c){
        if (/[a-zA-Z]/.test(c)) {
            token = new EndTagToken()
            token.name = c.toLowerCase()
            return tagName
          }
          if (c === '>') {
            return error(c)
          }
    }
    var emitToken = function (token) {
        syntaxer(token)
    }
    var error = function (c) {
        console.log(`warn: unexpected char '${c}'`)
    }
    var state = data;
    this.receiveInput = function(char) {
        state = state(char);
    }  
}

module.exports =  HTMLLexicalParser

  
