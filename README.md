# GoTicket Frontend

GoTicket 是一個模擬真實售票場景的全端練習專案，支援活動瀏覽、票券購買與廠商後台管理。本專案為前端部分，使用 **React +
TypeScript + Vite** 打造，搭配 Bootstrap 美化介面。

## 🚀 技術棧

- **React 19** - 构建使用者界面
- **TypeScript** - 型別安全開發
- **Vite** - 快速的前端開發工具
- **Bootstrap 5 / React Bootstrap** - UI 框架
- **Axios** - API 串接
- **ESLint** - 程式碼風格與一致性檢查

---

## 📦 安裝與啟動

### 環境需求

- Node.js >= 18
- 建議使用 [nvm](https://github.com/coreybutler/nvm-windows) 管理 Node 版本

### 安裝步驟

````bash
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

public/
└── Subtract.png   # icon

src/
├── api/             # API 請求與資料處理
│   ├── authApi.ts     # 用戶驗證相關 API
│   ├── availArea.ts   # 可用區域 API
│   ├── client.ts      # Axios 實例配置
│   ├── profile.ts     # 會員資料 API
│   ├── publicApi.ts   # 不需驗證的 API
│   └── uploadApi.ts   # 圖片上傳 API
│
├── assets/          # 靜態資源（圖片、圖示）
│   └── Vector.png     # GoTicket 文字
│
├── components/      # 共用元件
│   ├── Footer.tsx     # 底部元件
│   ├── GoNavbar.tsx   # 導覽列元件
│   ├── Layout.tsx     # 頁面佈局
│   └── PrivateRoute.tsx # 受保護路由設定
│
├── contexts/        # React Contexts
│   ├── AuthContext.tsx  # 登入狀態管理
│   └── AuthStore.tsx    # 登入狀態處理
│
├── hooks/           # 自定義 Hook
│   ├── userAuth.tsx    # 認證 Hook
│   └── useProfileUpdate.ts # 會員資料更新 Hook
│
├── pages/           # 頁面元件
│   ├── Home.tsx       # 首頁
│   ├── Login.tsx      # 登入頁面
│   ├── Profile.tsx    # 會員中心頁面
│   └── Register.tsx   # 註冊頁面
│
├── routes/          # 路由設定
│   └── AppRoutes.tsx
│
├── types/           # 型別定義
│   └── auth.ts       # 認證型別定義
│
├── utils/           # 工具函式
│
├── App.tsx          # 根元件
├── index.css        # 全域樣式
├── main.tsx         # React 進入點
├── vite-env.d.ts    # Vite 環境定義
├── tsconfig.json    # TypeScript 設定檔
├── .eslintrc.js     # ESLint 設定檔
└── vite.config.ts   # Vite 設定檔


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
````

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for
React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
    plugins: {
        // Add the react-x and react-dom plugins
        'react-x': reactX,
        'react-dom': reactDom
    },
    rules: {
        // other rules...
        // Enable its recommended typescript rules
        ...reactX.configs['recommended-typescript'].rules,
        ...reactDom.configs.recommended.rules
    }
});
```
