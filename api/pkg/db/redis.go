package db

import (
	"context"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/nitishm/go-rejson/v4"
	"github.com/spf13/viper"
	"log"
	"time"
)

type Database struct {
	Redis *redis.Client
	Rh    *rejson.Handler
}

func InitRedis() (*Database, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:       viper.GetString("REDIS_ADDR"),
		Password:   viper.GetString("REDIS_PASSWORD"),
		DB:         viper.GetInt("REDIS_DB_INDEX"),
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

	// add "rooms" key to cache
	roomsKey := viper.GetString("KEY_ROOMS")
	exists, err := db.Redis.Exists(ctx, roomsKey).Result()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	if exists != 1 {
		rooms := model.Rooms{
			UpdatedAt: time.Now(),
			Data:      make(map[string]model.Room),
		}

		_, err = db.Rh.JSONSet(roomsKey, "$", rooms)
		if err != nil {
			log.Println(err)
			return nil, err
		}
	}

	return db, nil
}
