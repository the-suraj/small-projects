// const http = require('http');
const Prism = require('prismjs');
const code = `
// const http = require('http');
const Prism = require('prismjs');
const code = \`

const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

\`;
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

console.log(html);
`;
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

console.log(html.split('\n').join("</br>"));