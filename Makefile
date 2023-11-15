.PHONY: install

bin/m4-janny: mod.ts
	deno compile -o bin/m4-janny --allow-run --allow-read --allow-write ./mod.ts

install:
	deno install -f --allow-run --allow-read --allow-write ./mod.ts

clean:
	rm -rf ./bin