package model

import (
	"context"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

var Ctx = context.Background()

type Game struct {
	ID        uuid.UUID `json:"id"`
	User1     string    `json:"user1"`
	User2     string    `json:"user2"`
	BetAmount float64   `json:"betAmount"`
	Timestamp time.Time `json:"timestamp"`
	Result    uint8     `json:"result"`
	TokenType string    `json:"tokenType"`
}

type Room struct {
	ID                uuid.UUID `json:"id"`
	User1             string    `json:"user1"`
	User2             string    `json:"user2"`
	BetAmount         float64   `json:"betAmount"`
	Timestamp         time.Time `json:"timestamp"`
	Result            uint8     `json:"result"`
	TokenType         string    `json:"tokenType"`
	Status            string    `json:"status"`
	User1HasDeposited bool      `json:"user1HasDeposited"`
	User2HasDeposited bool      `json:"user2HasDeposited"`
}

type Rooms struct {
	UpdatedAt time.Time       `json:"updatedAt"`
	Data      map[string]Room `json:"data"`
}

type UserHistory struct {
	WinCount   uint               `json:"winCount"`
	LoseCount  uint               `json:"loseCount"`
	TokensWon  map[string]float64 `json:"tokensWon"`
	TokensLost map[string]float64 `json:"tokensLost"`
	Games      []*Game            `json:"games"`
}

type User struct {
	History UserHistory
}

type DBService interface {
	IncrementWonGame(userId string) error
	IncrementLostGame(userId string) error
	AddWonTokens(userId string, betAmount float64, tokenType string)
	AddLostTokens(userId string, betAmount float64, tokenType string)
	SaveGame(userId string, game *Game, saveToMongo bool)
	GetGamesFromCache(userId string) ([]byte, error)
	GetUserGameCountFromCache(userId string) ([]byte, error)
	GetWonTokensFromCache(userId string) ([]byte, error)
	GetLostTokensFromCache(userId string) ([]byte, error)
	GetGamesFromDB(userId string, timestamp time.Time) ([]byte, error)
	SubscribeToPubSubChannel(channelName string) *redis.PubSub
	GetValueFromCache(key string) *redis.StringCmd
	SetValueInCache(key string, val interface{}) *redis.StatusCmd
	IncrementValueInCache(key string) *redis.IntCmd
	DecrementValueInCache(key string) *redis.IntCmd
	PublishToPubSubChannel(channelName string, msg interface{}) *redis.IntCmd
	CheckIfKeyExistsInCache(key string) (bool, error)
	GetCollectionFromDB(collection string) *mongo.Collection
	SetJSONInCache(key string, path string, val interface{}) (interface{}, error)
	GetRoomsUpdatedAtFromCache() ([]byte, error)
	GetJSONValFromCache(key string, path ...string) *redis.Cmd
	GetRoomsFromCache() ([]byte, error)
}
