package http

import (
	"encoding/json"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
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
	DBSvc    model.DBService
	RoomChan chan string
}

func (h *Handler) ConversionHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	defer ws.Close()

	CurrencyConversionReader(ws)
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
		games, err := h.DBSvc.GetGamesFromCache(userId)
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

		games, err := h.DBSvc.GetGamesFromDB(userId, ts)
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

	gameCount, err := h.DBSvc.GetUserGameCountFromCache(userId)

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

	tokensWon, err := h.DBSvc.GetWonTokensFromCache(userId)

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(tokensWon)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func (h *Handler) GetTokensLostHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	tokensLost, err := h.DBSvc.GetLostTokensFromCache(userId)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(tokensLost)
	if err != nil {
		w.WriteHeader(http.StatusSeeOther)
		return
	}
}

func (h *Handler) GetOnlineUserCountHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	exists, err := h.DBSvc.CheckIfKeyExistsInCache("activeUserAmount")
	if err != nil {
		log.Printf("error while checking if user exists -> %s", err.Error())
		return
	}

	// TODO: error handle
	if !exists {
		h.DBSvc.SetValueInCache("activeUserAmount", 0)
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	defer ws.Close()

	OnlineUserCountReader(ws, h)
}

func (h *Handler) IncrementActiveUserHandler(w http.ResponseWriter, r *http.Request) {
	count := h.DBSvc.IncrementValueInCache("activeUserAmount").Val()
	h.DBSvc.PublishToPubSubChannel("user.activeCount", count)

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DecrementActiveUserHandler(w http.ResponseWriter, r *http.Request) {
	count := h.DBSvc.DecrementValueInCache("activeUserAmount")
	h.DBSvc.PublishToPubSubChannel("user.activeCount", count)

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) CreateRoomHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	defer ws.Close()

	CreateRoomReader(ws, h)
}

func (h *Handler) GetRoomsHandler(w http.ResponseWriter, r *http.Request) {
	rooms, err := h.DBSvc.GetRoomsFromCache()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = w.Write(rooms)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func (h *Handler) GetRoomsUpdatedAtHandler(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	defer ws.Close()

	GetRoomsUpdatedAtReader(ws, h)
}

func (h *Handler) JoinRoomHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}

	type request struct {
		roomId string
		userId string
	}
	var data *request
	err = json.Unmarshal(body, &data)
	if err != nil {
		log.Println(err)
		return
	}

	path := "activeGames." + data.roomId + ".user2"
	h.DBSvc.SetValueInCache(path, data.userId)

	h.RoomChan <- data.roomId

	// publish gameId to challenge request channel
	// h.DBSvc.PublishToPubSubChannel("games.challenge-request", body)

	w.WriteHeader(http.StatusOK)
}
