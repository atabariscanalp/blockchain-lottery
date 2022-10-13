package http

import (
	"github.com/gorilla/mux"
	"net/http"
)

func SetupRoutes(router *mux.Router, handler *Handler) {
	router.Use(AccessControlMiddleware)

	router.HandleFunc("/crypto/get-conversion", handler.ConversionHandler)

	router.HandleFunc("/games/save", handler.SaveGameHandler).Methods(http.MethodPost)
	router.HandleFunc("/games/get/{userId}/{timestamp}", handler.GetGameHandler).Methods(http.MethodGet)

	router.HandleFunc("/users/get-active", handler.GetOnlineUserCountHandler)
	router.HandleFunc("/users/set-active/incr", handler.IncrementActiveUserHandler).Methods(http.MethodPost)
	router.HandleFunc("/users/set-active/decr", handler.DecrementActiveUserHandler).Methods(http.MethodPost)
	router.HandleFunc("/users/{userId}/get-game-count", handler.GetGameCountHandler).Methods(http.MethodGet)
	router.HandleFunc("/users/{userId}/get-won-tokens", handler.GetTokensWonHandler).Methods(http.MethodGet)
	router.HandleFunc("/users/{userId}/get-lost-tokens", handler.GetTokensLostHandler).Methods(http.MethodGet)

	router.HandleFunc("/rooms/create", handler.CreateRoomHandler)             // websocket
	router.HandleFunc("/rooms/get-updated", handler.GetRoomsUpdatedAtHandler) // websocket
	router.HandleFunc("/rooms/get", handler.GetRoomsHandler).Methods(http.MethodGet)
	router.HandleFunc("/rooms/join", handler.JoinRoomHandler).Methods(http.MethodPost)
}
