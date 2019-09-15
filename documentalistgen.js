const { Documentalist, MarkdownPlugin, TypescriptPlugin } = require("@documentalist/compiler");
const { writeFileSync } = require("fs");

new Documentalist()
    .use(".md", new MarkdownPlugin())
    .use(/\.tsx?$/, new TypescriptPlugin({ excludeNames: [/I.+State$/] }))
    .documentGlobs("{src,docs}/**/*") // ← async operation, returns a Promise
    .then(docs => JSON.stringify(docs, null, 2))
    .then(json => writeFileSync("docs.json", json))