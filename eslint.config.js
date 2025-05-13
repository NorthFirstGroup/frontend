import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default tseslint.config(
    {
        ignores: ['dist', 'build', 'node_modules']
    },
    // 基本設定（適用所有 .ts / .tsx）
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: true
            },
            globals: globals.browser
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            react: pluginReact,
            'react-hooks': reactHooks
        },
        settings: {
            react: {
                version: 'detect' // 自動偵測 React 版本，避免警告
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended[0].rules,
            ...pluginReact.configs.flat.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            // 覆寫或額外規則
            'react/react-in-jsx-scope': 'off', // React 17+ 不需 import React
            'no-unused-vars': 'off', // 關掉原生 JS 的 unused-vars, 改用 TS 的版本
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ]
        }
    },
    // HMR only: 限制只有 .tsx export component
    {
        files: ['**/*.tsx'],
        plugins: {
            'react-refresh': reactRefresh
        },
        rules: {
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true
                }
            ]
        }
    }
);
