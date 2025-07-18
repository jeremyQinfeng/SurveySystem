# 動態表單系統 API 使用指南

## 📋 API 概覽

本 API 提供完整的動態表單系統管理功能，包括用戶管理和表單結構管理，支援創建、查詢、更新、刪除等操作。

**基礎 URL**: 
- 表單結構: `http://localhost:5000/api/forms`
- 用戶管理: `http://localhost:5000/api/users`
- 表單提交: `http://localhost:5000/api/submissions`
- 統計數據: `http://localhost:5000/api/submissions/statistics`

**響應格式**: 所有 API 都使用統一的 JSON 響應格式：
```json
{
  "success": true/false,
  "message": "操作結果描述",
  "data": { /* 實際數據 */ },
  "errors": [ /* 錯誤詳情 (僅在失敗時) */ ]
}
```

---

## 👥 用戶管理 API

### 1. 創建用戶

**端點**: `POST /api/users`

**描述**: 創建新的用戶帳號

**請求體**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "role": "publisher",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "organization": "Example Corp",
    "bio": "我是一個表單設計師"
  },
  "preferences": {
    "language": "zh-CN",
    "timezone": "Asia/Shanghai",
    "emailNotifications": true
  }
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "用戶創建成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "publisher",
    "isActive": true,
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "organization": "Example Corp",
      "bio": "我是一個表單設計師"
    },
    "preferences": {
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "emailNotifications": true
    },
    "fullName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. 獲取用戶列表

**端點**: `GET /api/users`

**描述**: 獲取用戶列表，支援分頁、篩選和搜尋

**查詢參數**:
- `page` (可選): 頁數，預設 1
- `limit` (可選): 每頁數量，預設 10，最大 100
- `role` (可選): 篩選角色，`publisher` 或 `admin`
- `isActive` (可選): 篩選活躍狀態，`true` 或 `false`
- `search` (可選): 搜尋關鍵字，搜尋用戶名、郵箱、姓名等

**請求示例**:
```
GET /api/users?page=1&limit=10&role=publisher&search=john
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取用戶列表成功",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "publisher",
        "isActive": true,
        "profile": {
          "firstName": "John",
          "lastName": "Doe",
          "organization": "Example Corp"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

---

### 3. 獲取特定用戶

**端點**: `GET /api/users/:userId`

**描述**: 根據用戶 ID 獲取特定用戶的詳細信息

**路徑參數**:
- `userId`: 用戶的 MongoDB ObjectId

**請求示例**:
```
GET /api/users/507f1f77bcf86cd799439011
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取用戶資料成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "publisher",
    "isActive": true,
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "organization": "Example Corp",
      "bio": "我是一個表單設計師"
    },
    "preferences": {
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "emailNotifications": true
    },
    "fullName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. 更新用戶資料

**端點**: `PUT /api/users/:userId`

**描述**: 更新現有用戶的資料

**路徑參數**:
- `userId`: 用戶的 MongoDB ObjectId

**請求體** (所有欄位都是可選的):
```json
{
  "username": "john_updated",
  "email": "john.updated@example.com",
  "role": "admin",
  "profile": {
    "firstName": "John Updated",
    "lastName": "Doe",
    "organization": "New Company",
    "bio": "更新後的個人簡介"
  },
  "preferences": {
    "language": "en-US",
    "emailNotifications": false
  }
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "用戶資料更新成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "profile": {
      "firstName": "John Updated",
      "lastName": "Doe",
      "organization": "New Company",
      "bio": "更新後的個人簡介"
    },
    "preferences": {
      "language": "en-US",
      "emailNotifications": false
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 5. 刪除用戶

**端點**: `DELETE /api/users/:userId`

**描述**: 刪除指定的用戶帳號

**路徑參數**:
- `userId`: 用戶的 MongoDB ObjectId

**請求示例**:
```
DELETE /api/users/507f1f77bcf86cd799439011
```

**響應示例**:
```json
{
  "success": true,
  "message": "用戶刪除成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### 6. 切換用戶狀態

**端點**: `PATCH /api/users/:userId/status`

**描述**: 切換用戶的啟用/停用狀態

**路徑參數**:
- `userId`: 用戶的 MongoDB ObjectId

**請求示例**:
```
PATCH /api/users/507f1f77bcf86cd799439011/status
```

**響應示例**:
```json
{
  "success": true,
  "message": "用戶已停用",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "isActive": false,
    "updatedAt": "2024-01-15T11:15:00.000Z"
  }
}
```

---

### 7. 獲取用戶統計

**端點**: `GET /api/users/stats`

**描述**: 獲取用戶統計資訊和最近用戶

**請求示例**:
```
GET /api/users/stats
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取用戶統計成功",
  "data": {
    "statistics": {
      "totalUsers": 150,
      "activeUsers": 120,
      "inactiveUsers": 30,
      "publishers": 140,
      "admins": 10
    },
    "recentUsers": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "publisher",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

## 📝 表單結構管理 API

### 1. 創建表單結構

**端點**: `POST /api/forms/structure`

**描述**: 創建新的表單結構

**請求體**:
```json
{
  "title": "用户体验调研问卷",
  "description": "帮助我们了解您的使用体验和需求",
  "questions": [
    {
      "id": "name",
      "type": "text",
      "title": "请输入您的姓名",
      "placeholder": "例如：张三",
      "required": true
    },
    {
      "id": "age_group",
      "type": "single-choice",
      "title": "请选择您的年龄段",
      "required": true,
      "options": [
        { "value": "18-25", "label": "18-25岁" },
        { "value": "26-35", "label": "26-35岁" },
        { "value": "36-45", "label": "36-45岁" }
      ]
    },
    {
      "id": "satisfaction",
      "type": "rating",
      "title": "您对我们产品的整体满意度如何？",
      "description": "请给出1-5分的评价",
      "required": true,
      "max": 5,
      "minLabel": "非常不满意",
      "maxLabel": "非常满意"
    }
  ],
  "settings": {
    "allowAnonymous": true,
    "requireCaptcha": false,
    "active": true,
    "maxSubmissions": 1000
  }
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單結構創建成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "publisherId": "507f1f77bcf86cd799439011",
    "title": "用户体验调研问卷",
    "description": "帮助我们了解您的使用体验和需求",
    "questions": [...],
    "settings": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. 獲取所有表單結構

**端點**: `GET /api/forms/structure`

**描述**: 獲取所有表單結構，支援分頁和篩選

**查詢參數**:
- `page` (可選): 頁數，預設 1
- `limit` (可選): 每頁數量，預設 10，最大 100
- `active` (可選): 篩選啟用狀態，`true` 或 `false`
- `publisherId` (可選): 篩選特定發布者的表單

**請求示例**:
```
GET /api/forms/structure?page=1&limit=5&active=true
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取表單結構成功",
  "data": {
    "forms": [
      {
        "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
        "title": "用户体验调研问卷",
        "publisherId": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "settings": {
          "active": true
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 15,
      "itemsPerPage": 5
    }
  }
}
```

---

### 3. 獲取特定表單結構

**端點**: `GET /api/forms/structure/:formId`
http://192.168.68.150:5000/api/forms/structure/pingf0204bf3-4565-4afb-8029-6c6fbfb29fab

**描述**: 根據 formId 獲取特定表單結構的詳細信息

**路徑參數**:
- `formId`: 表單的唯一識別碼 (UUID 格式)

**請求示例**:
```
GET /api/forms/structure/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取表單結構成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "publisherId": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "title": "用户体验调研问卷",
    "description": "帮助我们了解您的使用体验和需求",
    "questions": [
      {
        "id": "name",
        "type": "text",
        "title": "请输入您的姓名",
        "placeholder": "例如：张三",
        "required": true
      }
    ],
    "settings": {
      "allowAnonymous": true,
      "requireCaptcha": false,
      "active": true,
      "maxSubmissions": 1000
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. 更新表單結構

**端點**: `PUT /api/forms/structure/:formId`

**描述**: 更新現有表單結構

**路徑參數**:
- `formId`: 表單的唯一識別碼

**請求體** (所有欄位都是可選的):
```json
{
  "title": "用户体验调研问卷 (已更新)",
  "description": "這是更新後的描述",
  "questions": [
    {
      "id": "updated_question",
      "type": "textarea",
      "title": "新增的問題",
      "required": false
    }
  ],
  "settings": {
    "active": false
  }
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單結構更新成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "title": "用户体验调研问卷 (已更新)",
    "description": "這是更新後的描述",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 5. 刪除表單結構

**端點**: `DELETE /api/forms/structure/:formId`

**描述**: 刪除指定的表單結構

**路徑參數**:
- `formId`: 表單的唯一識別碼

**請求示例**:
```
DELETE /api/forms/structure/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單結構刪除成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "title": "用户体验调研问卷"
  }
}
```

---

### 6. 切換表單狀態

**端點**: `PATCH /api/forms/structure/:formId/toggle`

**描述**: 切換表單的啟用/停用狀態

**路徑參數**:
- `formId`: 表單的唯一識別碼

**請求示例**:
```
PATCH /api/forms/structure/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9/toggle
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單已停用",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "settings": {
      "active": false
    },
    "updatedAt": "2024-01-15T11:15:00.000Z"
  }
}
```

---

### 7. 複製表單結構

**端點**: `POST /api/forms/structure/:formId/duplicate`

**描述**: 複製現有表單結構創建新表單

**路徑參數**:
- `formId`: 要複製的表單識別碼

**請求體** (可選):
```json
{
  "title": "用户体验调研问卷 (副本)",
  "publisherId": "507f1f77bcf86cd799439012"
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單結構複製成功",
  "data": {
    "formId": "f0204bf3-4565-4afb-8029-6c6fbfb29fab",
    "title": "用户体验调研问卷 (副本)",
    "publisherId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

## 📋 表單提交管理 API

### 1. 創建表單提交

**端點**: `POST /api/submissions`

**描述**: 提交表單資料，系統會根據對應的表單結構進行驗證

**請求體**:
```json
{
  "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
  "submissionData": {
    "name": "張三",
    "email": "zhang@example.com",
    "age": 25,
    "country": "tw"
  },
  "completionTime": 120,
  "submitterInfo": {
    "name": "張三",
    "email": "zhang@example.com"
  }
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "表單提交成功",
  "data": {
    "submissionId": "sub_1642234567890_abc123def",
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "validationStatus": "valid"
  }
}
```

**驗證錯誤響應**:
```json
{
  "success": false,
  "message": "表單資料驗證失敗",
  "errors": [
    {
      "field": "name",
      "message": "姓名 長度不能少於 2 字元",
      "code": "FIELD_VALIDATION_ERROR"
    },
    {
      "field": "email",
      "message": "電子郵件 電子郵件格式不正確",
      "code": "FIELD_VALIDATION_ERROR"
    }
  ]
}
```

---

### 2. 獲取所有提交記錄

**端點**: `GET /api/submissions`

**描述**: 獲取所有表單提交記錄，支援分頁和篩選

**查詢參數**:
- `page` (可選): 頁數，預設 1
- `limit` (可選): 每頁數量，預設 10，最大 100
- `formId` (可選): 篩選特定表單的提交
- `startDate` (可選): 開始日期 (ISO 8601 格式)
- `endDate` (可選): 結束日期 (ISO 8601 格式)
- `isComplete` (可選): 篩選完成狀態，`true` 或 `false`
- `validationStatus` (可選): 篩選驗證狀態，`valid`, `invalid`, `pending`

**請求示例**:
```
GET /api/submissions?page=1&limit=10&formId=68dbc98a-4a2a-4a32-9b10-7dc83f428ea9&validationStatus=valid
```

**響應示例**:
```json
{
  "success": true,
  "message": "查詢提交記錄成功",
  "data": {
    "submissions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "submissionId": "sub_1642234567890_abc123def",
        "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
        "submittedAt": "2024-01-15T10:30:00.000Z",
        "validationStatus": "valid",
        "isComplete": true,
        "submitterInfo": {
          "name": "張三",
          "email": "zhang@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 3. 獲取單一提交記錄

**端點**: `GET /api/submissions/:id`

**描述**: 根據提交 ID 獲取特定提交記錄的詳細信息

**路徑參數**:
- `id`: 提交記錄的 MongoDB ObjectId

**請求示例**:
```
GET /api/submissions/507f1f77bcf86cd799439011
```

**響應示例**:
```json
{
  "success": true,
  "message": "查詢提交記錄成功",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "submissionId": "sub_1642234567890_abc123def",
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "submissionData": {
      "name": "張三",
      "email": "zhang@example.com",
      "age": 25,
      "country": "tw"
    },
    "completionTime": 120,
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "validationStatus": "valid",
    "isComplete": true,
    "submitterInfo": {
      "name": "張三",
      "email": "zhang@example.com"
    }
  }
}
```

---

### 4. 獲取特定表單的提交記錄

**端點**: `GET /api/submissions/form/:formId`

**描述**: 獲取特定表單的所有提交記錄

**路徑參數**:
- `formId`: 表單的唯一識別碼

**查詢參數**:
- `page` (可選): 頁數，預設 1
- `limit` (可選): 每頁數量，預設 10
- `startDate` (可選): 開始日期
- `endDate` (可選): 結束日期
- `isComplete` (可選): 完成狀態
- `validationStatus` (可選): 驗證狀態

**請求示例**:
```
GET /api/submissions/form/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9?page=1&limit=10
```

**響應示例**:
```json
{
  "success": true,
  "message": "查詢表單提交記錄成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "submissions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "submissionId": "sub_1642234567890_abc123def",
        "submissionData": {
          "name": "張三",
          "email": "zhang@example.com"
        },
        "submittedAt": "2024-01-15T10:30:00.000Z",
        "validationStatus": "valid"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 5. 獲取表單統計資料

**端點**: `GET /api/submissions/stats/:formId`

**描述**: 獲取特定表單的提交統計資料

**路徑參數**:
- `formId`: 表單的唯一識別碼

**請求示例**:
```
GET /api/submissions/stats/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9
```

**響應示例**:
```json
{
  "success": true,
  "message": "查詢提交統計資料成功",
  "data": {
    "_id": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "totalSubmissions": 156,
    "completedSubmissions": 142,
    "validSubmissions": 138,
    "averageCompletionTime": 95.5,
    "firstSubmission": "2024-01-01T08:00:00.000Z",
    "lastSubmission": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 6. 更新提交狀態

**端點**: `PATCH /api/submissions/:id/status`

**描述**: 更新提交記錄的驗證狀態或完成狀態

**路徑參數**:
- `id`: 提交記錄的 MongoDB ObjectId

**請求體**:
```json
{
  "validationStatus": "valid",
  "isComplete": true
}
```

**響應示例**:
```json
{
  "success": true,
  "message": "提交記錄狀態更新成功",
  "data": {
    "submissionId": "sub_1642234567890_abc123def",
    "validationStatus": "valid",
    "isComplete": true,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 7. 刪除提交記錄

**端點**: `DELETE /api/submissions/:id`

**描述**: 刪除指定的提交記錄

**路徑參數**:
- `id`: 提交記錄的 MongoDB ObjectId

**請求示例**:
```
DELETE /api/submissions/507f1f77bcf86cd799439011
```

**響應示例**:
```json
{
  "success": true,
  "message": "提交記錄刪除成功",
  "data": {
    "deletedSubmissionId": "sub_1642234567890_abc123def",
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9"
  }
}
```

---

## 📊 表單統計分析 API

### 1. 獲取特定表單統計

**端點**: `GET /api/submissions/statistics/:formId`

**描述**: 獲取特定表單的詳細統計數據，包括提交數量、平均完成時間、問題統計等

**路徑參數**:
- `formId`: 表單的唯一識別碼

**查詢參數**:
- `days` (可選): 獲取最近N天的統計數據，默認30天

**請求示例**:
```
GET /api/submissions/statistics/68dbc98a-4a2a-4a32-9b10-7dc83f428ea9?days=30
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取表單統計成功",
  "data": {
    "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
    "publisher": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "overview": {
      "totalSubmissions": 150,
      "totalViews": 500,
      "completionRate": 30,
      "averageCompletionTime": 120,
      "lastSubmissionAt": "2024-01-15T10:30:00Z"
    },
    "recentSubmissions": [
      {
        "date": "2024-01-15T00:00:00Z",
        "count": 5
      },
      {
        "date": "2024-01-14T00:00:00Z",
        "count": 8
      }
    ],
    "questionStats": [
      {
        "questionId": "q1",
        "totalAnswers": 150,
        "popularAnswers": [
          {
            "answer": "選項A",
            "count": 80
          },
          {
            "answer": "選項B",
            "count": 70
          }
        ],
        "averageLength": 12
      }
    ],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. 獲取所有表單統計概覽

**端點**: `GET /api/submissions/statistics`

**描述**: 獲取所有表單的統計概覽，支援分頁和按發布者篩選

**查詢參數**:
- `publisherId` (可選): 按發布者篩選
- `page` (可選): 頁碼，默認1
- `limit` (可選): 每頁數量，默認10

**請求示例**:
```
GET /api/submissions/statistics?publisherId=507f1f77bcf86cd799439011&page=1&limit=10
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取統計概覽成功",
  "data": {
    "statistics": [
      {
        "_id": "6879f7404a1983bad2a65297",
        "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
        "publisherId": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "totalSubmissions": 150,
        "totalViews": 500,
        "completionRate": 30,
        "averageCompletionTime": 120,
        "lastSubmissionAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

### 3. 獲取最活躍表單統計

**端點**: `GET /api/submissions/statistics/most-active`

**描述**: 獲取最活躍表單的統計數據，按提交數量排序

**查詢參數**:
- `limit` (可選): 返回數量，默認10

**請求示例**:
```
GET /api/submissions/statistics/most-active?limit=5
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取最活躍表單成功",
  "data": {
    "mostActiveForms": [
      {
        "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
        "publisher": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "totalSubmissions": 250,
        "totalViews": 800,
        "completionRate": 31.25,
        "averageCompletionTime": 95,
        "lastSubmissionAt": "2024-01-15T10:30:00Z"
      },
      {
        "formId": "f0204bf3-4565-4afb-8029-6c6fbfb29fab",
        "publisher": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "jane_smith",
          "email": "jane@example.com"
        },
        "totalSubmissions": 180,
        "totalViews": 600,
        "completionRate": 30,
        "averageCompletionTime": 110,
        "lastSubmissionAt": "2024-01-14T15:20:00Z"
      }
    ]
  }
}
```

---

### 4. 獲取發布者統計數據

**端點**: `GET /api/submissions/statistics/publisher/:publisherId`

**描述**: 獲取特定發布者的所有表單統計數據和總體統計

**路徑參數**:
- `publisherId`: 發布者的 MongoDB ObjectId

**請求示例**:
```
GET /api/submissions/statistics/publisher/507f1f77bcf86cd799439011
```

**響應示例**:
```json
{
  "success": true,
  "message": "獲取發布者統計成功",
  "data": {
    "publisherId": "507f1f77bcf86cd799439011",
    "publisher": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "overview": {
      "totalForms": 5,
      "totalSubmissions": 850,
      "totalViews": 2500,
      "averageCompletionRate": "32.50"
    },
    "formStats": [
      {
        "formId": "68dbc98a-4a2a-4a32-9b10-7dc83f428ea9",
        "totalSubmissions": 250,
        "totalViews": 800,
        "completionRate": 31.25,
        "averageCompletionTime": 95,
        "lastSubmissionAt": "2024-01-15T10:30:00Z"
      },
      {
        "formId": "f0204bf3-4565-4afb-8029-6c6fbfb29fab",
        "totalSubmissions": 180,
        "totalViews": 600,
        "completionRate": 30,
        "averageCompletionTime": 110,
        "lastSubmissionAt": "2024-01-14T15:20:00Z"
      }
    ]
  }
}
```

---

## 🔄 統計系統自動化流程

### 自動統計更新

本系統實現了完全自動化的統計追蹤：

1. **表單創建時自動初始化統計**
   - 當通過 `POST /api/forms/structure` 創建表單時
   - 系統自動在 FormStatistic collection 中建立對應的統計記錄
   - 初始化所有統計字段為 0 或空值

2. **表單提交時自動更新統計**
   - 當通過 `POST /api/submissions` 提交表單時
   - 系統自動更新對應的統計數據
   - 更新項目包括：總提交數、平均完成時間、每日提交統計、問題統計等

3. **實時統計數據**
   - 所有統計 API 返回實時數據
   - 支援多維度數據分析
   - 提供詳細的問題級別統計

### 統計數據維度

| 統計類型 | 說明 | 範例 |
|----------|------|------|
| 基礎統計 | 總提交數、總瀏覽數、完成率 | `totalSubmissions: 150` |
| 時間統計 | 平均完成時間、最後提交時間 | `averageCompletionTime: 120` |
| 趨勢統計 | 每日提交趨勢 | `submissionsByDay: [{date, count}]` |
| 問題統計 | 問題回答分析、熱門答案 | `questionStats: [{questionId, totalAnswers, popularAnswers}]` |

---

## 🔗 表單結構與提交驗證連接

### 驗證流程

當用戶提交表單時，系統會自動執行以下驗證流程：

1. **表單存在性檢查**: 驗證 `formId` 是否對應有效的表單結構
2. **表單狀態檢查**: 確認表單處於啟用狀態 (`settings.active = true`)
3. **必填欄位驗證**: 檢查所有標記為 `required: true` 的欄位是否已填寫
4. **資料類型驗證**: 根據問題類型驗證資料格式
5. **驗證規則應用**: 應用表單結構中定義的驗證規則
6. **選項有效性檢查**: 對於選擇類型問題，檢查選項是否在允許範圍內

### 支援的驗證規則

| 欄位類型 | 驗證項目 | 說明 |
|----------|----------|------|
| `text` | 長度限制 | `validation.minLength`, `validation.maxLength` |
| `textarea` | 長度限制 | `validation.minLength`, `validation.maxLength` |
| `number` | 數值範圍 | `validation.min`, `validation.max` |
| `email` | 格式驗證 | 標準電子郵件格式 |
| `select` | 選項驗證 | 必須在 `options` 陣列中 |
| `radio` | 選項驗證 | 必須在 `options` 陣列中 |
| `checkbox` | 選項驗證 | 所有選項必須在 `options` 陣列中 |
| `rating` | 範圍驗證 | 1 到 `max` 之間的整數 |
| `date` | 格式驗證 | 有效的日期格式 |

### 驗證錯誤代碼

| 錯誤代碼 | 說明 |
|----------|------|
| `FORM_INACTIVE` | 表單已停用 |
| `REQUIRED_FIELD_MISSING` | 必填欄位缺失 |
| `FIELD_NOT_FOUND` | 欄位在表單結構中不存在 |
| `FIELD_VALIDATION_ERROR` | 欄位驗證失敗 |

---

## 📝 支援的問題類型

| 類型 | 描述 | 必需欄位 | 可選欄位 |
|------|------|----------|----------|
| `text` | 單行文字輸入 | `id`, `type`, `title` | `placeholder`, `required`, `validation` |
| `textarea` | 多行文字輸入 | `id`, `type`, `title` | `placeholder`, `required`, `validation` |
| `number` | 數字輸入 | `id`, `type`, `title` | `required`, `validation` |
| `email` | 電子郵件輸入 | `id`, `type`, `title` | `placeholder`, `required` |
| `select` | 下拉選單 | `id`, `type`, `title`, `options` | `required` |
| `radio` | 單選按鈕 | `id`, `type`, `title`, `options` | `required` |
| `checkbox` | 複選框 | `id`, `type`, `title`, `options` | `required` |
| `single-choice` | 單選 (新格式) | `id`, `type`, `title`, `options` | `required` |
| `multiple-choice` | 多選 (新格式) | `id`, `type`, `title`, `options` | `required` |
| `rating` | 評分 | `id`, `type`, `title`, `max` | `required`, `minLabel`, `maxLabel` |
| `file` | 檔案上傳 | `id`, `type`, `title` | `required` |
| `date` | 日期選擇 | `id`, `type`, `title` | `required` |

---

## ⚠️ 錯誤處理

### 常見錯誤狀態碼

- **400 Bad Request**: 請求驗證失敗
- **404 Not Found**: 找不到指定的表單
- **500 Internal Server Error**: 伺服器內部錯誤

### 錯誤響應格式

```json
{
  "success": false,
  "message": "輸入驗證失敗",
  "errors": [
    {
      "field": "title",
      "message": "表單標題不能為空",
      "value": ""
    },
    {
      "field": "questions",
      "message": "表單必須至少包含一個問題",
      "value": []
    }
  ]
}
```

---

## 🔧 測試建議

### 使用 cURL 測試

#### 用戶管理 API
```bash
# 創建用戶
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "role": "publisher",
    "profile": {
      "firstName": "Test",
      "lastName": "User"
    }
  }'

# 獲取用戶列表
curl -X GET "http://localhost:5000/api/users?page=1&limit=10"

# 獲取特定用戶
curl -X GET http://localhost:5000/api/users/YOUR_USER_ID

# 更新用戶
curl -X PUT http://localhost:5000/api/users/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"username": "updateduser"}'

# 刪除用戶
curl -X DELETE http://localhost:5000/api/users/YOUR_USER_ID

# 獲取用戶統計
curl -X GET http://localhost:5000/api/users/stats
```

#### 表單結構 API
```bash
# 創建表單
curl -X POST http://localhost:5000/api/forms/structure \
  -H "Content-Type: application/json" \
  -d @test-form-data.json

# 獲取所有表單
curl -X GET "http://localhost:5000/api/forms/structure?page=1&limit=10"

# 獲取特定表單
curl -X GET http://localhost:5000/api/forms/structure/YOUR_FORM_ID

# 更新表單
curl -X PUT http://localhost:5000/api/forms/structure/YOUR_FORM_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# 刪除表單
curl -X DELETE http://localhost:5000/api/forms/structure/YOUR_FORM_ID
```

#### 表單提交 API
```bash
# 創建提交
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "YOUR_FORM_ID",
    "submissionData": {
      "name": "張三",
      "email": "zhang@example.com",
      "age": 25,
      "country": "tw"
    },
    "completionTime": 120,
    "submitterInfo": {
      "name": "張三",
      "email": "zhang@example.com"
    }
  }'

# 獲取所有提交記錄
curl -X GET "http://localhost:5000/api/submissions?page=1&limit=10"

# 獲取特定表單的提交記錄
curl -X GET "http://localhost:5000/api/submissions/form/YOUR_FORM_ID"

# 獲取特定提交記錄
curl -X GET http://localhost:5000/api/submissions/YOUR_SUBMISSION_ID

# 獲取表單統計
curl -X GET http://localhost:5000/api/submissions/stats/YOUR_FORM_ID

# 更新提交狀態
curl -X PATCH http://localhost:5000/api/submissions/YOUR_SUBMISSION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"validationStatus": "valid", "isComplete": true}'

# 刪除提交記錄
curl -X DELETE http://localhost:5000/api/submissions/YOUR_SUBMISSION_ID
```

#### 統計分析 API
```bash
# 獲取特定表單統計
curl -X GET "http://localhost:5000/api/submissions/statistics/YOUR_FORM_ID?days=30"

# 獲取所有表單統計概覽
curl -X GET "http://localhost:5000/api/submissions/statistics?page=1&limit=10"

# 獲取最活躍表單統計
curl -X GET "http://localhost:5000/api/submissions/statistics/most-active?limit=5"

# 獲取發布者統計數據
curl -X GET http://localhost:5000/api/submissions/statistics/publisher/YOUR_PUBLISHER_ID
```

### 使用 Postman 測試

1. 導入 API 端點到 Postman
2. 設定環境變數 `baseUrl = http://localhost:5000`
3. 使用提供的 JSON 範例進行測試

---

## 📚 注意事項

### 用戶管理
1. **用戶名格式**: 3-50 字元，只能包含字母、數字、底線和連字符
2. **郵箱唯一性**: 每個郵箱地址只能註冊一個帳號
3. **角色管理**: 支援 `publisher` 和 `admin` 兩種角色
4. **簡化設計**: 無認證機制，專注於基本 CRUD 功能
5. **搜尋功能**: 支援用戶名、郵箱、姓名、組織等多欄位搜尋

### 表單結構管理
1. **formId 格式**: 系統自動生成 UUID 格式的 formId
2. **publisherId**: 關聯到用戶系統，支援 populate 查詢
3. **驗證規則**: 所有輸入都會進行嚴格的驗證
4. **分頁限制**: 單次查詢最多返回 100 筆記錄
5. **問題 ID 唯一性**: 同一表單內的問題 ID 必須唯一

### 表單提交管理
1. **驗證機制**: 提交資料會根據表單結構進行嚴格驗證
2. **自動ID生成**: 系統自動生成唯一的 submissionId
3. **狀態管理**: 支援 valid/invalid/pending 三種驗證狀態
4. **統計功能**: 提供完整的提交統計和分析資料
5. **分頁查詢**: 支援按表單、日期、狀態等條件篩選

### 系統整合
1. **關聯查詢**: 表單結構可以關聯到用戶資料
2. **統一響應**: 所有 API 使用相同的響應格式
3. **錯誤處理**: 提供詳細的錯誤信息和狀態碼
4. **驗證連接**: FormStructure 與 Submission 完整整合
5. **自動統計**: 表單創建和提交時自動更新統計數據

---

## 🚀 快速開始

1. 啟動服務器: `npm start`
2. 使用提供的測試腳本: 
   - `node test-api.js` - 基本 API 測試
   - `node test-api-validation.js` - 表單驗證連接測試
   - `node test-form-statistics.js` - 統計系統測試
3. 參考 API 文檔進行開發

### 驗證連接測試

使用 `test-api-validation.js` 可以測試 FormStructure 與 Submission 的驗證連接：

```bash
# 啟動服務器
node server.js

# 在另一個終端執行驗證測試
node test-api-validation.js
```

這個測試會：
1. 創建包含不同驗證規則的表單結構
2. 測試有效提交資料
3. 測試各種無效提交場景
4. 確認驗證錯誤正確返回

### 統計系統測試

使用 `test-form-statistics.js` 可以測試 FormStatistic 自動化統計系統：

```bash
# 啟動服務器
node server.js

# 在另一個終端執行統計測試
node test-form-statistics.js
```

這個測試會：
1. 創建測試表單並驗證統計記錄自動初始化
2. 提交多個測試數據並驗證統計數據自動更新
3. 測試所有統計 API 端點
4. 驗證問題統計和熱門答案統計功能
5. 確認統計數據的實時更新和準確性

更多詳細信息請參考 [實現邏輯文檔](Implementation-Logic.md) 和 [統計系統文檔](FORM-STATISTICS-README.md)。 