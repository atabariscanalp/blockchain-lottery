package http

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/nitishm/go-rejson/v4"
	"go.mongodb.org/mongo-driver/mongo"
	"io"
	"log"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type BinanceResponse struct {
	Price  string `json:"price"`
	Symbol string `json:"symbol"`
}

type Handler struct {
	Redis *redis.Client
	Rh    *rejson.Handler
	Mongo *mongo.Client
}

func (h *Handler) ConversionHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	WsReader(ws)
}

func (h *Handler) SaveGameHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}

	// extract game info from body
	data := model.Game{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Println(err)
		return
	}

	err = SaveGame(&data, h)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusFailedDependency)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) GetGameHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	timestamp := vars["timestamp"]
	userId := vars["userId"]

	if timestamp == "now" {
		games, err := GetGamesFromCache(userId, h.Redis)
		if err != nil {
			w.WriteHeader(http.StatusSeeOther)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(games)
		w.WriteHeader(http.StatusOK)
		if err != nil {
			w.WriteHeader(http.StatusSeeOther)
			return
		}
	} else {
		ts, err := time.Parse(time.RFC3339, timestamp)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusSeeOther)
			return
		}

		games, err := GetGamesFromDB(userId, ts, h.Mongo)
		if err != nil {
			w.WriteHeader(http.StatusSeeOther)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(games)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusSeeOther)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

func (h *Handler) GetGameCountHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	gameCount, err := GetGameCountFromCache(userId, h.Redis)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(gameCount)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}
}

func (h *Handler) GetTokensWonHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	tokensWon, err := GetWonTokensFromCache(userId, h.Redis)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(tokensWon)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}
}

func (h *Handler) GetTokensLostHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	tokensWon, err := GetLostTokensFromCache(userId, h.Redis)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(tokensWon)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}
}

func (h *Handler) GetOnlineUserCountHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	exists, err := h.Redis.Exists(ctx, "activeUserAmount").Result()
	if err != nil {
		log.Printf("error while checking if user exists -> %s", err.Error())
		return
	}

	if exists == 0 {
		h.Redis.Set(ctx, "activeUserAmount", 0, 0)
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	OnlineUserCountReader(ws, h.Redis)
}

func (h *Handler) IncrementActiveUserHandler(w http.ResponseWriter, r *http.Request) {
	client := h.Redis
	count := client.Incr(ctx, "activeUserAmount").Val()
	client.Publish(ctx, "user.activeCount", count)

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DecrementActiveUserHandler(w http.ResponseWriter, r *http.Request) {
	client := h.Redis
	count := client.Decr(ctx, "activeUserAmount").Val()
	client.Publish(ctx, "user.activeCount", count)

	w.WriteHeader(http.StatusOK)
}
