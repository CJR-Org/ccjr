SOURCES := $(wildcard *.cjr)
OBJECTS := $(patsubst %.cjr, %.o, $(SOURCES))

default: modules tests

modules:
	pcjr install

tests:
	ccjr test.cjr
	./a.out

clean:
	rm -rf *.o
	rm -rf modules