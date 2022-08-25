package http

import (
	"context"
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	userPkg "github.com/atabariscanalp/blockchain-lottery/api/pkg/user"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"io"
	"log"
	"net/http"
	"time"
)

var ctx = context.Background()

// TODO: use url shortener to short user wallet id
// TODO: capture errors

func SaveGame(game *model.Game, handler *Handler) error {
	user := userPkg.Details{}
	gamesCollection := handler.Mongo.Database("primary").Collection("games")

	user1Exists, err := user.CheckIfExists(game.User1, handler.Redis)
	if err != nil {
		return err
	}
	user2Exists, err := user.CheckIfExists(game.User2, handler.Redis)
	if err != nil {
		return err
	}

	// if user1 exists override existing data
	if user1Exists {
		/*
			if result is 0, user won the game
		*/
		if game.Result == 0 {
			// increment gameWon value by 1
			err = user.IncrementWonGame(game.User1, handler.Rh)
			if err != nil {
				return err
			}

			// increment tokensWon by won amount
			user.AddWonTokens(game.User1, game.BetAmount, game.TokenType, handler.Rh, handler.Redis)
		} else {
			// increment lost game count by 1
			err = user.IncrementLostGame(game.User1, handler.Rh)
			if err != nil {
				return err
			}

			// increment tokensLost by lost amount
			user.AddLostTokens(game.User1, game.BetAmount, game.TokenType, handler.Rh, handler.Redis)
		}

		// append game to user games
		user.SaveGame(game.User1, game, handler.Rh, gamesCollection, true)
	} else {
		// user does not exist, so create a new one
		user := userPkg.Details{}

		user.TokensWon = make(map[string]float64)
		user.TokensLost = make(map[string]float64)
		/*
			if result is 0, user won the game
		*/
		if game.Result == 0 {
			user.WinCount = 1
			user.TokensWon[game.TokenType] = game.BetAmount * 1.9
		} else {
			user.LoseCount = 1
			user.TokensLost[game.TokenType] = game.BetAmount
		}

		// append game to user games
		user.Games = append(user.Games, game)

		_, err := handler.Rh.JSONSet(game.User1, "$", user)
		if err != nil {
			log.Println("error while json setting user1 info")
			return err
		}
	}

	// if user2 exists override existing data
	if user2Exists {
		/*
			if result is 1, user won the game
		*/
		if game.Result == 1 {
			// increment gameWon value by 1
			err = user.IncrementWonGame(game.User2, handler.Rh)
			if err != nil {
				return err
			}

			// increment tokensWon by won amount
			user.AddWonTokens(game.User2, game.BetAmount, game.TokenType, handler.Rh, handler.Redis)
		} else {
			// increment lost game count by 1
			err = user.IncrementLostGame(game.User2, handler.Rh)
			if err != nil {
				return err
			}

			// increment tokensLost by lost amount
			user.AddLostTokens(game.User2, game.BetAmount, game.TokenType, handler.Rh, handler.Redis)
		}

		// append game to user games
		user.SaveGame(game.User2, game, handler.Rh, gamesCollection, false)
	} else {
		// user does not exist, so create a new one
		user := userPkg.Details{}

		user.TokensWon = make(map[string]float64)
		user.TokensLost = make(map[string]float64)
		/*
			if result is 1, user won the game
		*/
		if game.Result == 1 {
			user.WinCount = 1
			user.TokensWon[game.TokenType] = game.BetAmount * 1.9
		} else {
			user.LoseCount = 1
			user.TokensLost[game.TokenType] = game.BetAmount
		}

		// append game to user games
		user.Games = append(user.Games, game)

		_, err := handler.Rh.JSONSet(game.User2, "$", user)
		if err != nil {
			log.Println("error while setting json user2 info")
			return err
		}
	}

	return nil
}

func WsReader(conn *websocket.Conn) {
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		// send request every x seconds
		for range time.Tick(time.Second * 3) {
			// request MATIC/USDT rate from binance api
			resp, err := http.Get("https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT")
			if err != nil {
				log.Println(err)
				return
			}

			body, err := io.ReadAll(resp.Body)
			if err != nil {
				log.Println(err)
				return
			}

			data := BinanceResponse{}
			err = json.Unmarshal(body, &data)
			if err != nil {
				log.Println(err)
				return
			}

			if err := conn.WriteJSON(data); err != nil {
				log.Println(err)
				return
			}
		}

	}
}

func OnlineUserCountReader(conn *websocket.Conn, client *redis.Client) {
	sub := client.Subscribe(ctx, "user.activeCount")
	str := client.Get(ctx, "activeUserAmount")
	usrCount, err := str.Bytes()
	if err != nil {
		log.Println(err)
		_ = conn.WriteMessage(1, []byte("0"))
		return
	}
	err = conn.WriteMessage(1, usrCount)

	for {
		subMsg, err := sub.ReceiveMessage(ctx)
		if err != nil {
			log.Println(err)
			_ = conn.Close()
			return
		}
		err = conn.WriteMessage(1, []byte(subMsg.Payload))
		if err != nil {
			_ = conn.Close()
			return
		}
	}
}

func GetGamesFromCache(userId string, client *redis.Client) ([]byte, error) {
	cmd := client.Do(ctx, "JSON.GET", userId, "$.games")
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

func GetGamesFromDB(userId string, timestamp time.Time, client *mongo.Client) ([]byte, error) {
	gamesCollection := client.Database("primary").Collection("games")

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

func GetGameCountFromCache(userId string, client *redis.Client) ([]byte, error) {
	cmd := client.Do(ctx, "JSON.GET", userId, "winCount", "loseCount")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func GetWonTokensFromCache(userId string, client *redis.Client) ([]byte, error) {
	cmd := client.Do(ctx, "JSON.GET", userId, "tokensWon")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}

func GetLostTokensFromCache(userId string, client *redis.Client) ([]byte, error) {
	cmd := client.Do(ctx, "JSON.GET", userId, "tokensLost")
	str, err := cmd.Text()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	data := []byte(str)
	return data, nil
}
