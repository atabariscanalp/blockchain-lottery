package db

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/nitishm/go-rejson/v4"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type dbStore struct {
	mongoClient   *mongo.Client
	redisClient   *redis.Client
	rejsonHandler *rejson.Handler
}

func NewDBService() (model.DBService, error) {
	cache, err := InitRedis()
	if err != nil {
		return nil, err
	}
	log.Println("successfully initialized redis db...")

	mongoDB, err := InitMongo()
	if err != nil {
		return nil, err
	}
	log.Println("successfully initialized mongo db...")

	return &dbStore{
		mongoClient:   mongoDB.Client,
		redisClient:   cache.Redis,
		rejsonHandler: cache.Rh,
	}, nil
}

var ctx = model.Ctx

func (db *dbStore) IncrementWonGame(userId string) error {
	_, err := db.rejsonHandler.JSONNumIncrBy(userId, "$.winCount", 1)
	if err != nil {
		log.Println("error while incrementing user win game amount")
		return err
	}
	return nil
}

func (db *dbStore) IncrementLostGame(userId string) error {
	_, err := db.rejsonHandler.JSONNumIncrBy(userId, "$.loseCount", 1)
	if err != nil {
		log.Println("error while incrementing user lost game amount")
		return err
	}
	return nil
}

func (db *dbStore) AddWonTokens(userId string, betAmount float64, tokenType string) {
	path := "$.tokensWon." + tokenType
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, path)
	str, err := cmd.Text()
	if err != nil {
		log.Println("error while do", err)
		return
	}

	data := []byte(str)
	var arr []float64
	err = json.Unmarshal(data, &arr)
	if err != nil {
		log.Println("error while unmarshal", err)
		return
	}

	if len(arr) > 0 {
		// token exists in array
		wonAmount := arr[0]
		wonAmount += betAmount * 1.9
		path := "$.tokensWon." + tokenType
		_, err := db.rejsonHandler.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	} else {
		wonAmount := betAmount * 1.9
		path := "$.tokensWon." + tokenType
		_, err := db.rejsonHandler.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	}

	return
}

func (db *dbStore) AddLostTokens(userId string, betAmount float64, tokenType string) {
	path := "$.tokensLost." + tokenType
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, path)
	str, err := cmd.Text()
	if err != nil {
		log.Println("error while do", err)
		return
	}

	data := []byte(str)
	var arr []float64
	err = json.Unmarshal(data, &arr)
	if err != nil {
		log.Println("error while unmarshal", err)
		return
	}

	if len(arr) > 0 {
		// token exists in array
		lostAmount := arr[0]
		lostAmount += betAmount
		path := "$.tokensLost." + tokenType
		_, err := db.rejsonHandler.JSONSet(userId, path, lostAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	} else {
		lostAmount := betAmount
		path := "$.tokensLost." + tokenType
		_, err := db.rejsonHandler.JSONSet(userId, path, lostAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	}

	return
}

func (db *dbStore) SaveGame(userId string, game *model.Game, saveToMongo bool) {
	/*
		Save game to redis
	*/
	res, err := db.rejsonHandler.JSONArrLen(userId, "$.games")
	if err != nil {
		log.Println(err)
		return
	}

	resArr := res.([]interface{})
	gameCount := resArr[0].(int64)

	if gameCount < 10 {
		_, err = db.rejsonHandler.JSONArrAppend(userId, "$.games", game)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		_, err = db.rejsonHandler.JSONArrTrim(userId, "$.games", 1, 9)
		if err != nil {
			log.Println(err)
			return
		}

		_, err = db.rejsonHandler.JSONArrAppend(userId, "$.games", game)
		if err != nil {
			log.Println(err)
			return
		}
	}

	/*
		Save game to mongo db
	*/
	if saveToMongo {
		gamesCollection := db.mongoClient.Database("primary").Collection("games")
		_, err = gamesCollection.InsertOne(ctx, game)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func (db *dbStore) GetGamesFromCache(userId string) ([]byte, error) {
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, "$.games")
	val := cmd.Val()
	if val == nil {
		return []byte("[]"), nil
	}
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) GetUserGameCountFromCache(userId string) ([]byte, error) {
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, "winCount", "loseCount")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) GetWonTokensFromCache(userId string) ([]byte, error) {
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, "tokensWon")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) GetLostTokensFromCache(userId string) ([]byte, error) {
	cmd := db.redisClient.Do(ctx, "JSON.GET", userId, "tokensLost")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) GetRoomsUpdatedAtFromCache() ([]byte, error) {
	cmd := db.redisClient.Do(ctx, "JSON.GET", "rooms", "updatedAt")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) GetRoomsFromCache() ([]byte, error) {
	keyRooms := viper.GetString("KEY_ROOMS")
	cmd := db.redisClient.Do(ctx, "JSON.GET", keyRooms)
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func (db *dbStore) SubscribeToPubSubChannel(channelName string) *redis.PubSub {
	sub := db.redisClient.Subscribe(ctx, channelName)
	return sub
}

func (db *dbStore) GetValueFromCache(key string) *redis.StringCmd {
	return db.redisClient.Get(ctx, key)
}

func (db *dbStore) CheckIfKeyExistsInCache(key string) (bool, error) {
	exists, err := db.redisClient.Exists(ctx, key).Result()
	return exists == 1, err
}

func (db *dbStore) SetValueInCache(key string, val interface{}) *redis.StatusCmd {
	return db.redisClient.Set(ctx, key, val, 0)
}

func (db *dbStore) IncrementValueInCache(key string) *redis.IntCmd {
	return db.redisClient.Incr(ctx, key)
}

func (db *dbStore) DecrementValueInCache(key string) *redis.IntCmd {
	return db.redisClient.Decr(ctx, key)
}

func (db *dbStore) PublishToPubSubChannel(channelName string, msg interface{}) *redis.IntCmd {
	return db.redisClient.Publish(ctx, channelName, msg)
}

func (db *dbStore) GetCollectionFromDB(collection string) *mongo.Collection {
	return db.mongoClient.Database("primary").Collection(collection)
}

func (db *dbStore) SetJSONInCache(key string, path string, val interface{}) (interface{}, error) {
	return db.rejsonHandler.JSONSet(key, path, val)
}

func (db *dbStore) GetJSONValFromCache(key string, path ...string) *redis.Cmd {
	return db.redisClient.Do(ctx, "JSON.GET", key, path)
}

func (db *dbStore) GetGamesFromDB(userId string, timestamp time.Time) ([]byte, error) {
	gamesCollection := db.mongoClient.Database("primary").Collection("games")

	opts := options.Find().SetLimit(10).SetSort(bson.D{{"timestamp", -1}})
	filter := bson.D{
		{"$or", bson.A{
			bson.D{{"user1", userId}},
			bson.D{{"user2", userId}},
		}},
		{"timestamp", bson.D{
			{"$lt", timestamp},
		}},
	}
	cur, err := gamesCollection.Find(ctx, filter, opts)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var games []bson.M
	err = cur.All(ctx, &games)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data, err := json.Marshal(games)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return data, nil
}
