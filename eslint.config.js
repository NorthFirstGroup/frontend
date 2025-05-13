import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default tseslint.config(
    // 全域設定
    {
        ignores: ['dist', 'build', 'node_modules']
    },

    // 主設定
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
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended[0].rules,
            ...pluginReact.configs.flat.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // 覆蓋規則
            'react/react-in-jsx-scope': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            'no-undef': 'error',
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true
                }
            ]
        }
    }
);
