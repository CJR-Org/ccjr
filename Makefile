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

example:
	make -C examples

debug: install clean
	cd tests && pcjr install && ccjr test.cjr -keeptemp && ./a.out

test:
	make -C tests

clean:
	rm -rf *.c
	rm -rf *.out
	rm -rf tests/*.c
	rm -rf tests/*.out
	rm -rf examples/*.c
	rm -rf examples/*.out
	rm -rf bundled.js
	rm -rf ccjr
	rm -rf examples/*.o
	rm -rf examples/modules
	rm -rf tests/modules