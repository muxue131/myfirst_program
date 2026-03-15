package models

import (
	"database/sql"
	"time"

	"diary_system/utils"
)

type Diary struct {
	ID         int       `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	CategoryID *int      `json:"category_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Category   *Category `json:"category,omitempty"`
}

// GetAllDiaries 获取所有日记
func GetAllDiaries() ([]Diary, error) {
	query := `
		SELECT d.id, d.title, d.content, d.category_id, d.created_at, d.updated_at, c.id, c.name 
		FROM diaries d
		LEFT JOIN categories c ON d.category_id = c.id
		ORDER BY d.created_at DESC
	`

	rows, err := utils.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var diaries []Diary
	for rows.Next() {
		var diary Diary
		var categoryID sql.NullInt64
		var categoryIDJoin sql.NullInt64
		var categoryName sql.NullString

		err := rows.Scan(
			&diary.ID, &diary.Title, &diary.Content, &categoryID, 
			&diary.CreatedAt, &diary.UpdatedAt, &categoryIDJoin, &categoryName,
		)
		if err != nil {
			return nil, err
		}

		if categoryID.Valid {
			categoryIDValue := int(categoryID.Int64)
			diary.CategoryID = &categoryIDValue
			if categoryIDJoin.Valid && categoryName.Valid {
				diary.Category = &Category{
					ID:   int(categoryIDJoin.Int64),
					Name: categoryName.String,
				}
			}
		}

		diaries = append(diaries, diary)
	}

	return diaries, nil
}

// CreateDiary 创建日记
func CreateDiary(diary Diary) (int, error) {
	query := `INSERT INTO diaries (title, content, category_id) VALUES (?, ?, ?)`
	var categoryID interface{}
	if diary.CategoryID != nil {
		categoryID = *diary.CategoryID
	} else {
		categoryID = nil
	}
	result, err := utils.DB.Exec(query, diary.Title, diary.Content, categoryID)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

// GetDiaryByID 根据ID获取日记
func GetDiaryByID(id int) (Diary, error) {
	query := `
		SELECT d.id, d.title, d.content, d.category_id, d.created_at, d.updated_at, c.id, c.name 
		FROM diaries d
		LEFT JOIN categories c ON d.category_id = c.id
		WHERE d.id = ?
	`

	var diary Diary
	var categoryID sql.NullInt64
	var categoryIDJoin sql.NullInt64
	var categoryName sql.NullString

	err := utils.DB.QueryRow(query, id).Scan(
		&diary.ID, &diary.Title, &diary.Content, &categoryID, 
		&diary.CreatedAt, &diary.UpdatedAt, &categoryIDJoin, &categoryName,
	)
	if err != nil {
		return Diary{}, err
	}

	if categoryID.Valid {
		categoryIDValue := int(categoryID.Int64)
		diary.CategoryID = &categoryIDValue
		if categoryIDJoin.Valid && categoryName.Valid {
			diary.Category = &Category{
				ID:   int(categoryIDJoin.Int64),
				Name: categoryName.String,
			}
		}
	}

	return diary, nil
}

// UpdateDiary 更新日记
func UpdateDiary(diary Diary) error {
	query := `UPDATE diaries SET title = ?, content = ?, category_id = ? WHERE id = ?`
	var categoryID interface{}
	if diary.CategoryID != nil {
		categoryID = *diary.CategoryID
	} else {
		categoryID = nil
	}
	_, err := utils.DB.Exec(query, diary.Title, diary.Content, categoryID, diary.ID)
	return err
}

// DeleteDiary 删除日记
func DeleteDiary(id int) error {
	query := `DELETE FROM diaries WHERE id = ?`
	_, err := utils.DB.Exec(query, id)
	return err
}

// GetDiariesByDate 按日期获取日记
func GetDiariesByDate(date time.Time) ([]Diary, error) {
	startDate := date.Truncate(24 * time.Hour)
	endDate := startDate.Add(24 * time.Hour)

	query := `
		SELECT d.id, d.title, d.content, d.category_id, d.created_at, d.updated_at, c.id, c.name 
		FROM diaries d
		LEFT JOIN categories c ON d.category_id = c.id
		WHERE d.created_at >= ? AND d.created_at < ?
		ORDER BY d.created_at DESC
	`

	rows, err := utils.DB.Query(query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var diaries []Diary
	for rows.Next() {
		var diary Diary
		var categoryID sql.NullInt64
		var categoryIDJoin sql.NullInt64
		var categoryName sql.NullString

		err := rows.Scan(
			&diary.ID, &diary.Title, &diary.Content, &categoryID, 
			&diary.CreatedAt, &diary.UpdatedAt, &categoryIDJoin, &categoryName,
		)
		if err != nil {
			return nil, err
		}

		if categoryID.Valid {
			categoryIDValue := int(categoryID.Int64)
			diary.CategoryID = &categoryIDValue
			if categoryIDJoin.Valid && categoryName.Valid {
				diary.Category = &Category{
					ID:   int(categoryIDJoin.Int64),
					Name: categoryName.String,
				}
			}
		}

		diaries = append(diaries, diary)
	}

	return diaries, nil
}