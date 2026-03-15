package models

import "diary_system/utils"

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// GetAllCategories 获取所有分类
func GetAllCategories() ([]Category, error) {
	query := `SELECT id, name FROM categories ORDER BY id`

	rows, err := utils.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	return categories, nil
}

// CreateCategory 创建分类
func CreateCategory(category Category) (int, error) {
	query := `INSERT INTO categories (name) VALUES (?)`
	result, err := utils.DB.Exec(query, category.Name)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}