export async function compile(output, keep_temp, includes, args, libraries) {
  const temp_name = `temp_${Math.floor(Math.random() * 1000000).toString()}.c`;
  Deno.writeTextFileSync(temp_name, `#include <${includes.join(">\n#include <")}>\n${output.join("\n")}`);
  const compilation = Deno.run({ cmd: ["gcc", temp_name, ...args, ...libraries] });
  await compilation.status();
  if (!keep_temp) Deno.removeSync(temp_name);
}