package utils

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() error {
	// 数据库连接信息
	// 请根据您的MySQL配置修改以下连接信息
	dsn := "root:password@tcp(127.0.0.1:3306)/diary_system?charset=utf8mb4&parseTime=True&loc=Local"
	
	// 连接数据库
	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	
	// 测试连接
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}
	
	return nil
}