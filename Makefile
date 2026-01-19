SHELL :=/usr/bin/env bash

.PHONY: build
build:
	$(MAKE) -j2 build-node build-web build-generator

.PHONY: build-node
build-node:
	npm run build

.PHONY: build-web
build-web:
	npm run build:web

.PHONY: build-generator
build-generator:
	npm run build:generator

.PHONY: deps
deps: ## Install bumpver
	pip install bumpver==2024.1130

.PHONY: local-deps
local-deps: deps
	cargo install git-cliff

$(CHANGELOG):

changelog:
	git cliff > CHANGELOG.md

.PHONY: dev
dev:
	cd demo && npm install && npm run dev

.PHONY: check
check:
	npm run lint

.PHONY: test
test:
	npm test
