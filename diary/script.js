// API基础URL
const API_BASE_URL = 'http://localhost:8080/api';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initApp();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 初始化应用
function initApp() {
    // 加载分类数据
    loadCategories();
    // 加载日记数据
    loadDiaries();
}

// 绑定事件监听器
function bindEventListeners() {
    // 写日记按钮
    document.getElementById('add-diary-btn').addEventListener('click', function() {
        openDiaryModal();
    });
    
    // 按日期查找按钮
    document.getElementById('search-date-btn').addEventListener('click', function() {
        document.getElementById('date-input').focus();
    });
    
    // 搜索按钮
    document.getElementById('search-btn').addEventListener('click', function() {
        searchDiariesByDate();
    });
    
    // 分类筛选
    document.getElementById('category-select').addEventListener('change', function() {
        loadDiaries();
    });
    
    // 关闭日记模态框
    document.getElementById('close-modal').addEventListener('click', function() {
        closeDiaryModal();
    });
    
    // 取消按钮
    document.getElementById('cancel-btn').addEventListener('click', function() {
        closeDiaryModal();
    });
    
    // 保存按钮
    document.getElementById('save-btn').addEventListener('click', function() {
        saveDiary();
    });
    
    // 关闭删除模态框
    document.getElementById('close-delete-modal').addEventListener('click', function() {
        closeDeleteModal();
    });
    
    // 取消删除按钮
    document.getElementById('cancel-delete-btn').addEventListener('click', function() {
        closeDeleteModal();
    });
    
    // 确认删除按钮
    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
        confirmDelete();
    });
    
    // 日期输入框回车搜索
    document.getElementById('date-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDiariesByDate();
        }
    });
}

// 加载分类数据
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        
        // 填充分类下拉框
        const categorySelect = document.getElementById('category-select');
        const diaryCategory = document.getElementById('diary-category');
        
        // 清空现有选项（保留默认选项）
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        diaryCategory.innerHTML = '';
        
        // 添加分类选项
        categories.forEach(category => {
            // 添加到筛选下拉框
            const option1 = document.createElement('option');
            option1.value = category.id;
            option1.textContent = category.name;
            categorySelect.appendChild(option1);
            
            // 添加到日记表单下拉框
            const option2 = document.createElement('option');
            option2.value = category.id;
            option2.textContent = category.name;
            diaryCategory.appendChild(option2);
        });
    } catch (error) {
        console.error('加载分类失败:', error);
        showToast('加载分类失败');
    }
}

// 加载日记数据
async function loadDiaries() {
    showLoading();
    
    try {
        // 获取选中的分类
        const categoryId = document.getElementById('category-select').value;
        let url = `${API_BASE_URL}/diaries`;
        
        // 如果选择了特定分类，添加分类参数
        if (categoryId !== 'all') {
            url += `?category_id=${categoryId}`;
        }
        
        const response = await fetch(url);
        const diaries = await response.json();
        
        // 处理API返回null的情况
        if (!diaries) {
            renderDiaries([]);
        } else {
            renderDiaries(diaries);
        }
    } catch (error) {
        console.error('加载日记失败:', error);
        showToast('加载日记失败');
        renderDiaries([]);
    } finally {
        hideLoading();
    }
}

// 按日期搜索日记
async function searchDiariesByDate() {
    const date = document.getElementById('date-input').value;
    if (!date) {
        showToast('请选择日期');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/diaries/by-date/${date}`);
        const diaries = await response.json();
        
        // 处理API返回null的情况
        if (!diaries) {
            renderDiaries([]);
        } else {
            renderDiaries(diaries);
        }
    } catch (error) {
        console.error('搜索日记失败:', error);
        showToast('搜索日记失败');
        renderDiaries([]);
    } finally {
        hideLoading();
    }
}

// 渲染日记列表
function renderDiaries(diaries) {
    const diaryList = document.getElementById('diary-list');
    const emptyState = document.getElementById('empty-state');
    
    // 清空列表
    diaryList.innerHTML = '';
    
    // 处理diaries为null或空数组的情况
    if (!diaries || diaries.length === 0) {
        // 显示空状态
        emptyState.style.display = 'flex';
        return;
    }
    
    // 隐藏空状态
    emptyState.style.display = 'none';
    
    // 渲染日记卡片
    diaries.forEach(diary => {
        const card = createDiaryCard(diary);
        diaryList.appendChild(card);
    });
}

// 创建日记卡片
function createDiaryCard(diary) {
    const card = document.createElement('div');
    card.className = 'diary-card';
    
    // 格式化日期
    const createdAt = new Date(diary.created_at);
    const formattedDate = createdAt.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="diary-card-header">
            <div>
                <h3 class="diary-title">${diary.title}</h3>
                <div class="diary-meta">
                    <span>${formattedDate}</span>
                    ${diary.category ? `<span class="diary-category">${diary.category.name}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="diary-content">${diary.content}</div>
        <div class="diary-actions">
            <button class="action-btn edit-btn" onclick="editDiary(${diary.id})"><span class="icon">✏️</span> 编辑</button>
            <button class="action-btn delete-btn" onclick="openDeleteModal(${diary.id})"><span class="icon">🗑️</span> 删除</button>
        </div>
    `;
    
    return card;
}

// 打开日记模态框
function openDiaryModal(diary = null) {
    const modal = document.getElementById('diary-modal');
    const modalTitle = document.getElementById('modal-title');
    const diaryId = document.getElementById('diary-id');
    const diaryTitle = document.getElementById('diary-title');
    const diaryContent = document.getElementById('diary-content');
    const diaryCategory = document.getElementById('diary-category');
    
    if (diary) {
        // 编辑模式
        modalTitle.textContent = '编辑日记';
        diaryId.value = diary.id;
        diaryTitle.value = diary.title;
        diaryContent.value = diary.content;
        diaryCategory.value = diary.category_id || '';
    } else {
        // 新建模式
        modalTitle.textContent = '写日记';
        diaryId.value = '';
        diaryTitle.value = '';
        diaryContent.value = '';
        diaryCategory.value = '';
    }
    
    modal.classList.add('show');
}

// 关闭日记模态框
function closeDiaryModal() {
    const modal = document.getElementById('diary-modal');
    modal.classList.remove('show');
}

// 保存日记
async function saveDiary() {
    const diaryId = document.getElementById('diary-id').value;
    const title = document.getElementById('diary-title').value;
    const content = document.getElementById('diary-content').value;
    const categoryId = document.getElementById('diary-category').value;
    
    // 表单验证
    if (!title || !content) {
        showToast('标题和内容不能为空');
        return;
    }
    
    const diaryData = {
        title,
        content,
        category_id: categoryId ? parseInt(categoryId) : null
    };
    
    try {
        let response;
        if (diaryId) {
            // 更新日记
            response = await fetch(`${API_BASE_URL}/diaries/${diaryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diaryData)
            });
        } else {
            // 创建日记
            response = await fetch(`${API_BASE_URL}/diaries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(diaryData)
            });
        }
        
        if (response.ok) {
            showToast(diaryId ? '日记更新成功' : '日记创建成功');
            closeDiaryModal();
            loadDiaries();
        } else {
            const error = await response.json();
            showToast(error.error || '操作失败');
        }
    } catch (error) {
        console.error('保存日记失败:', error);
        showToast('保存日记失败');
    }
}

// 编辑日记
async function editDiary(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/diaries/${id}`);
        const diary = await response.json();
        openDiaryModal(diary);
    } catch (error) {
        console.error('加载日记失败:', error);
        showToast('加载日记失败');
    }
}

// 打开删除模态框
let currentDeleteId = null;
function openDeleteModal(id) {
    currentDeleteId = id;
    const modal = document.getElementById('delete-modal');
    modal.classList.add('show');
}

// 关闭删除模态框
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    currentDeleteId = null;
}

// 确认删除
async function confirmDelete() {
    if (!currentDeleteId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/diaries/${currentDeleteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('日记删除成功');
            closeDeleteModal();
            loadDiaries();
        } else {
            const error = await response.json();
            showToast(error.error || '删除失败');
        }
    } catch (error) {
        console.error('删除日记失败:', error);
        showToast('删除日记失败');
    }
}

// 显示加载动画
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('empty-state').style.display = 'none';
}

// 隐藏加载动画
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// 显示提示信息
function showToast(message) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 添加样式
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 20px';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '1001';
    toast.style.animation = 'slideIn 0.3s ease-out';
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-in reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// 点击模态框外部关闭
window.addEventListener('click', function(e) {
    const diaryModal = document.getElementById('diary-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    if (e.target === diaryModal) {
        closeDiaryModal();
    }
    
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});