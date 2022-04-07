SOURCES := $(wildcard *.cjr)
OBJECTS := $(patsubst %.cjr, %.o, $(SOURCES))

default: modules examples

modules:
	pcjr install

examples: $(OBJECTS)
%.o: %.cjr
	ccjr $< -o $@

clean:
	rm -rf *.o
	rm -rf modules