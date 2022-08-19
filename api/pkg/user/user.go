package user

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/nitishm/go-rejson/v4"
	"log"
)

var ctx = context.Background()

type Details struct {
	WinCount   uint               `json:"winCount"`
	LoseCount  uint               `json:"loseCount"`
	TokensWon  map[string]float64 `json:"tokensWon"`
	TokensLost map[string]float64 `json:"tokensLost"`
	Games      []*model.Game      `json:"games"`
}

func (user *Details) CheckIfExists(userId string, client *redis.Client) (bool, error) {
	exists, err := client.Exists(ctx, userId).Result()
	if err != nil {
		log.Printf("error while checking if user exists -> %s", err.Error())
		return false, errors.New("error while checking user exists")
	}
	return exists == 1, nil
}

func (user *Details) IncrementWonGame(userId string, rh *rejson.Handler) error {
	_, err := rh.JSONNumIncrBy(userId, "$.winCount", 1)
	if err != nil {
		log.Println("error while incrementing user win game amount")
		return err
	}
	return nil
}

func (user *Details) IncrementLostGame(userId string, rh *rejson.Handler) error {
	_, err := rh.JSONNumIncrBy(userId, "$.loseCount", 1)
	if err != nil {
		log.Println("error while incrementing user lost game amount")
		return err
	}
	return nil
}

func (user *Details) AddWonTokens(userId string, betAmount float64, tokenType string, rh *rejson.Handler, client *redis.Client) {
	path := "$.tokensWon." + tokenType
	cmd := client.Do(ctx, "JSON.GET", userId, path)
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
		_, err := rh.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	} else {
		wonAmount := betAmount * 1.9
		path := "$.tokensWon." + tokenType
		_, err := rh.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	}

	return
}

func (user *Details) AddLostTokens(userId string, betAmount float64, tokenType string, rh *rejson.Handler, client *redis.Client) {
	path := "$.tokensLost." + tokenType
	cmd := client.Do(ctx, "JSON.GET", userId, path)
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
		wonAmount += betAmount
		path := "$.tokensLost." + tokenType
		_, err := rh.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	} else {
		wonAmount := betAmount
		path := "$.tokensLost." + tokenType
		_, err := rh.JSONSet(userId, path, wonAmount)
		if err != nil {
			log.Println("error while setting won amount", err)
			return
		}
	}

	return
}

func (user *Details) SaveGame(userId string, game *model.Game, rh *rejson.Handler) {
	res, err := rh.JSONArrLen(userId, "$.games")
	if err != nil {
		log.Println(err)
		return
	}

	resArr := res.([]interface{})
	gameCount := resArr[0].(int64)

	if gameCount < 10 {
		_, err = rh.JSONArrAppend(userId, "$.games", game)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		_, err = rh.JSONArrTrim(userId, "$.games", 1, 9)
		if err != nil {
			log.Println(err)
			return
		}

		_, err = rh.JSONArrAppend(userId, "$.games", game)
		if err != nil {
			log.Println(err)
			return
		}
	}
}
