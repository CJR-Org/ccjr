let code = Deno.readTextFileSync(Deno.args[0]);
let jsonFiles = [];
let lines = code.split("\n");

for (const dirEntry of Deno.readDirSync('.')) {
    if(dirEntry.name.endsWith(".json")) {
        jsonFiles.push(dirEntry.name.split(".json")[0]);
    }
}

for(let i = 0; i < lines.length; i++) {
    jsonFiles.forEach(j => {
        if(lines[i].split(" ").join("").includes(`${j}=JSON.parse(`)) {
            lines[i] = `const ${j} = ${Deno.readTextFileSync(`${j}.json`).split("\n").join("")};`;
        }
        if(lines[i].trim().startsWith("//")) lines.splice(i, 1);
    });
}

code = lines.join("\n");
code = code.split("\n\n").join("\n");
code = code.split("  ").join("");
code = code.split("\t").join("");
code = code.split("\n").join("");

Deno.writeTextFileSync("bundled.js", code);
console.log("Bundled into bundled.js");