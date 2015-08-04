zuul = node_modules/.bin/zuul
browserify = node_modules/.bin/browserify
server = node_modules/.bin/http-server
watchify = node_modules/.bin/watchify

node_modules:
	npm install --dev

build:
	$(watchify) example/index.js -t reactify --debug -o example/bundle.js

test: node_modules
	$(zuul) --local 8080 --ui mocha-bdd -- test.js

example:
	$(server) example

.PHONY: example build
