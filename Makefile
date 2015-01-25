zuul = node_modules/.bin/zuul
browserify = node_modules/.bin/browserify
server = node_modules/.bin/http-server

node_modules:
	npm install --dev

example:
	$(browserify) example/index.js -t reactify --debug -o example/bundle.js
	$(server) example

test: node_modules
	$(zuul) --local 8080 --ui mocha-bdd -- test.js

.PHONY: example