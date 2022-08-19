package http

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	userPkg "github.com/atabariscanalp/blockchain-lottery/api/pkg/user"
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net/http"
	"time"
)

// TODO: use url shortener to short user wallet id
// TODO: capture errors

func SaveGame(game *model.Game, handler *Handler) error {
	user := userPkg.Details{}

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
		user.SaveGame(game.User1, game, handler.Rh)
	} else {
		// user does not exist, so create a new one
		user := userPkg.Details{}

		/*
			if result is 0, user won the game
		*/
		if game.Result == 0 {
			user.WinCount = 1
			user.TokensWon = make(map[string]float64)
			user.TokensWon[game.TokenType] = game.BetAmount * 1.9
		} else {
			user.LoseCount = 1
			user.TokensLost = make(map[string]float64)
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
		user.SaveGame(game.User2, game, handler.Rh)
	} else {
		// user does not exist, so create a new one
		user := userPkg.Details{}

		/*
			if result is 1, user won the game
		*/
		if game.Result == 1 {
			user.WinCount = 1
			user.TokensWon = make(map[string]float64)
			user.TokensWon[game.TokenType] = game.BetAmount * 1.9
		} else {
			user.LoseCount = 1
			user.TokensLost = make(map[string]float64)
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
