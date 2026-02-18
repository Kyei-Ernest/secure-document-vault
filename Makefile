.PHONY: help run test build clean docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make run          - Run the application (local)"
	@echo "  make test         - Run tests"
	@echo "  make build        - Build binary"
	

# Run locally (no Docker needed)
run:
	go run cmd/server/main.go

test:
	go test ./... -v -race -coverprofile=coverage.out

build:
	go build -o bin/secure-vault cmd/server/main.go

clean:
	rm -rf bin/ coverage.out


# Database connection string from your config
DB_URL=postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=$(DB_SSLMODE)

# Migration commands
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir migrations -seq $$name

migrate-up:
	migrate -path migrations -database "$(DB_URL)" up

migrate-down:
	migrate -path migrations -database "$(DB_URL)" down

migrate-force:
	@read -p "Enter version to force: " version; \
	migrate -path migrations -database "$(DB_URL)" force $$version

migrate-version:
	migrate -path migrations -database "$(DB_URL)" version

migrate-goto:
	@read -p "Enter target version: " version; \
	migrate -path migrations -database "$(DB_URL)" goto $$version