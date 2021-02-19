package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
)

func getServer(port ...string) (*gin.Engine, func()) {
	var serverPort = ""
	if len(port) != 0 {
		if !strings.Contains(port[0], ":") {
			serverPort = strings.Join([]string{
				":",
				port[0],
			}, "")
		}
	}
	engine := gin.Default()
	engine.Use(
		cors.Default(),
	)
	return engine, func() {
		var err error
		if serverPort != "" {
			err = engine.Run(serverPort)
		} else {
			err = engine.Run()
		}
		if err != nil {
			log.Fatal(err)
		}
	}
}

func main() {
	engine, run := getServer()
	//
	engine.GET("/get/area/:file/:id", getArea)
	//
	run()
}

func getArea(ctx *gin.Context) {
	type info struct {
		ID          string `json:"id"`
		Description string `json:"description"`
		URL         string `json:"url"`
	}
	fileName := ctx.Param("file")
	areaId := ctx.Param("id")
	responseBody := &info{
		ID:          areaId,
		Description: "Hello, from server! ID " + areaId + ", and map " + fileName,
		URL:         "http://is.ulstu.ru/",
	}
	ctx.AbortWithStatusJSON(http.StatusOK, responseBody)
	return
}
