package db

import (
	"context"
	"github.com/go-redis/redis/v8"
	"github.com/nitishm/go-rejson/v4"
	"log"
)

type Database struct {
	Redis *redis.Client
	Rh    *rejson.Handler
}

func InitRedis() (*Database, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:       "localhost:6380",
		Password:   "",
		DB:         0,
		MaxRetries: 10,
	})

	var ctx = context.Background()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	rh := rejson.NewReJSONHandler()
	rh.SetGoRedisClient(rdb)

	db := &Database{
		Redis: rdb,
		Rh:    rh,
	}

	return db, nil
}
