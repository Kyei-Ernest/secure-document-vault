package logger

import (
	"log/slog"
	"os"
)

type Logger struct {
	*slog.Logger
}

func New(level string) *Logger {
	var logLevel slog.Level
	switch level {
	case "debug":
		logLevel = slog.LevelDebug
	case "info":
		logLevel = slog.LevelInfo
	case "warn":
		logLevel = slog.LevelWarn
	case "error":
		logLevel = slog.LevelError
	default:
		logLevel = slog.LevelInfo
	}

	opts := &slog.HandlerOptions{
		Level: logLevel,
	}

	handler := slog.NewJSONHandler(os.Stdout, opts)
	logger := slog.New(handler)

	return &Logger{logger}
}

func (l *Logger) WithField(key string, value interface{}) *Logger {
	return &Logger{l.Logger.With(key, value)}
}

func (l *Logger) WithError(err error) *Logger {
	return &Logger{l.Logger.With("error", err.Error())}
}
