# GoTicket Frontend

GoTicket 是一個模擬真實售票場景的全端練習專案，支援活動瀏覽、票券購買與廠商後台管理。本專案為前端部分，使用 **React + TypeScript + Vite** 打造，搭配 Bootstrap 美化介面。

## 🚀 技術棧

- **React 19** - 构建使用者界面
- **TypeScript** - 型別安全開發
- **Vite** - 快速的前端開發工具
- **React Router DOM v7** - 路由管理
- **React Hook Form + Yup** - 表單與驗證
- **Bootstrap 5 / React Bootstrap** - UI 框架
- **Axios** - API 串接
- **ESLint + Prettier** - 程式碼風格與格式檢查

---

## 📦 安裝與啟動

### 環境需求

- Node.js >= 18
- 建議使用 [nvm](https://github.com/coreybutler/nvm-windows) 管理 Node 版本

### 安裝步驟

```bash
# 安裝依賴
npm install

# 開發模式啟動
npm run dev

# ESLint 檢查
npm run lint

# 打包建置
npm run build

# 預覽建置結果
npm run preview


# 專案結構
src/
├── assets/        # 靜態資源（圖片、樣式）
├── components/    # 可重用元件
├── contexts/      # React Contexts
├── pages/         # 頁面元件
├── routes/        # 路由設定
├── services/      # API 請求
└── utils/         # 工具函式
