EXAMPLES=$(wildcard examples/*.cjr)

bundle:
	deno run --allow-read --allow-write bundle.js ccjr.js

transpile:
	deno run --allow-read --allow-write --allow-run --allow-env ccjr.js ./examples/hello.cjr

run: transpile
	./a.out

compile: bundle
	deno compile --allow-read --allow-write --allow-run --allow-env -o ccjr bundled.js
	rm -rf bundled.js

install: compile
	mv ccjr /usr/bin

debug: clean
	deno run --allow-read --allow-write --allow-run --allow-env ccjr.js ./tests/test.cjr -keeptemp
	./a.out

test: install
	ccjr tests/test.cjr
	./a.out

SOURCES := $(wildcard examples/*.cjr)
OBJECTS := $(patsubst examples/%.cjr, examples/%.o, $(SOURCES))

examples: $(OBJECTS)
examples/%.o: examples/%.cjr
	ccjr $< -o $@

clean:
	rm -rf *.c
	rm -rf *.out
	rm -rf bundled.js
	rm -rf ccjr
	rm -rf examples/*.o