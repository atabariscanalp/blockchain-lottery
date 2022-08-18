package http

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"github.com/nitishm/go-rejson/v4"
	"io"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type BinanceResponse struct {
	Price  string `json:"price"`
	Symbol string `json:"symbol"`
}

type OnlineUserResponse struct {
	Counter json.Number `json:"counter"`
}

type Handler struct {
	Redis *redis.Client
	Rh    *rejson.Handler
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
