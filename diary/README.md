# 智能日记管理系统

一个基于Go语言和MySQL的日记管理系统，具有现代化的科技感界面。

## 功能特点

- ✅ 写日记：创建新的日记条目
- ✅ 存储日记到数据库：自动保存到MySQL数据库
- ✅ 编辑修改日记：支持修改已有的日记
- ✅ 按日期查找日记：快速定位特定日期的日记
- ✅ 日记分类：支持对日记进行分类管理
- ✅ 科技感界面：现代化的UI设计，具有霓虹灯效果和流畅的动画

## 技术栈

- **后端**：Go语言 + Gin框架 + MySQL
- **前端**：HTML5 + CSS3 + JavaScript
- **数据库**：MySQL

## 快速开始

### 1. 环境要求

- Go 1.20 或更高版本
- MySQL 5.7 或更高版本
- 现代Web浏览器

### 2. 数据库配置

1. 打开 `utils/db.go` 文件，修改数据库连接信息：

```go
// 请根据您的MySQL配置修改以下连接信息
dsn := "root:password@tcp(127.0.0.1:3306)/diary_system?charset=utf8mb4&parseTime=True&loc=Local"
```

2. 执行数据库初始化脚本：

```bash
# 在项目根目录执行
mysql -u root -p -e "source db_init.sql"
```

### 3. 运行后端服务

```bash
# 下载依赖
go mod tidy

# 启动服务器
go run main.go
```

服务器将在 `http://localhost:8080` 上运行。

### 4. 访问前端页面

直接在浏览器中打开 `index.html` 文件即可访问系统。

## API接口

### 日记相关

- `GET /api/diaries` - 获取所有日记
- `POST /api/diaries` - 创建新日记
- `GET /api/diaries/:id` - 获取单个日记
- `PUT /api/diaries/:id` - 更新日记
- `DELETE /api/diaries/:id` - 删除日记
- `GET /api/diaries/by-date/:date` - 按日期获取日记（日期格式：YYYY-MM-DD）

### 分类相关

- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建新分类

## 项目结构

```
diary/
├── main.go              # 后端入口文件
├── db_init.sql          # 数据库初始化脚本
├── go.mod               # Go模块配置
├── index.html           # 前端主页面
├── style.css            # 前端样式文件
├── script.js            # 前端JavaScript文件
├── controllers/         # 控制器
│   ├── diary_controller.go    # 日记控制器
│   └── category_controller.go # 分类控制器
├── models/              # 数据模型
│   ├── diary.go         # 日记模型
│   └── category.go      # 分类模型
├── routes/              # 路由配置
│   └── routes.go        # 路由设置
└── utils/               # 工具函数
    └── db.go            # 数据库连接
```

## 界面预览

- **主界面**：科技感十足的仪表盘，展示所有日记
- **写日记**：简洁的编辑器，支持分类选择
- **编辑日记**：方便的编辑界面
- **按日期查找**：快速定位特定日期的日记
- **分类筛选**：按分类查看日记

## 注意事项

1. 确保MySQL服务正在运行
2. 确保数据库连接信息正确配置
3. 后端服务需要在前端页面之前启动
4. 浏览器需要支持现代JavaScript特性

## 许可证

MIT License