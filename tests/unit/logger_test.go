package unit

import (
	"encoding/json"
	"errors"
	"io"
	"os"
	"strings"
	"testing"

	"github.com/Kyei-Ernest/secure-document-vault/pkg/logger"
)

// captureStdout captures anything written to os.Stdout during the execution of fn
func captureStdout(fn func()) (string, error) {
	oldStdout := os.Stdout
	r, w, err := os.Pipe()
	if err != nil {
		return "", err
	}
	os.Stdout = w

	fn()

	w.Close()
	os.Stdout = oldStdout

	var buf strings.Builder
	_, err = io.Copy(&buf, r)
	return buf.String(), err
}

func TestLogger_Levels(t *testing.T) {
	tests := []struct {
		name           string
		level          string
		logAction      func(*logger.Logger)
		expectedOutput string
		shouldOutput   bool
	}{
		{
			name:  "debug level - shows debug logs",
			level: "debug",
			logAction: func(l *logger.Logger) {
				l.Debug("debug message")
			},
			expectedOutput: "DEBUG",
			shouldOutput:   true,
		},
		{
			name:  "info level - hides debug logs",
			level: "info",
			logAction: func(l *logger.Logger) {
				l.Debug("this should not appear")
			},
			shouldOutput: false,
		},
		{
			name:  "default level - falls back to info",
			level: "invalid",
			logAction: func(l *logger.Logger) {
				l.Info("fallback check")
			},
			expectedOutput: "INFO",
			shouldOutput:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			output, _ := captureStdout(func() {
				l := logger.New(tt.level)
				tt.logAction(l)
			})

			if tt.shouldOutput {
				if output == "" {
					t.Errorf("expected output but got nothing")
				}
				if !strings.Contains(output, tt.expectedOutput) {
					t.Errorf("expected level %s in output, got %s", tt.expectedOutput, output)
				}
			} else {
				if output != "" {
					t.Errorf("expected no output, but got: %s", output)
				}
			}
		})
	}
}

func TestLogger_ContextFields(t *testing.T) {
	t.Run("WithField correctly adds key-value pair", func(t *testing.T) {
		output, _ := captureStdout(func() {
			l := logger.New("info")
			l.WithField("request_id", "abc-123").Info("test message")
		})

		var data map[string]interface{}
		if err := json.Unmarshal([]byte(output), &data); err != nil {
			t.Fatalf("failed to parse log JSON: %v", err)
		}

		if data["request_id"] != "abc-123" {
			t.Errorf("expected field request_id='abc-123', got %v", data["request_id"])
		}
		if data["msg"] != "test message" {
			t.Errorf("expected msg='test message', got %v", data["msg"])
		}
	})

	t.Run("WithError correctly formats error", func(t *testing.T) {
		testErr := errors.New("database connection refused")
		output, _ := captureStdout(func() {
			l := logger.New("error")
			l.WithError(testErr).Error("failed to connect")
		})

		var data map[string]interface{}
		json.Unmarshal([]byte(output), &data)

		// Your implementation calls err.Error(), so check for the string value
		if data["error"] != testErr.Error() {
			t.Errorf("expected error field %q, got %q", testErr.Error(), data["error"])
		}
	})
}