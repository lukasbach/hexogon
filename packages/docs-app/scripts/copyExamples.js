const {copyFileSync, readdirSync, existsSync, mkdirSync} = require('fs');
const path = require('path');

const EXAMPLES_PATH =  path.join(__dirname, '/../../docs-examples/src/');
const DESTINATION_PATH = path.join(__dirname, '/../public/examples/');

if (!existsSync(DESTINATION_PATH)) {
    mkdirSync(DESTINATION_PATH);
}

for (let file of readdirSync(EXAMPLES_PATH)) {
    copyFileSync(path.join(EXAMPLES_PATH, file), path.join(DESTINATION_PATH, file));
}
