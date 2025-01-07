const fs = require("fs");

let path = "./effects/"
let scripts = fs.readdirSync(path);
let count = 0;
let scriptObj = {};
for(let file of scripts)
{
  let script = fs.readFileSync(path + file, {encoding:"utf8"});
  scriptObj[file.split(".")[0]] = script;
  count++;
}

let scriptLoader = `export default function() 
{
    Hooks.on("init", () => 
    {
        foundry.utils.mergeObject(game.wng.config.effectScripts, ${JSON.stringify(scriptObj)});
    });

}`

fs.writeFileSync("./scripts/loadEffects.js", scriptLoader)
console.log(`Packed ${count} scripts`);