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
	router.HandleFunc("/games/get-count/{userId}", handler.GetGameCountHandler).Methods(http.MethodGet)
	router.HandleFunc("/games/get-won-tokens/{userId}", handler.GetTokensWonHandler).Methods(http.MethodGet)
	router.HandleFunc("/games/get-lost-tokens/{userId}", handler.GetTokensLostHandler).Methods(http.MethodGet)

	router.HandleFunc("/users/get-active", handler.GetOnlineUserCountHandler)
	router.HandleFunc("/users/set-active/incr", handler.IncrementActiveUserHandler).Methods(http.MethodPost)
	router.HandleFunc("/users/set-active/decr", handler.DecrementActiveUserHandler).Methods(http.MethodPost)
}
