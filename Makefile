# SOPS Secret Management
# Requires: age, sops installed
# Setup: export SOPS_AGE_KEY_FILE=.age-key.txt

.PHONY: help decrypt-local decrypt-staging decrypt-production edit-local edit-staging edit-production encrypt-all

help:
	@echo "SOPS Secret Management Commands:"
	@echo "  make decrypt-local      - Decrypt local secrets to .env"
	@echo "  make decrypt-staging    - Decrypt staging secrets to .env.staging"
	@echo "  make decrypt-production - Decrypt production secrets to .env.production"
	@echo "  make edit-local        - Edit local secrets (auto encrypts on save)"
	@echo "  make edit-staging      - Edit staging secrets (auto encrypts on save)"
	@echo "  make edit-production   - Edit production secrets (auto encrypts on save)"
	@echo "  make encrypt-all       - Re-encrypt all secret files"
	@echo ""
	@echo "Setup: export SOPS_AGE_KEY_FILE=.age-key.txt"

# Decrypt secrets to .env files for local development
decrypt-local:
	@echo "Decrypting local secrets..."
	@sops -d secrets/local.enc.yaml | \
		awk -F': ' '{ \
			key = $$1; \
			value = substr($$0, index($$0, ": ") + 2); \
			print key"="value; \
		}' > .env
	@echo "✓ Created .env"

decrypt-staging:
	@echo "Decrypting staging secrets..."
	@sops -d secrets/staging.enc.yaml | \
		awk -F': ' '{ \
			key = $$1; \
			value = substr($$0, index($$0, ": ") + 2); \
			print key"="value; \
		}' > .env.staging
	@echo "✓ Created .env.staging"

decrypt-production:
	@echo "Decrypting production secrets..."
	@sops -d secrets/production.enc.yaml | \
		awk -F': ' '{ \
			key = $$1; \
			value = substr($$0, index($$0, ": ") + 2); \
			print key"="value; \
		}' > .env.production
	@echo "✓ Created .env.production"

# Edit encrypted secrets directly (SOPS will decrypt, open editor, re-encrypt)
edit-local:
	@echo "Opening local secrets in editor..."
	@EDITOR="code --wait" sops secrets/local.enc.yaml

edit-staging:
	@echo "Opening staging secrets in editor..."
	@EDITOR="code --wait" sops secrets/staging.enc.yaml

edit-production:
	@echo "Opening production secrets in editor..."
	@EDITOR="code --wait" sops secrets/production.enc.yaml

# Re-encrypt all secrets (useful after rotating keys)
encrypt-all:
	@echo "Re-encrypting all secrets..."
	@sops updatekeys secrets/local.enc.yaml
	@sops updatekeys secrets/staging.enc.yaml
	@sops updatekeys secrets/production.enc.yaml
	@echo "✓ All secrets re-encrypted"
