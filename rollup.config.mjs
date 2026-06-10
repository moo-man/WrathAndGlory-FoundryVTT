import fs from "fs";
import foundryPath from "./foundry-path.js";
import copy from 'rollup-plugin-copy-watch'
import postcss from "rollup-plugin-postcss"
import jscc from 'rollup-plugin-jscc'
import simpleGit from 'simple-git';
import yargs from 'yargs';

let args = yargs(process.argv.slice(2)).parse();

let latest = args.configLatest;
if (!latest)
{
    latest = await new Promise(resolve => {
        simpleGit({baseDir: process.cwd()}).tags((err, tags) => resolve(tags.latest));
    })
}

let manifest = JSON.parse(fs.readFileSync("./system.json"));
let systemPath = foundryPath(manifest.id, manifest.compatibility.verified);

console.log("Setting Version " + latest)
console.log("Bundling to " + systemPath);

export default {
  input: [`./scripts/${manifest.id}.js`, `./style/${manifest.id}.scss`],
    output: {
        dir : systemPath
    },
    watch : {
        clearScreen: true
    },
    plugins: [
        jscc({      
            values : {_ENV :  process.env.NODE_ENV}
        }),
        copy({
            targets : [
                {src : "./system.json", dest : systemPath, transform: (contents) => contents.toString().replaceAll("@VERSION", latest)},
                {src : "./static/*", dest : systemPath},
            ],
            watch: process.env.NODE_ENV == "production" ? false : ["./static/*/**", "system.json", "template.json"]
        }),
        postcss({
            extract : `${manifest.id}.css`,
            plugins: []
          })
    ]
}