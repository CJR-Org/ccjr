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

export function transpile(lines, types) {
  let output = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line.trim();
    let new_line = "";

    line.split(/[\s\t]+/).forEach((word) => {
      if (word === "var") {
        const name = line.split(":")[0].split("var")[1].trim();
        let type = line.split(":")[1];
        const value = type.split("=")[1].trimStart();
        type = type.split("=")[0].trim();

        new_line += `${get_type(type, types)} ${name} = ${value}`;
      }

      if (word === "func") {
        const name = line.split("func")[1].split("(")[0].trim();
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

        new_line += `${get_type(type, types)} ${name}(${translated_args.join(", ")}) {`;
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

  return output;
}
