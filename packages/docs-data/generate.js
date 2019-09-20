const { Documentalist, MarkdownPlugin, TypescriptPlugin } = require("@documentalist/compiler");
const { writeFileSync, existsSync, mkdirSync, readdirSync } = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, '/../hexogon/src');
const DOCS_DIR = path.join(__dirname, '/../docs/src');
const OUT_FILE = path.join(__dirname, '/src/generated/docs.json');

if (!existsSync(path.dirname(OUT_FILE))) {
    mkdirSync(path.dirname(OUT_FILE));
}

console.log(`Using path "${SOURCE_DIR}" as code source.`);
console.log(`Using path "${DOCS_DIR}" as docs source.`);

new Documentalist(/*{ sourceBaseDir: SOURCE_DIR }*/)
    .use(".md", new MarkdownPlugin())
    .use(/\.tsx?$/, new TypescriptPlugin({ excludeNames: [/I.+State$/] }))
    .documentGlobs(`{${SOURCE_DIR},${DOCS_DIR}}/**/*`) // ← async operation, returns a Promise
    .then(docs => JSON.stringify(docs, null, 2))
    .then(json => writeFileSync(OUT_FILE, json));