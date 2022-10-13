package http

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/spf13/viper"
	"io"
	"log"
	"net/http"
	"time"
)

// TODO: use url shortener to short user wallet id
// TODO: capture errors

var ctx = model.Ctx

func SaveGame(game *model.Game, h *Handler) error {
	user1Exists, err := h.DBSvc.CheckIfKeyExistsInCache(game.User1)
	user2Exists, err := h.DBSvc.CheckIfKeyExistsInCache(game.User2)
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
			err = h.DBSvc.IncrementWonGame(game.User1)
			if err != nil {
				return err
			}

			// increment tokensWon by won amount
			h.DBSvc.AddWonTokens(game.User1, game.BetAmount, game.TokenType)
		} else {
			// increment lost game count by 1
			err = h.DBSvc.IncrementLostGame(game.User1)
			if err != nil {
				return err
			}

			// increment tokensLost by lost amount
			h.DBSvc.AddLostTokens(game.User1, game.BetAmount, game.TokenType)
		}

		// append game to user games
		h.DBSvc.SaveGame(game.User1, game, true)
	} else {
		// user does not exist, so create a new one
		user := model.User{}

		user.History.TokensWon = make(map[string]float64)
		user.History.TokensLost = make(map[string]float64)
		/*
			if result is 0, user won the game
		*/
		if game.Result == 0 {
			user.History.WinCount = 1
			user.History.TokensWon[game.TokenType] = game.BetAmount * 1.9
		} else {
			user.History.LoseCount = 1
			user.History.TokensLost[game.TokenType] = game.BetAmount
		}

		// append game to user games
		user.History.Games = append(user.History.Games, game)

		_, err := h.DBSvc.SetJSONInCache(game.User1, "$", user)
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
			err = h.DBSvc.IncrementWonGame(game.User2)
			if err != nil {
				return err
			}

			// increment tokensWon by won amount
			h.DBSvc.AddWonTokens(game.User2, game.BetAmount, game.TokenType)
		} else {
			// increment lost game count by 1
			err = h.DBSvc.IncrementLostGame(game.User2)
			if err != nil {
				return err
			}

			// increment tokensLost by lost amount
			h.DBSvc.AddLostTokens(game.User2, game.BetAmount, game.TokenType)
		}

		// append game to user games
		h.DBSvc.SaveGame(game.User2, game, false)
	} else {
		// user does not exist, so create a new one
		user := model.User{}

		user.History.TokensWon = make(map[string]float64)
		user.History.TokensLost = make(map[string]float64)
		/*
			if result is 1, user won the game
		*/
		if game.Result == 1 {
			user.History.WinCount = 1
			user.History.TokensWon[game.TokenType] = game.BetAmount * 1.9 // TODO: think about overflow
		} else {
			user.History.LoseCount = 1
			user.History.TokensLost[game.TokenType] = game.BetAmount
		}

		// append game to user games
		user.History.Games = append(user.History.Games, game)

		_, err := h.DBSvc.SetJSONInCache(game.User2, "$", user)
		if err != nil {
			log.Println("error while setting json user2 info")
			return err
		}
	}

	return nil
}

func CurrencyConversionReader(conn *websocket.Conn) {
	for {
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

func OnlineUserCountReader(conn *websocket.Conn, h *Handler) {
	sub := h.DBSvc.SubscribeToPubSubChannel("user.activeCount")
	str := h.DBSvc.GetValueFromCache("activeUserAmount")
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

func GetRoomsUpdatedAtReader(conn *websocket.Conn, h *Handler) {
	// check cache every second for new room entries
	for range time.Tick(time.Second * 3) {
		updatedAt, err := h.DBSvc.GetRoomsUpdatedAtFromCache()

		err = conn.WriteMessage(1, updatedAt)
		if err != nil {
			_ = conn.Close()
			return
		}
	}
}

func CreateRoomReader(conn *websocket.Conn, h *Handler) {
	var room model.Room
	err := conn.ReadJSON(&room)

	id := room.ID.ID()
	if id != 0 {
		keyRooms := viper.GetString("KEY_ROOMS")
		channelRoomsJoin := viper.GetString("CHANNEL_ROOMS_JOIN")

		log.Println("create room-->", room)

		// save room to cache
		path := "$.data." + room.ID.String()
		_, err = h.DBSvc.SetJSONInCache(keyRooms, path, room)
		if err != nil {
			log.Println(err)
			_ = conn.Close()
			return
		}
		log.Println("successfully saved room to cache", room.ID)

		// update "updatedAt"
		path = "$.updatedAt"
		now := time.Now().UTC()
		_, err = h.DBSvc.SetJSONInCache(keyRooms, path, now)
		if err != nil {
			log.Println(err)
			_ = conn.Close()
			return
		}
		log.Println("successfully updated 'updatedAt'")

		val, ok := <-h.RoomChan
		if ok {
			log.Println("val", val)
		}

		sub := h.DBSvc.SubscribeToPubSubChannel(channelRoomsJoin + "aa")
		log.Println("subscribed to games.challenge-request")

		type gameStatus struct {
			status string
		}
		var status gameStatus
		err := conn.ReadJSON(&status)
		if err != nil {
			log.Println(err)
			_ = conn.Close()
		}

		if len(status.status) > 0 {
			log.Println("status", status.status)
		}

		log.Println("waiting for sub to receive messages...")

		for {
			_, err := sub.ReceiveMessage(ctx)
			// get message as json obj
			iface, err := sub.Receive(ctx)
			if err != nil {
				log.Println(err)
				_ = conn.Close()
				return
			}

			log.Println("received a message", iface)

			type Msg struct {
				roomId uuid.UUID
				userId string
			}
			msg, ok := iface.(*Msg)

			log.Println("ok", ok)

			if msg.roomId == room.ID {
				bytes, err := json.Marshal(msg)
				err = conn.WriteMessage(1, bytes)
				if err != nil {
					log.Println(err)
					_ = conn.Close()
					return
				}
				break
			}
		}
	}
}
