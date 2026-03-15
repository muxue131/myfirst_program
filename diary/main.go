package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"diary_system/routes"
	"diary_system/utils"
)

func main() {
	// 初始化数据库连接
	if err := utils.InitDB(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 创建Gin引擎
	r := gin.Default()

	// 配置CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 提供静态文件服务
	r.GET("/", func(c *gin.Context) {
		c.File("index.html")
	})
	r.GET("/style.css", func(c *gin.Context) {
		c.File("style.css")
	})
	r.GET("/script.js", func(c *gin.Context) {
		c.File("script.js")
	})

	// 注册API路由
	routes.SetupRoutes(r)

	// 启动服务器
	log.Println("Server running on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}