package app

import (
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/db"
	httpPkg "github.com/atabariscanalp/blockchain-lottery/api/pkg/http"
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/model"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type App struct {
	Router      *mux.Router
	HttpHandler *httpPkg.Handler
}

func (a *App) initializeRoutes() {
	a.Router = mux.NewRouter()
	httpPkg.SetupRoutes(a.Router, a.HttpHandler)

	log.Println("successfully initialized routes...")
}

func (a *App) initializeDB() {
	dbSvc, err := db.NewDBService()
	if err != nil {
		return
	}

	a.HttpHandler = &httpPkg.Handler{
		DBSvc:    dbSvc,
		RoomChan: make(chan string),
	}
}

func (a *App) getEnvValues() {
	model.ReadConfigValues()
}

func (a *App) initialize() {
	a.getEnvValues()
	a.initializeDB()
	a.initializeRoutes()
}

func (a *App) Run() {
	a.initialize()

	log.Fatal(http.ListenAndServe(":8080", a.Router))
}
