export function requires_semicolon(line) {
  line = line.trim();
  if (line.endsWith("{")) return false;
  if (line.endsWith("(")) return false;
  if (line.endsWith(";")) return false;
  if (line.trim().startsWith("#")) return false;
  if (!line) return false;
  return true;
}

function format(code) {
  code.split("\n\n").join("\n");
}