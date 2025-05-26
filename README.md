# GoTicket Frontend

GoTicket 是一個模擬真實售票場景的全端練習專案，支援活動瀏覽、票券購買與廠商後台管理。本專案為前端部分，使用 **React +
TypeScript + Vite** 打造，搭配 Bootstrap 美化介面。

---

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
```

---

## 📂 專案結構

```bash
public/
└── Subtract.png     # icon

src/
├── api/             # API 請求與資料處理
│   ├── authApi.ts     # 用戶驗證相關 API
│   ├── availArea.ts   # 可用區域 API
│   ├── client.ts      # Axios 實例配置
│   ├── profile.ts     # 會員資料 API
│   └── uploadApi.ts   # 圖片上傳 API
│
├── assets/          # 靜態資源（圖片、圖示）
│   └── Vector.png     # GoTicket 文字
│
├── components/      # 共用元件
│   ├── Header/        # 導覽列元件
|   |   ├── GoNavbar.tsx     # 導覽列元件
|   |   ├── Header.module.css # 定義元件內部的特定結構和佈局相關的樣式
|   |   └── HeaderStyles.ts  # 定義可重複使用、基於元件狀態或 props 變化的樣式，帶有特定視覺風格的 UI 元件
│   ├── Footer.tsx     # 底部元件
│   ├── Layout.tsx     # 頁面佈局
│   └── PrivateRoute.tsx # 受保護路由設定
│
├── contexts/        # React Contexts
│   ├── AuthContext.tsx  # 登入狀態管理
│   └── AuthStore.tsx    # 登入狀態處理
│
├── hooks/           # 自定義 Hook
│   ├── useAuth.tsx    # 認證 Hook
│   └── useProfileUpdate.ts # 會員資料更新 Hook
│
├── pages/           # 頁面元件
|   ├── orgazier       # 廠商相關頁面
│   │   ├── Activity.tsx # 活動管理
|   |   ├── Apply.tsx   # 申請成為廠商
|   |   └── ValidateEntry.tsx # 入場資格驗證
│   |
|   ├── user           # 會員相關頁面
|   |   ├── MyOrders.tsx # 我的訂單
|   |   ├── Profile.tsx # 會員資訊
|   |   └── Point.tsx    # 會員點數
│   |
│   ├── Home.tsx       # 首頁
│   ├── Login.tsx      # 登入頁面
│   └── Register.tsx   # 註冊頁面
│
├── routes/          # 路由設定
│   └── AppRoutes.tsx
├── schemas/          # 路由設定
│   └── profile.ts
├── types/           # 型別定義
│   └── auth.ts      # 認證型別定義
│
├── utils/           # 工具函式
│
├── App.tsx          # 根元件
├── main.tsx         # React 進入點
├── vite-env.d.ts    # Vite 環境定義
├── tsconfig.json    # TypeScript 設定檔
├── .eslintrc.js     # ESLint 設定檔
└── vite.config.ts   # Vite 設定檔
```

---

## 📚 結構化的 CSS / SASS 策略

此專案採用一套結構化的 CSS / SASS 策略，旨在提升樣式的模組化、可維護性與開發效率。您可以在下方了解詳細的架構說明。

<details>
  <summary><b>點此展開：CSS / SASS 架構整理說明</b></summary>

<b>1. 全域樣式 (.scss)</b>

目的：定義應用程式的基礎風格、主題色及其他跨元件的通用樣式。

位置：主要入口點為 src/main.scss。此檔案會負責引入其他全域樣式部分，例如：/src/abstract/\_variables.scss：定義全域 CSS 變數。/src/base/\_base.scss：定義基礎 HTML 元素的樣式。內容：

CSS 變數 (Custom Properties)：這是核心。
我們在 :root 選擇器中定義並覆寫 Bootstrap 的預設主題顏色。

例如，--bs-primary 會被設定為我們品牌的主色，確保所有使用 text-primary、btn-primary 等 Bootstrap 類別的元件都能自動套用自訂顏色。

SCSS 範例: /src/abstract/\_variables.scss

```

:root {
  --bs-primary: #FF5733;
  --bs-primary-rgb: 255, 87, 51;
  --bs-gray-950: #1a1a1a;
  --bs-gray-950-rgb: 26, 26, 26;
}

```

// SCSS 範例: /src/base/\_base.scss

```

body { font-family: 'Noto Sans TC', sans-serif; }

```

載入順序：在應用程式的入口點 (src/main.tsx) 中，全域的 main.scss 必須在 Bootstrap 的原始 CSS 之後引入。這能確保我們自訂的 CSS 變數能成功覆蓋 Bootstrap 的預設值。

src/main.tsx

```
// 1. 先引入 Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. 再引入您的全域 SCSS
import './main.scss';

```

<b>2. CSS Modules (.module.css)</b>

目的：定義特定元件的局部樣式，有效避免樣式衝突。

位置：通常與其所屬的 React 元件放在同一資料夾，例如 Header.module.css。

內容：

定義元件內部的結構、佈局相關樣式，以及需要精確控制的細節 (例如 Header 中 Logo 的大小、間距，或搜尋圖示按鈕的樣式重置)。

局部作用域：所有定義在 .module.css 中的類名都會被獨特化 (例如 styles.brand 可能會編譯成 Header_brand\_\_xyz123)，確保這些樣式僅作用於該元件，不會影響到其他元件。

:global() 偽類：當需要針對 Bootstrap 或其他第三方庫的全域類名 (例如 .navbar-toggler、.btn-link) 應用樣式時，可使用 :global() 偽類來突破 CSS Modules 的局部作用域限制。這對於移除預設外框或調整第三方元件的行為非常有用。

<b>3. Styled Components(.ts 或 .tsx)</b>

目的：以 CSS-in-JS 的方式建立可重複使用的 UI 元件，並處理動態樣式。

位置：通常是 src/components/ComponentName/ComponentNameStyles.ts，例如 HeaderStyles.ts。

內容：定義那些本身就是一個獨立視覺元素的 UI 元件樣式 (例如 StyledAuthButton、StyledNavbar 或 StyledNavDropdown)。

基於 Props 的動態樣式：能夠根據元件的 props 或 state 輕鬆地傳遞變數，實現高度動態的樣式變化。

無類名衝突：Styled Components 會自動生成唯一的類名，因此無需擔心類名衝突問題。

提高可讀性與組織性：將元件的樣式直接與元件的定義放在一起，使程式碼更具可讀性並易於維護。總結

<b>結論</b>

透過同時使用這三種 CSS 策略，我們能夠：

全域控制：透過全域 SCSS 檔案定義主題和基礎樣式。局部隔離：使用 CSS
Modules 確保元件樣式的獨立性，避免衝突。彈性與可重用性：利用 Styled
Components 建立可配置、動態的 UI 元件。這種混合式的方法讓我們在樣式管理上擁有高度的靈活性和精確的控制力，同時保持程式碼的清晰和可維護性。

</details>



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
