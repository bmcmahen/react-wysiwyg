jest = node_modules/.bin/jest
browserify = node_modules/.bin/browserify
server = node_modules/.bin/http-server
watchify = node_modules/.bin/watchify

node_modules:
	npm install --dev

build:
	$(watchify) example/index.js -t babelify --debug -o example/bundle.js

test: node_modules
	npm test

example:
	$(server) example

.PHONY: example build
