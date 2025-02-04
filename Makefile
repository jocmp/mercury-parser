SHELL :=/usr/bin/env bash

.PHONY: build
build:
	$(MAKE) -j2 build-node build-web build-generator

.PHONY: build-node
build-node:
	yarn build

.PHONY: build-web
build-web:
	yarn build:web

.PHONY: build-generator
build-generator:
	yarn build:generator

.PHONY: deps
deps: ## Install bumpver
	pip install bumpver==2024.1130

.PHONY: local-deps
local-deps: deps
	cargo install git-cliff

$(CHANGELOG):

changelog:
	git cliff > CHANGELOG.md

.PHONY: preview
preview:
	yarn preview
