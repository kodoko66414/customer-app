# 動態菜單點餐系統

這個系統可以根據 URL 參數動態載入不同店家的菜單資料。

## 檔案結構

```
customer/
├── index.html              # React 應用程式入口
├── src/
│   ├── Home.jsx            # React 主組件（保持原本 UI）
│   ├── menuData.js         # 動態菜單載入邏輯
│   └── ...
├── public/
│   └── menus/              # 菜單資料夾
│       ├── store_001.json  # 店家 001 的菜單
│       └── store_002.json  # 店家 002 的菜單
├── menu.html               # 純 HTML 版本（簡潔版）
├── menu.js                 # 純 HTML 版本的 JavaScript
└── README_menu_system.md
```

## 兩種使用方式

### 方式一：React 版本（推薦）
- **檔案**：`index.html` → `src/Home.jsx`
- **特色**：保持原本精美的 UI 設計，包含卡片滑動、音效、動畫等
- **使用**：`npm run dev` 啟動開發伺服器

### 方式二：純 HTML 版本
- **檔案**：`menu.html` + `menu.js`
- **特色**：簡潔的介面，適合快速部署
- **使用**：直接用瀏覽器開啟或使用本地伺服器

## 使用方法

### 1. React 版本
```bash
cd customer
npm run dev
```
然後訪問：
- 預設店家：`http://localhost:5173/`
- 店家 001：`http://localhost:5173/?store=001`
- 店家 002：`http://localhost:5173/?store=002`

### 2. 純 HTML 版本
```bash
cd customer
python -m http.server 8000
```
然後訪問：
- 預設店家：`http://localhost:8000/menu.html`
- 店家 001：`http://localhost:8000/menu.html?store=001`
- 店家 002：`http://localhost:8000/menu.html?store=002`

## 菜單 JSON 格式

每個店家的菜單檔案格式如下：

```json
{
  "storeName": "店家名稱",
  "logo": "logo檔案.png",
  "categories": [
    {
      "name": "分類名稱",
      "items": [
        { "name": "商品名稱", "price": 價格 },
        { "name": "商品名稱", "price": 價格 }
      ]
    }
  ]
}
```

## 功能特色

### React 版本
1. **保持原本 UI**：卡片式介面、滑動動畫、音效
2. **動態載入**：根據 URL 參數載入不同店家菜單
3. **購物車功能**：完整的購物車和訂單系統
4. **Firebase 整合**：訂單自動儲存到資料庫
5. **響應式設計**：完美支援手機和桌面

### 純 HTML 版本
1. **簡潔介面**：快速載入，適合簡單使用
2. **動態載入**：根據 URL 參數載入不同店家菜單
3. **基本購物車**：加入/移除商品，計算總價
4. **輕量級**：無需額外框架

## 新增店家

1. 在 `public/menus/` 資料夾中創建新的 JSON 檔案
2. 檔案命名格式：`store_XXX.json` (XXX 為店家編號)
3. 按照上述 JSON 格式填寫菜單資料
4. 使用 `?store=XXX` 參數來測試

## 測試範例

### React 版本
- 店家 001：`http://localhost:5173/?store=001` (早安厚蛋店)
- 店家 002：`http://localhost:5173/?store=002` (活力早餐店)
- 預設店家：`http://localhost:5173/` (自動載入 001)

### 純 HTML 版本
- 店家 001：`http://localhost:8000/menu.html?store=001` (早安厚蛋店)
- 店家 002：`http://localhost:8000/menu.html?store=002` (活力早餐店)
- 預設店家：`http://localhost:8000/menu.html` (自動載入 001)

## 技術說明

- **React 版本**：使用 `fetch()` API 載入 JSON，保持原本的 React 架構
- **純 HTML 版本**：使用 `fetch()` API 載入 JSON，純 JavaScript 實現
- 支援現代瀏覽器的 ES6+ 語法
- 自動錯誤處理和預設菜單回退機制 