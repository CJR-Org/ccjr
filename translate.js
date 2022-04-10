import { requires_semicolon } from "./postprocess.js"

function get_type(type, types) {
  let split = type.split(" ");

  // let append = "";

  // if (type.includes("*")) {
    // append = "*";
    // type = type.split("*").join("");
  // }

  for(let i = 0; i < split.length; i++) {
    if(types[split[i]]) split[i] = types[split[i]];
  };

  // if (types[type]) return types[type];
  // return type;
  return split.join(" ");
  // console.error(`Unknown Type: "${type}"`);
}

export function transpile(lines, types, verbose) {
  let output = [];
  let namespace = [];
  let namespace_pos = [];
  let brackets = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line = line.trim();
    let new_line = "";
    let ns = [...namespace].reverse().join("_o_") + "_o_";
    if(!namespace[0]) ns = "";
    if(line.startsWith("//")) line = "";

    line.split(/[\s\t]+/).forEach((word) => {
      if (word === "var") {
        const name = line.split(":")[0].split("var ")[1].trim();
        let type = line.split(":")[1];
        const value = type.split("=")[1].trimStart();
        type = type.split("=")[0].trim();

        if(verbose) console.log(`Found variable symbol: ${name} with type ${type} in namespace "${ns}"\n`);

        new_line += `${get_type(type, types)} ${ns}${name} = ${value}`;
      }

      if (word === "func") {
        const name = line.split("func ")[1].split("(")[0].trim();
        const type = line.split(")")[1].split(":")[1].split("{")[0].trim();
        let args = line.split("(")[1].split(")")[0].split(",");
        if(args.length === 1) {
          if(line.split("(")[1].split(")")[0].trim().length !== 0) {
            args = [line.split("(")[1].split(")")[0]];
          } else {
            args.pop();
          }
        }
        const translated_args = [];

        args.forEach((arg) => {
          let arg_name = arg.split(":")[0].trim();
          let arg_type = arg.split(":")[1].trim();
          translated_args.push(`${get_type(arg_type, types)} ${arg_name}`);
        });


        if(verbose) console.log(`Found function symbol: ${name} with return type ${type} in namespace "${ns}" and args: ${translated_args.join(", ")}\n`);

        new_line += `${get_type(type, types)} ${ns}${name}(${translated_args.join(", ")}) {`;
      }

      if(word.includes("::")) {
        if(!new_line) new_line = line;
        // console.log(new_line);
        // let start = new_line.split("::")[0].split(" ")[1];
        // console.log(start);
        // if(start.includes('"') || start.includes("'")) {

        new_line = new_line.split("::").join("_o_");

        if(verbose) console.log(`Found namespace member reference symbol: ${line} in namespace ${ns}, deobjectified to ${new_line}\n`);
      }

      if(word == "namespace") {
        const name = line.slice("namespace ".length).split("{")[0].trim();
        namespace_pos.push(brackets);
        namespace.unshift(name);
        line = "";

        if(verbose) console.log(`Found namespace declaration symbol: ${name} in namespace "${ns}"\n`);
      }

      if(word == "{") {
        brackets++;
      }

      if(word == "}") {
        brackets--;

        if(namespace_pos.includes(brackets)) {
          namespace_pos.splice(namespace_pos.indexOf(brackets), 1);
          namespace.shift();
          line = "";
        }
      }
    });

    // if(line.startsWith("}") && line.split(" ").length == 2 && line.length > 2 && !line.includes(")") && line.split("}").length == 2) {
    //   const name = line.split("}")[1].split(";")[0].trim();

    //   if(verbose) console.log(`Found closing namespace symbol: ${name} in namespace "${ns}"\n`);

    //   if(namespace.includes(name)) {
    //     namespace.shift();
    //     line = "";
    //   } else {
    //     throw new Error(`Unknown namespace ${name}`);
    //   }
    // }

    if (!new_line) {
      if (requires_semicolon(line)) line += ";";
      output.push(line);
    } else {
      if (requires_semicolon(new_line)) new_line += ";";
      output.push(new_line);
    }
  }

  return output;
}
