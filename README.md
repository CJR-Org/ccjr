# ccjr
Compiler (technically transpiler) written in Deno, for CJR, a language developed by me which transpiles to C.

CJR stands for C, JS, Rust, as it is representative of JS and Rust, and transpiles to C.

not even near being finished and the code is very messy

# Installing
`git clone https://github.com/CJR-Org/ccjr`
`cd ccjr`
`sudo make install`
You can then remove the directory created by cloning.

# Usage
## Compiling
Simply run `ccjr file.cjr`

## Flags
### Custom flags
`-keeptemp`: Keeps the temporary C file generated during transpilation.
### GCC Flags
All GCC flags can be used like normal and will be used when compiling with gcc. Flags can be added from CJR directly with the `gccflag()` preprocessor keyword, such as `gccflag("pthread")`.

## Preprocessors
### CJR currently has 4 processors.
Preprocessors syntax is as follows: `preprocessor(arguments)`, such as `require(example-module)`.  
<br>

- `require` pulls in CJR source code from other files into the main file. It acts differently based on how its used.
  - When requiring modules you require them with simply their name, no path prefix of suffixes. When require 
  - When requiring local files you require them with their path prefix (such as ./) and suffix with the file extension.

- `library` adds the path specified to the end of the GCC arguments, and is used to link C libraries.

- `include` gets transpiled to the `#include` preprocessor of C and is used to include header files.

- `gccflag` appends the specified flag to the end of the GCC flags, and does not need the "-".

The websocket module uses 3 of these preprocessors and is a better way to understand how they work, [here](https://github.com/CJR-Org/websocket/blob/main/index.cjr) it is.