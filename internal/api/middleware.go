package api

import (
	"context"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ContextKey is a custom type for context keys to avoid collisions.
type ContextKey string

const (
	// UserIDKey is the context key for the user ID.
	UserIDKey ContextKey = "user_id"
	// UserEmailKey is the context key for the user email.
	UserEmailKey ContextKey = "user_email"
)

var jwtSecret = []byte("secret") // overridden by env var in main/auth

// SetJWTSecret sets the secret key used for signing JWTs.
func SetJWTSecret(secret string) {
	if secret != "" {
		jwtSecret = []byte(secret)
	}
}

// AuthMiddleware validates the session cookie and adds the user ID to the context.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the cookie
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			if err == http.ErrNoCookie {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		// Validate the token
		tokenString := cookie.Value
		claims := &jwt.RegisteredClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Check expiration just in case (ParseWithClaims verifies it usually)
		if claims.ExpiresAt != nil && claims.ExpiresAt.Time.Before(time.Now()) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Add user ID to context
		ctx := context.WithValue(r.Context(), UserIDKey, claims.Subject)
		// We could also add email if we put it in ID or claims

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserID retrieves the user ID from the context.
func GetUserID(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}
