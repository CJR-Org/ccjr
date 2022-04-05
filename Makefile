bundle:
	deno run --allow-read --allow-write bundle.js ccjr.js

transpile:
	deno run --allow-read --allow-write --allow-run ccjr.js ./examples/hello.cjr

run: transpile
	./a.out

compile: bundle
	deno compile --allow-read --allow-write --allow-run -o ccjr bundled.js
	rm -rf bundled.js

install: compile
	mv ccjr /usr/bin

debug: clean
	deno run --allow-read --allow-write --allow-run ccjr.js ./tests/test.cjr --keep-temp
	./a.out

test: install
	ccjr tests/test.cjr
	./a.out

clean:
	rm -rf *.c
	rm -rf *.out
	rm -rf bundled.js
	rm -rf ccjr