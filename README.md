# GoTicket Frontend

GoTicket 是一個模擬真實售票場景的全端練習專案，支援活動瀏覽、票券購買與廠商後台管理。本專案為前端部分，使用 **React + TypeScript + Vite** 打造，搭配 Bootstrap 美化介面。

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
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


