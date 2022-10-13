package db

import (
	"context"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"time"
)

type mongoDB struct {
	Client *mongo.Client
}

func InitMongo() (*mongoDB, error) {
	serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)
	mongoUri := viper.GetString("MONGO_URI")
	clientOptions := options.Client().ApplyURI(mongoUri).SetServerAPIOptions(serverAPIOptions)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &mongoDB{
		Client: client,
	}, nil
}
