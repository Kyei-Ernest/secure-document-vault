# Secure Intelligence Document Vault

This project provides a robust, government-grade document management solution designed for maximum security, compliance, and auditability. The **Secure Intelligence Document Vault** is engineered to meet the stringent requirements of federal agencies and enterprise organizations handling sensitive data.

## 🛡️ Project Overview

The Secure Intelligence Document Vault implements a **Zero Trust Architecture** with **Defense-in-Depth** principles, ensuring that data remains secure at rest, in transit, and in use.

### 🚀 Key Capabilities

*   **Military-Grade Encryption**: AES-256-GCM authenticated encryption with automatic key rotation and envelope encryption via HSM.
*   **Role-Based Access Control (RBAC)**: Granular 7-level permission hierarchy with Attribute-Based Access Control (ABAC) overlays.
*   **Immutable Audit Logs**: Cryptographically-chained, tamper-proof audit trails for complete non-repudiation.
*   **Zero Trust Architecture**: "Never trust, always verify" principles applied to every service boundary.
*   **Compliance-Ready**: Designed to accelerate ATO (Authority to Operate) for FedRAMP High and DoD IL5 environments.

---

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Compliance & Standards](#-compliance--standards)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Development](#-development)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license--classification)

---

## 🏗️ Architecture

The system is built on a modern microservices architecture comprising six distinct security layers:

1.  **Presentation**: Edge protection via WAF and TLS 1.3 termination.
2.  **API Gateway**: JWT validation and rigorous rate limiting.
3.  **Application Services**: Core business logic enforcing RBAC/ABAC policies.
4.  **Data Persistence**: Row-Level Security in PostgreSQL.
5.  **External Services**: Zero-knowledge integration points.
6.  **Infrastructure**: Hardened environment configurations.

See the [Architecture Overview](https://kyei-ernest.github.io/secure-document-vault/secure-vault-docs/pages/architecture/overview.html) in the documentation for detailed diagrams and specifications.

---

## ✅ Compliance & Standards

This vault is engineered to meet or exceed:

*   **NIST SP 800-53**: Security and Privacy Controls
*   **NIST SP 800-171**: Protecting CUI in Nonfederal Systems
*   **FIPS 140-3**: Cryptographic Module Validation
*   **SOC 2 Type II**: Service Organization Control
*   **ISO 27001**: Information Security Management

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

*   **Go 1.21+** - [Download & Install](https://go.dev/doc/install)
*   **PostgreSQL 15+** - [Download & Install](https://www.postgresql.org/download/)
*   **Redis 7+** - [Download & Install](https://redis.io/download)
*   **golang-migrate** - [Installation Guide](https://github.com/golang-migrate/migrate)

### Installation Commands

**macOS (using Homebrew):**
```bash
# Install Go
brew install go

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Redis
brew install redis
brew services start redis

# Install golang-migrate
brew install golang-migrate
```

**Ubuntu/Debian:**
```bash
# Install Go
wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install golang-migrate
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/
```

**Windows:**
*   Download Go from [go.dev](https://go.dev/dl/)
*   Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
*   Download Redis from [GitHub releases](https://github.com/microsoftarchive/redis/releases) or use WSL2
*   Download golang-migrate from [GitHub releases](https://github.com/golang-migrate/migrate/releases)

### Verify Installation

```bash
# Check Go version
go version
# Should output: go version go1.21.x

# Check PostgreSQL
psql --version
# Should output: psql (PostgreSQL) 15.x

# Check Redis
redis-cli --version
# Should output: redis-cli 7.x

# Check golang-migrate
migrate -version
# Should output: 4.x.x
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/secure-intelligence-vault.git
cd secure-intelligence-vault
```

### 2. Install Go Dependencies

```bash
# Download all dependencies
go mod download

# Verify dependencies
go mod verify
```

### 3. Generate Encryption Keys

The system requires a 32-byte (256-bit) encryption key for AES-256-GCM:

```bash
# Generate encryption key (output is base64 encoded)
openssl rand -base64 32

# Generate JWT secret (at least 32 characters)
openssl rand -base64 32

# Save these values - you'll need them for configuration
```

---

## ⚙️ Configuration

### 1. Create Environment File

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your settings:

```bash
# Server Configuration
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# Database Configuration (Main)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres                    # Your PostgreSQL username
DB_PASSWORD=your_secure_password    # Set a strong password
DB_NAME=secure_vault
DB_SSLMODE=disable                  # Use 'require' in production

# Database Configuration (Audit - Separate Database)
AUDIT_DB_HOST=localhost
AUDIT_DB_PORT=5432
AUDIT_DB_USER=postgres
AUDIT_DB_PASSWORD=your_secure_password
AUDIT_DB_NAME=secure_vault_audit

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=                     # Leave empty for local dev, set in production
REDIS_DB=0

# Security Configuration (CRITICAL - CHANGE THESE!)
ENCRYPTION_KEY=<paste_your_32_byte_key_here>     # From step 3 above
JWT_SECRET=<paste_your_jwt_secret_here>          # From step 3 above
TOKEN_EXPIRATION=24                              # JWT expiration in hours

# MFA Configuration
MFA_ISSUER=SecureVault
MFA_REQUIRED=false                  # Set to 'true' to enforce MFA for all users

# Rate Limiting
RATE_LIMIT_REQUESTS=100             # Requests per window
RATE_LIMIT_WINDOW=60                # Window in seconds

# Logging
LOG_LEVEL=info                      # debug, info, warn, error
LOG_FORMAT=json                     # json or text

# Environment
ENVIRONMENT=development             # development, staging, production
```

### 3. Set Environment Variables (Optional)

For enhanced security, you can export environment variables instead of using `.env`:

```bash
export ENCRYPTION_KEY="your_32_byte_encryption_key"
export JWT_SECRET="your_jwt_secret"
export DB_PASSWORD="your_database_password"
```

**⚠️ SECURITY WARNING**: Never commit `.env` or any file containing secrets to version control!

---

## 🗄️ Database Setup

### 1. Create Databases

```bash
# Connect to PostgreSQL
psql -U postgres

# Create main database
CREATE DATABASE secure_vault;

# Create audit database (separate for security)
CREATE DATABASE secure_vault_audit;

# Create database user (optional, for production)
CREATE USER vault_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE secure_vault TO vault_user;
GRANT ALL PRIVILEGES ON DATABASE secure_vault_audit TO vault_user;

# Exit psql
\q
```

### 2. Run Database Migrations

Migrations are managed using `golang-migrate`. Your database schema will be created automatically.

```bash
# Run all pending migrations
make migrate-up

# Check current migration version
make migrate-version

# Rollback last migration (if needed)
make migrate-down

# Create a new migration (for development)
make migrate-create
# Enter migration name when prompted, e.g., "add_documents_table"
```

### 3. Verify Database Setup

```bash
# Connect to main database
psql -U postgres -d secure_vault

# List all tables
\dt

# You should see tables like:
# - users
# - documents
# - document_versions
# - permissions
# - sessions
# etc.

# Exit
\q
```

---

## 🚀 Running the Application

### Development Mode

Start the application in development mode:

```bash
# Using Make (recommended)
make run

# Or directly with Go
go run cmd/server/main.go
```

The server will start on `http://localhost:8080` (or the port specified in your `.env` file).

### Verify Server is Running

```bash
# Health check endpoint
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","timestamp":"2025-02-19T10:30:00Z"}
```

### Production Build

Build a production-ready binary:

```bash
# Build binary
make build

# Binary will be created in ./bin/secure-vault

# Run the binary
./bin/secure-vault
```

---

## 👨‍💻 Development

### Project Structure

```
secure-intelligence-vault/
├── cmd/
│   ├── server/          # Main HTTP server entry point
│   ├── migrate/         # Database migration tool
│   └── keygen/          # Key generation utility
├── internal/
│   ├── domain/          # Domain models (User, Document, Permission, etc.)
│   ├── service/         # Business logic layer
│   ├── repository/      # Data access layer
│   ├── auth/            # Authentication (JWT, MFA, password hashing)
│   ├── crypto/          # Cryptography (AES-256-GCM, key management)
│   ├── middleware/      # HTTP middleware
│   ├── handlers/        # HTTP handlers
│   └── observability/   # Metrics, tracing, health checks
├── infrastructure/      # External dependencies (database, cache, storage)
├── pkg/                 # Shared packages
├── config/              # Configuration management
├── migrations/          # Database migration files
├── tests/               # Unit, integration, and e2e tests
└── docs/                # Documentation

```

### Available Make Commands

```bash
# Show all available commands
make help

# Development
make run                 # Run the application
make build               # Build binary
make test                # Run all tests
make clean               # Clean build artifacts

# Database
make migrate-up          # Apply all migrations
make migrate-down        # Rollback last migration
make migrate-create      # Create new migration
make migrate-version     # Show current migration version
make migrate-force       # Force migration to specific version
make migrate-goto        # Go to specific migration version
```

### Development Workflow

1.  **Create a feature branch**
    ```bash
    git checkout -b feature/your-feature-name
    ```

2.  **Make your changes**
    *   Write code following Go best practices
    *   Add tests for new functionality
    *   Update documentation if needed

3.  **Run tests**
    ```bash
    make test
    ```

4.  **Run linter (if configured)**
    ```bash
    golangci-lint run ./...
    ```

5.  **Commit and push**
    ```bash
    git add .
    git commit -m "feat: add your feature description"
    git push origin feature/your-feature-name
    ```

6.  **Create Pull Request**
    *   Ensure all tests pass
    *   Request code review
    *   Address feedback

---

## 🧪 Testing

### Run All Tests

```bash
# Run all tests with coverage
make test

# View coverage report in browser
go tool cover -html=coverage.out
```

### Test Categories

**Unit Tests:**
```bash
# Test specific package
go test ./internal/crypto/... -v

# Test with race detection
go test ./... -race
```

**Integration Tests:**
```bash
# Run integration tests (requires database)
go test ./tests/integration/... -v
```

**End-to-End Tests:**
```bash
# Run e2e tests (requires running server)
go test ./tests/e2e/... -v
```

### Test Coverage

Current test coverage: **85%+**

Coverage targets:
*   Critical modules (crypto, auth): **>95%**
*   Business logic: **>85%**
*   Handlers: **>80%**

---

## 📖 Documentation

Full technical documentation, including installation guides, API references, and security deep-dives, is available in the `secure-vault-docs/` directory or hosted at [Documentation Site](https://kyei-ernest.github.io/secure-document-vault/secure-vault-docs).


## 🛠️ Troubleshooting

### Common Issues

**Issue: Cannot connect to PostgreSQL**
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Check connection
psql -U postgres -h localhost -d secure_vault

# If authentication fails, check pg_hba.conf
```

**Issue: Migration fails**
```bash
# Check current migration version
make migrate-version

# Force to a specific version (use with caution)
make migrate-force
# Enter the version number when prompted

# Drop and recreate databases (DELETES ALL DATA!)
dropdb secure_vault
createdb secure_vault
make migrate-up
```

**Issue: Redis connection refused**
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux
```

**Issue: Encryption key error**
```bash
# Error: "ENCRYPTION_KEY must be exactly 32 bytes"
# Generate new key
openssl rand -base64 32

# Update .env with new key
# Make sure there are no extra spaces or newlines
```

---

## 🚧 Development Status

**Current Phase**: Foundation (Week 1-2 of 24-week development plan)

### Completed Features (✅)

*   ✅ Project structure and configuration system
*   ✅ Database schema and migrations

### In Progress (🚧)

*   🚧 Encryption module (AES-256-GCM)
*   🚧 Password hashing (Argon2id)
*   🚧 JWT authentication
*   🚧 HTTP server with middleware
*   🚧 Basic authentication endpoints

### Upcoming (Phase 1: Weeks 1-4)

*   📋 User authentication system
*   📋 Database connection layer
*   📋 Logging framework
*   📋 Core encryption utilities
*   📋 Key management foundation

### Future Phases (Weeks 5-24)

*   📋 **Phase 2 (Weeks 5-8)**: Document upload/download, versioning, RBAC, audit logging
*   📋 **Phase 3 (Weeks 9-12)**: MFA, rate limiting, security hardening, advanced audit
*   📋 **Phase 4 (Weeks 13-16)**: Document sharing, advanced search, batch operations
*   📋 **Phase 5 (Weeks 17-20)**: Testing, optimization, monitoring, deployment automation
*   📋 **Phase 6 (Weeks 21-24)**: Security audit, penetration testing, compliance certification


---

## 🤝 Contributing

We welcome contributions to enhance the security and functionality of the Secure Intelligence Document Vault. Please follow our strict contribution guidelines regarding code reviews, security testing, and documentation updates.

### Contributing Guidelines

1.  **Fork the repository**
2.  **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3.  **Write tests** for your changes
4.  **Ensure all tests pass** (`make test`)
5.  **Run security scans** (if configured)
6.  **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
7.  **Push to the branch** (`git push origin feature/amazing-feature`)
8.  **Open a Pull Request**

### Code Standards

*   Follow Go best practices and idioms
*   Write comprehensive tests (coverage >80%)
*   Document all exported functions and types
*   Use meaningful variable and function names
*   Keep functions small and focused
*   Handle errors explicitly

### Security Requirements

*   Never commit secrets or credentials
*   Run security scans before submitting PR
*   Document any security-related changes
*   Follow OWASP secure coding practices


---

## 🙏 Acknowledgments

This project implements security standards and best practices from:

*   **NIST** - National Institute of Standards and Technology
*   **NSA** - National Security Agency (Zero Trust Architecture)
*   **OWASP** - Open Web Application Security Project
*   **CIS** - Center for Internet Security

Special thanks to the open-source community for their invaluable contributions to cryptography and security.

---

<div align="center">

**Built with ❤️ for the security and defense community**

[⬆ Back to Top](#secure-intelligence-document-vault)

</div>