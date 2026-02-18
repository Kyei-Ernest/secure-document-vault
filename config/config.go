package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
	
    
    "github.com/joho/godotenv" 
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	Security SecurityConfig
	Audit    AuditConfig
}

type ServerConfig struct {
	Port         string
	Host         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	DBName          string
	SSLMode         string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type SecurityConfig struct {
	JWTSecret          string
	EncryptionKey      []byte // Must be exactly 32 bytes for AES-256
	TokenExpiration    time.Duration
	RefreshExpiration  time.Duration
	MFAIssuer          string
	MFARequired        bool
	RateLimitRequests  int
	RateLimitWindow    time.Duration
}

type AuditConfig struct {
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
}

// initEnv loads .env from config/env directory
func initEnv() error {
	if _, err := os.Stat("config/env/.env"); os.IsNotExist(err) {
        return nil // silently skip if file doesn't exist
    }
	
    if err := godotenv.Load("config/env/.env"); err != nil {
        return fmt.Errorf("error loading .env: %w", err)
    }
    return nil
}


func Load() (*Config, error) {
	    // Load .env from config/env/ FIRST
    if err := initEnv(); err != nil {
        // Log warning but continue - maybe using system env vars
        fmt.Printf("Warning: %v\n", err)
    }
    
	cfg := &Config{
		Server: ServerConfig{
			Port:         getEnv("SERVER_PORT", "8080"),
			Host:         getEnv("SERVER_HOST", "0.0.0.0"),
			ReadTimeout:  30 * time.Second,
			WriteTimeout: 30 * time.Second,
		},
		Database: DatabaseConfig{
			Host:            getEnv("DB_HOST", "localhost"),
			Port:            getEnvAsInt("DB_PORT", 5432),
			User:            getEnv("DB_USER", "postgres"),
			Password:        getEnv("DB_PASSWORD", ""),
			DBName:          getEnv("DB_NAME", "secure_vault"),
			SSLMode:         getEnv("DB_SSLMODE", "require"),
			MaxOpenConns:    25,
			MaxIdleConns:    5,
			ConnMaxLifetime: 5 * time.Minute,
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Security: SecurityConfig{
			JWTSecret:         getEnv("JWT_SECRET", ""),
			EncryptionKey:     []byte(getEnv("ENCRYPTION_KEY", "")),
			TokenExpiration:   15 * time.Minute,
			RefreshExpiration: 7 * 24 * time.Hour,
			MFAIssuer:         getEnv("MFA_ISSUER", "SecureVault"),
			MFARequired:       getEnvAsBool("MFA_REQUIRED", true),
			RateLimitRequests: getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
			RateLimitWindow:   60 * time.Second,
		},
		Audit: AuditConfig{
			DBHost:     getEnv("AUDIT_DB_HOST", "localhost"),
			DBPort:     getEnvAsInt("AUDIT_DB_PORT", 5433),
			DBUser:     getEnv("AUDIT_DB_USER", "audit_user"),
			DBPassword: getEnv("AUDIT_DB_PASSWORD", ""),
			DBName:     getEnv("AUDIT_DB_NAME", "secure_vault_audit"),
		},
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("config validation failed: %w", err)
	}

	return cfg, nil
}

func (c *Config) Validate() error {
	// JWT Secret validation
	if c.Security.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET must be set")
	}
	if len(c.Security.JWTSecret) < 32 {
		return fmt.Errorf("JWT_SECRET must be at least 32 characters")
	}

	// Encryption key validation
	if len(c.Security.EncryptionKey) != 32 {
		return fmt.Errorf("ENCRYPTION_KEY must be exactly 32 bytes (256 bits)")
	}

	// Database password validation
	if c.Database.Password == "" {
		return fmt.Errorf("DB_PASSWORD must be set")
	}

	// Audit database password validation
	if c.Audit.DBPassword == "" {
		return fmt.Errorf("AUDIT_DB_PASSWORD must be set")
	}

	return nil
}

// Helper functions
func getEnv(key, defaultVal string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	valStr := getEnv(key, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return defaultVal
}

func getEnvAsBool(key string, defaultVal bool) bool {
	valStr := getEnv(key, "")
	if val, err := strconv.ParseBool(valStr); err == nil {
		return val
	}
	return defaultVal
}

// GetDSN returns database connection string
func (c *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode,
	)
}

// GetAuditDSN returns audit database connection string
func (c *AuditConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=require",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName,
	)
}