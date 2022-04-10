export function requires_semicolon(line) {
  line = line.trim();
  if (line.endsWith("{")) return false;
  if (line.endsWith("(")) return false;
  if (line.endsWith(";")) return false;
  if (line.trim().startsWith("#")) return false;
  if (!line) return false;
  return true;
}

function generate_indent(count) {
  let ret = "";
  for(let i = 0; i < count; i++) {
    ret += "  ";
  }

  return ret;
}

export function format(code) {
  for(let i = 0; i < 10; i++)
    code = code.split("\n\n\n").join("\n\n");

  let indentation = 0;

  let output = [];

  code.split("\n").forEach(line => {
    line = line.trim();
    if(line.endsWith("};")) indentation--;
    output.push(`${generate_indent(indentation)}${line}`);
    if(line.endsWith("{")) indentation++;
  });

  return output;
}