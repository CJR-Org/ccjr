import { preprocess } from "./preprocess.js";
import { transpile } from "./translate.js";
import { compile } from "./compile.js";
import { format } from "./postprocess.js";

const types = JSON.parse(Deno.readTextFileSync("./types.json"));
const includes = JSON.parse(Deno.readTextFileSync("./includes.json"));
const config = JSON.parse(Deno.readTextFileSync("./config.json"));
const code_path = Deno.args[0];
let code = Deno.readTextFileSync(code_path);
let args = [...Deno.args];
args.shift();

if (Deno.args.length < 1) {
  console.log("You have not specified a file to transpile, please run the command again with a file name.");

  Deno.exit(1);
}

if (args.includes("-keeptemp")) {
  args.splice(args.indexOf("-keeptemp"), 1);
}


if (args.includes("-verbose")) {
  args.splice(args.indexOf("-verbose"), 1);
}

let start = new Date();
console.log(`Preprocessing ${code_path}...`);
const preprocessed = preprocess(code, config);
code = preprocessed.code;
console.log(`Preprocessed ${code_path} successfully. (${new Date() - start}ms)`);

start = new Date();
console.log(`Transpiling ${code_path}...`);
const lines = code.split("\n");
let output = transpile(lines, types, Deno.args.includes("-verbose"));
console.log(`Transpiled ${code_path} successfully. (${new Date() - start}ms)`);

start = new Date();
console.log(`Postprocessing ${code_path}...`);
output = format(output.join("\n"));
console.log(`Postprocessed ${code_path} successfully. (${new Date() - start}ms)`);

start = new Date();
console.log(`Compiling ${code_path} with GCC...`);
await compile(output, Deno.args.includes("-keeptemp"), includes.includes, args, preprocessed.libraries);
console.log(`Compiled ${code_path} successfully. (${new Date() - start}ms)\n`);