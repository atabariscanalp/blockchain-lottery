package app

import (
	"github.com/atabariscanalp/blockchain-lottery/api/pkg/db"
	httpPkg "github.com/atabariscanalp/blockchain-lottery/api/pkg/http"
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
	database, err := db.InitRedis()
	if err != nil {
		return
	}
	log.Println("successfully initialized redis db...")

	mongoClient, err := db.InitMongo()
	if err != nil {
		return
	}

	log.Println("successfully initialized mongo db...")

	a.HttpHandler = &httpPkg.Handler{
		Redis: database.Redis,
		Rh:    database.Rh,
		Mongo: mongoClient.Client,
	}
}

func (a *App) initialize() {
	a.initializeDB()
	a.initializeRoutes()
}

func (a *App) Run() {
	a.initialize()

	log.Fatal(http.ListenAndServe(":8080", a.Router))
}
