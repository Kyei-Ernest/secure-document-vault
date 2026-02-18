package unit

import (
	"os"
	"testing"

	"github.com/Kyei-Ernest/secure-document-vault/config"
)

// Test Validate function
func TestConfig_Validate(t *testing.T) {
	tests := []struct {
		name    string
		config  *config.Config
		wantErr bool
		errMsg  string
	}{
		{
			name: "valid config",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "32characterslongsecretkeyhere!!!!",
					EncryptionKey: []byte("32byteskeyforencryptionaes256abc"), // exactly 32 bytes
				},
				Database: config.DatabaseConfig{
					Password: "secretpassword",
				},
				Audit: config.AuditConfig{
					DBPassword: "auditsecret",
				},
			},
			wantErr: false,
		},
		{
			name: "missing JWT secret",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "",
					EncryptionKey: []byte("32byteskeyforencryptionaes256abc"),
				},
				Database: config.DatabaseConfig{
					Password: "secretpassword",
				},
				Audit: config.AuditConfig{
					DBPassword: "auditsecret",
				},
			},
			wantErr: true,
			errMsg:  "JWT_SECRET must be set",
		},
		{
			name: "JWT secret too short",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "short",
					EncryptionKey: []byte("32byteskeyforencryptionaes256abc"),
				},
				Database: config.DatabaseConfig{
					Password: "secretpassword",
				},
				Audit: config.AuditConfig{
					DBPassword: "auditsecret",
				},
			},
			wantErr: true,
			errMsg:  "JWT_SECRET must be at least 32 characters",
		},
		{
			name: "encryption key wrong length",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "32characterslongsecretkeyhere!!!!",
					EncryptionKey: []byte("tooshort"),
				},
				Database: config.DatabaseConfig{
					Password: "secretpassword",
				},
				Audit: config.AuditConfig{
					DBPassword: "auditsecret",
				},
			},
			wantErr: true,
			errMsg:  "ENCRYPTION_KEY must be exactly 32 bytes (256 bits)", // matches config.go exactly
		},
		{
			name: "missing database password",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "32characterslongsecretkeyhere!!!!",
					EncryptionKey: []byte("32byteskeyforencryptionaes256abc"),
				},
				Database: config.DatabaseConfig{
					Password: "",
				},
				Audit: config.AuditConfig{
					DBPassword: "auditsecret",
				},
			},
			wantErr: true,
			errMsg:  "DB_PASSWORD must be set",
		},
		{
			name: "missing audit password",
			config: &config.Config{
				Security: config.SecurityConfig{
					JWTSecret:     "32characterslongsecretkeyhere!!!!",
					EncryptionKey: []byte("32byteskeyforencryptionaes256abc"),
				},
				Database: config.DatabaseConfig{
					Password: "secretpassword",
				},
				Audit: config.AuditConfig{
					DBPassword: "",
				},
			},
			wantErr: true,
			errMsg:  "AUDIT_DB_PASSWORD must be set",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.config.Validate()

			if tt.wantErr {
				if err == nil {
					t.Errorf("Validate() expected error, got nil")
					return
				}
				if tt.errMsg != "" && err.Error() != tt.errMsg {
					t.Errorf("Validate() error = %q, want %q", err.Error(), tt.errMsg)
				}
			} else {
				if err != nil {
					t.Errorf("Validate() unexpected error: %v", err)
				}
			}
		})
	}
}

// Test DatabaseConfig.GetDSN
func TestDatabaseConfig_GetDSN(t *testing.T) {
	cfg := &config.DatabaseConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "secret",
		DBName:   "testdb",
		SSLMode:  "require",
	}

	expected := "host=localhost port=5432 user=postgres password=secret dbname=testdb sslmode=require"
	result := cfg.GetDSN()

	if result != expected {
		t.Errorf("GetDSN() = %q, want %q", result, expected)
	}
}

// Test AuditConfig.GetDSN
func TestAuditConfig_GetDSN(t *testing.T) {
	cfg := &config.AuditConfig{
		DBHost:     "localhost",
		DBPort:     5433,
		DBUser:     "audit_user",
		DBPassword: "auditsecret",
		DBName:     "auditdb",
	}

	expected := "host=localhost port=5433 user=audit_user password=auditsecret dbname=auditdb sslmode=require"
	result := cfg.GetDSN()

	if result != expected {
		t.Errorf("GetDSN() = %q, want %q", result, expected)
	}
}

// Test Load with valid environment variables
func TestLoad(t *testing.T) {
	// Save originals
	originalEnv := map[string]string{
		"JWT_SECRET":        os.Getenv("JWT_SECRET"),
		"ENCRYPTION_KEY":    os.Getenv("ENCRYPTION_KEY"),
		"DB_PASSWORD":       os.Getenv("DB_PASSWORD"),
		"AUDIT_DB_PASSWORD": os.Getenv("AUDIT_DB_PASSWORD"),
		"SERVER_PORT":       os.Getenv("SERVER_PORT"),
		"DB_HOST":           os.Getenv("DB_HOST"),
		"DB_PORT":           os.Getenv("DB_PORT"),
		"MFA_REQUIRED":      os.Getenv("MFA_REQUIRED"),
	}

	defer func() {
		for k, v := range originalEnv {
			if v != "" {
				os.Setenv(k, v)
			} else {
				os.Unsetenv(k)
			}
		}
	}()

	os.Setenv("JWT_SECRET", "32characterslongsecretkeyhere!!!!")
	os.Setenv("ENCRYPTION_KEY", "32byteskeyforencryptionaes256abc") // exactly 32 bytes
	os.Setenv("DB_PASSWORD", "testdbpass")
	os.Setenv("AUDIT_DB_PASSWORD", "testauditpass")
	os.Setenv("SERVER_PORT", "9090")
	os.Setenv("DB_HOST", "testhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("MFA_REQUIRED", "false")

	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if cfg == nil {
		t.Fatal("Load() returned nil config")
	}

	tests := []struct {
		name     string
		actual   interface{}
		expected interface{}
	}{
		{"Server.Port", cfg.Server.Port, "9090"},
		{"Database.Host", cfg.Database.Host, "testhost"},
		{"Database.Port", cfg.Database.Port, 5432},
		{"Database.Password", cfg.Database.Password, "testdbpass"},
		{"Security.JWTSecret", cfg.Security.JWTSecret, "32characterslongsecretkeyhere!!!!"},
		{"Security.MFARequired", cfg.Security.MFARequired, false},
		{"Audit.DBPassword", cfg.Audit.DBPassword, "testauditpass"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.actual != tt.expected {
				t.Errorf("%s = %v, want %v", tt.name, tt.actual, tt.expected)
			}
		})
	}
}

// Test Load fails when required variables are missing
func TestLoad_MissingRequiredVars(t *testing.T) {
	requiredVars := []string{"JWT_SECRET", "ENCRYPTION_KEY", "DB_PASSWORD", "AUDIT_DB_PASSWORD"}

	// Save and clear required vars
	original := make(map[string]string)
	for _, v := range requiredVars {
		original[v] = os.Getenv(v)
		os.Unsetenv(v)
	}

	defer func() {
		for k, v := range original {
			if v != "" {
				os.Setenv(k, v)
			}
		}
	}()

	_, err := config.Load()
	if err == nil {
		t.Error("Load() expected error with missing required vars, got nil")
	}
}

