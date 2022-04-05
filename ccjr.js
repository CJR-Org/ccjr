console.log("CCJR - The CJR Compiler");

if (Deno.args.length < 1) {
  console.log("You have not specified a file to transpile, please run the command again with a file name.");

  Deno.exit(1);
}

let code = Deno.readTextFileSync(Deno.args[0]);
const types = JSON.parse(Deno.readTextFileSync("./types.json"));

// might write an automatic include system or just make the user include headers
// very temporary
const includes = JSON.parse(Deno.readTextFileSync("./includes.json"));
const config = JSON.parse(Deno.readTextFileSync("./config.json"));

const output = [];

function get_type(type) {
  let append = "";

  if (type.includes("*")) {
    append = "*";
    type = type.split("*").join("");
  }

  if (types[type]) return types[type] + append;
  console.error(`Unknown Type: "${type}"`);
}

function requires_semicolon(line) {
  line = line.trim();
  if (line.endsWith("{")) return false;
  if (line.endsWith("(")) return false;
  if (line.endsWith(";")) return false;
  if (!line) return false;
  return true;
}

function require_externals(code, prefix = "") {
  code.split("\n").forEach(line => {
    if (line.trim().startsWith("require")) {
      const path = eval(line.split("require(")[1].split(")")[0]);
      let required_code;
      if (path.startsWith(".")) {
        required_code = Deno.readTextFileSync(`${prefix}${path}`);
      } else {
        required_code = Deno.readTextFileSync(`./modules/${path}/index.${config.extension}`);
        while (required_code.includes("require")) {
          required_code = require_externals(required_code, `./modules/${path}/`);
        }
      }

      code = `${required_code}\n${code}`;
      code = code.split(line).join("");
    }
  });

  return code;
}

function includes_require(code) {
  let has_require = false;

  code.split("\n").forEach(line => {
    if (line.trim().startsWith("require(")) has_require = true;
  });

  return has_require;
}

function preprocess() {
  while (includes_require(code))
    code = require_externals(code);

  return code;
}

function transpile(lines) {
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line.trim();
    let new_line = "";

    line.split(" ").forEach((word) => {
      if (word === "var") {
        const name = line.split(":")[0].split("var")[1].trim();
        let type = line.split(":")[1];
        const value = type.split("=")[1].trimStart();
        type = type.split("=")[0].trim();

        new_line += `${get_type(type)} ${name} = ${value}`;
      }

      if (word === "func") {
        const name = line.split("func")[1].split("(")[0].trim();
        const type = line.split(")")[1].split(":")[1].split("{")[0].trim();
        const args = line.split("(")[1].split(")")[0].split(",");
        const translated_args = [];

        if (args.length === 1) args.pop();

        args.forEach((arg) => {
          let arg_name = arg.split(":")[0].trim();
          let arg_type = arg.split(":")[1].trim();
          translated_args.push(`${get_type(arg_type)} ${arg_name}`);
        });

        new_line += `${get_type(type)} ${name}(${translated_args.join(", ")}) {`;
      }
    });

    if (!new_line) {
      if (requires_semicolon(line)) line += ";";
      output.push(line);
    } else {
      if (requires_semicolon(new_line)) new_line += ";";
      output.push(new_line);
    }
  }
}

async function compile(output) {
  const temp_name = `temp_${Math.floor(Math.random() * 1000000).toString()}.c`;
  Deno.writeTextFileSync(temp_name, `#include <${includes.includes.join(">\n#include <")}>\n${output.join("\n")}`);
  const compilation = Deno.run({ cmd: ["gcc", temp_name] });
  await compilation.status();
  if (!Deno.args.includes("--keep-temp")) Deno.removeSync(temp_name);
}

async function run() {
  let start = new Date();
  console.log("Preprocessing...");
  code = preprocess(code);
  console.log(`Preprocessed successfully. (${new Date() - start}ms)`);
  
  start = new Date();
  console.log("Transpiling...");
  const lines = code.split("\n");
  transpile(lines);
  console.log(`Transpiled successfully. (${new Date() - start}ms)`);
  
  start = new Date();
  console.log("Compiling with gcc...");
  await compile(output);
  console.log(`Compiled successfully. (${new Date() - start}ms)`);
}

await run();