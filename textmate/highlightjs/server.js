const hljs = require("highlight.js/lib/core");  // require only the core library
// separately require languages
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript.js'));

const code = `
// const http = require('http');
const Prism = require('prismjs');
const code = \`

const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

\`;
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

console.log(html);
`;

const highlightedCode = hljs.highlight('javascript', code).value

console.log(highlightedCode.split('\n').join("</br>"));