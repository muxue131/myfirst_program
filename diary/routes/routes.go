package routes

import (
	"github.com/gin-gonic/gin"

	"diary_system/controllers"
)

func SetupRoutes(r *gin.Engine) {
	// API路由组
	apiGroup := r.Group("/api")
	{
		// 日记相关路由
		diaryGroup := apiGroup.Group("/diaries")
		{
			diaryGroup.GET("", controllers.GetDiaries)
			diaryGroup.POST("", controllers.CreateDiary)
			diaryGroup.GET("/:id", controllers.GetDiary)
			diaryGroup.PUT("/:id", controllers.UpdateDiary)
			diaryGroup.DELETE("/:id", controllers.DeleteDiary)
			diaryGroup.GET("/by-date/:date", controllers.GetDiariesByDate)
		}

		// 分类相关路由
		categoryGroup := apiGroup.Group("/categories")
		{
			categoryGroup.GET("", controllers.GetCategories)
			categoryGroup.POST("", controllers.CreateCategory)
		}
	}
}