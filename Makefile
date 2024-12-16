SHELL :=/usr/bin/env bash

CHANGELOG=CHANGELOG.md
CHANGELOG_TMP=tmp/$(CHANGELOG)

.PHONY: deps
deps: ## Install bumpver
	pip install bumpver==2024.1130

$(CHANGELOG_TMP):
	mkdir -p tmp
	echo -e "# Mercury Parser Changelog\n" > $(CHANGELOG_TMP)
	echo $(now)
	echo -e "### $(BUMPVER_NEW_VERSION) ($$(date '+%b %d, %Y'))\n" >>  $(CHANGELOG_TMP)
	yarn run --silent changelog-maker --format=markdown >> $(CHANGELOG_TMP)
	cat $(CHANGELOG) | sed 1d >> $(CHANGELOG_TMP)
	cp $(CHANGELOG_TMP) $(CHANGELOG)

$(CHANGELOG): $(CHANGELOG_TMP)

.PHONY: changelog
changelog: $(CHANGELOG)
