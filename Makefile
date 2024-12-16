SHELL :=/usr/bin/env bash

.PHONY: deps
deps: ## Install bumpver
	pip install bumpver==2024.1130
