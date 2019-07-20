install:
	npm install

build:
	npm run-script build

start:
	npx babel-node src/bin/gendiff.js -h

publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm run test
