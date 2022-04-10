let libraries = [];

function require_externals(code, prefix, config) {
    code.split("\n").forEach(line => {
        if (line.trim().startsWith("include(")) 
        {
            let path = line.split("include(")[1].split(")")[0];
            const is_path = path.startsWith(`"`) && path.endsWith(`"`);
            path = path.slice(1);

            code = code.split(line).join(`#include ${is_path ? '"' : '<'}${prefix}${path}`);
        } 
        else if (line.trim().startsWith("library(")) 
        {
            const path = eval(line.split("library(")[1].split(")")[0]);
            libraries.push(`${prefix}${path}`);
            code = code.split(line).join("");
        }
        else if (line.trim().startsWith("gccflag(")) 
        {
            const flag = eval(line.split("gccflag(")[1].split(")")[0]);
            libraries.push(`-${flag}`);
            code = code.split(line).join("");
        }
        else if (line.trim().startsWith("require(")) 
        {
            const path = eval(line.split("require(")[1].split(")")[0]);
            let required_code;
            if (path.startsWith(".")) {
                required_code = Deno.readTextFileSync(`${prefix}${path}`);
            } else {
                required_code = Deno.readTextFileSync(`./modules/${path}/index.${config.extension}`);
                while (includes_require(required_code)) {
                    required_code = require_externals(required_code, `./modules/${path}/`, config).code;
                }
            }

            //line = required_code;
            // code = `${required_code}\n${code}`;
            code = code.split(line).join(required_code);
        }
    });

    return {code, libraries};
}

function includes_require(code) {
    let has_require = false;

    code.split("\n").forEach(line => {
        if (line.trim().startsWith("require(") 
        || line.trim().startsWith("include(") 
        || line.trim().startsWith("library(")
        || line.trim().startsWith("gccflag(")) has_require = true;
    });

    return has_require;
}

export function preprocess(code, config) {
    libraries = [];
    
    let processed = {code, libraries};

    while (includes_require(code)) {
        processed = require_externals(code, '', config);
        code = processed.code;
    }

    return processed;
}