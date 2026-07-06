# SOPS Secret Management
# Requires: age and sops
# Setup: export SOPS_AGE_KEY_FILE=.age-key.txt

SOPS_ENV_AWK = awk -F': ' '{ \
	key = $$1; \
	value = substr($$0, index($$0, ": ") + 2); \
	print key"="value; \
}'

.PHONY: help decrypt-local decrypt-production edit-local edit-production update-secret-keys

help:
	@echo "SOPS Secret Management Commands:"
	@echo "  make decrypt-local       - Decrypt local secrets to .env"
	@echo "  make decrypt-production  - Decrypt production secrets to .env.production"
	@echo "  make edit-local          - Edit local secrets with SOPS"
	@echo "  make edit-production     - Edit production secrets with SOPS"
	@echo "  make update-secret-keys  - Re-encrypt secret files after key rotation"
	@echo ""
	@echo "Setup: export SOPS_AGE_KEY_FILE=.age-key.txt"

decrypt-local:
	@echo "Decrypting local secrets..."
	@tmp_yaml=$$(mktemp "$${TMPDIR:-/tmp}/dev-starter-local-secrets.XXXXXX"); \
	tmp_env=$$(mktemp "$${TMPDIR:-/tmp}/dev-starter-local-env.XXXXXX"); \
	trap 'rm -f "$$tmp_yaml" "$$tmp_env"' EXIT INT TERM; \
	sops -d secrets/local.enc.yaml > "$$tmp_yaml"; \
	$(SOPS_ENV_AWK) "$$tmp_yaml" > "$$tmp_env"; \
	mv "$$tmp_env" .env
	@echo "Created .env"

decrypt-production:
	@echo "Decrypting production secrets..."
	@tmp_yaml=$$(mktemp "$${TMPDIR:-/tmp}/dev-starter-production-secrets.XXXXXX"); \
	tmp_env=$$(mktemp "$${TMPDIR:-/tmp}/dev-starter-production-env.XXXXXX"); \
	trap 'rm -f "$$tmp_yaml" "$$tmp_env"' EXIT INT TERM; \
	sops -d secrets/production.enc.yaml > "$$tmp_yaml"; \
	$(SOPS_ENV_AWK) "$$tmp_yaml" > "$$tmp_env"; \
	mv "$$tmp_env" .env.production
	@echo "Created .env.production"

edit-local:
	@echo "Opening local secrets in editor..."
	@EDITOR="$${EDITOR:-nano}" sops secrets/local.enc.yaml

edit-production:
	@echo "Opening production secrets in editor..."
	@EDITOR="$${EDITOR:-nano}" sops secrets/production.enc.yaml

update-secret-keys:
	@echo "Updating encrypted secret file keys..."
	@sops updatekeys secrets/local.enc.yaml
	@sops updatekeys secrets/production.enc.yaml
	@echo "Secret files re-encrypted"
