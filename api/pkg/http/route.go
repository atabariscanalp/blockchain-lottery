package http

import (
	"github.com/gorilla/mux"
	"net/http"
)

func SetupRoutes(router *mux.Router, handler *Handler) {
	router.HandleFunc("/get-conversion", handler.ConversionHandler).Methods(http.MethodGet)
	router.HandleFunc("/games/save", handler.SaveGameHandler).Methods(http.MethodPost)
}
