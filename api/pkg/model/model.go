package model

import (
	"github.com/google/uuid"
	"time"
)

type Game struct {
	ID        uuid.UUID `json:"id"`
	User1     string    `json:"user1"`
	User2     string    `json:"user2"`
	BetAmount float64   `json:"betAmount"`
	Timestamp time.Time `json:"timestamp"`
	Result    uint8     `json:"result"`
	TokenType string    `json:"tokenType"`
}
