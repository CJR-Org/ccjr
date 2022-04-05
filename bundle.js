let code = Deno.readTextFileSync(Deno.args[0]);
let jsonFiles = [];
let lines = code.split("\n");

// get all possible include json files
for (const dirEntry of Deno.readDirSync('.')) {
    if(dirEntry.name.endsWith(".json")) {
        jsonFiles.push(dirEntry.name.split(".json")[0]);
    }
}

// find which json files are actually included and replace them with the contents
for(let i = 0; i < lines.length; i++) {
    jsonFiles.forEach(j => {
        if(lines[i].split(" ").join("").includes(`${j}=JSON.parse(`)) {
            lines[i] = `const ${j} = ${Deno.readTextFileSync(`${j}.json`).split("\n").join("")};`;
        }
        if(lines[i].trim().startsWith("//")) lines.splice(i, 1);
    });
}

// minify code
code = lines.join("\n");                // connect lines back together
code = code.split("\n\n").join("\n");   // remove double newlines
code = code.split("  ").join("");       // remove double spaces
code = code.split("\t").join("");       // remove tabs
code = code.split("\n").join("");       // remove newlines

Deno.writeTextFileSync("bundled.js", code);
console.log("Bundled into bundled.js");