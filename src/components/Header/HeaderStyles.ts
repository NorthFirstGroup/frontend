import styled, { css } from 'styled-components';
import { Navbar, NavDropdown, Button } from 'react-bootstrap';

const buttonBaseCss = css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    font-family: var(--bs-font-sans-serif, 'Noto Sans TC', sans-serif);
    white-space: nowrap;
`;

// 2. buttonLinksCss 必須在 StyledAuthButton 之前定義，並且會繼承 buttonBaseCss
const buttonLinksCss = css<{ $textColor?: string }>`
    ${buttonBaseCss} /* 繼承基礎按鈕樣式 */
    background-color: transparent;
    border: none;
    color: ${props => props.$textColor || 'var(--gt-primary-500, #ff6f0a)'};
    padding: 0;
    min-height: auto;

    &:hover {
        color: var(--gt-primary-700, #cc3b02); // 修正為您 _variables.scss 中的 $primary-700
        text-decoration: none;
    }
`;

export const StyledNavbar = styled(Navbar)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 50px;
    padding: 10px 24px;
    background-color: var(--bs-light, #f8f9fa) !important; /* 使用 Bootstrap 預設的 light 變數 */

    @media (max-width: 991.98px) {
        padding: 8px 10px;
        min-height: 45px;
    }
`;

export const StyledNavDropdown = styled(NavDropdown)`
    margin-left: 1rem;

    @media (max-width: 991.98px) {
        margin-left: 0; // 移除左側邊距，使其能靠左對齊父容器
        width: 100%; // 讓 NavDropdown 本身佔滿寬度
        text-align: center; // 確保 dropdown toggle 在中間
        .dropdown-toggle {
            // 確保 toggle 也是滿寬或居中
            display: block; // 讓 toggle 佔滿一行
            width: 100%;
            padding: 0.75rem 1rem; // 適當的上下 padding
        }
    }

    & > .dropdown-toggle {
        padding: 0.5rem 1rem;
        color: var(--gt-color-text-default, #121212);
        &::after {
            display: none;
        }
        &:hover,
        &:focus {
            color: var(--gt-primary-700, #007bff);
            background-color: var(--gt-color-dropdown-item-hover-background, #e9ecef);
            border-radius: 8px;
        }
    }

    .dropdown-menu {
        min-width: 220px;
        padding: 1rem 0;
        background-color: var(--gt-color-dropdown-menu-background, #ffffff);
        border: 1px solid var(--gt-color-dropdown-menu-border, #e0e0e0);
        border-radius: 12px;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);

        right: 0;
        left: auto !important;

        @media (max-width: 991.98px) {
            left: 0 !important; // 強制從左邊緣開始
            right: 0 !important; // 強制到右邊緣結束，這會讓其佔滿寬度
            transform: none !important; // 移除任何可能導致偏移的 transform

            width: auto; // 讓 left/right 屬性來決定寬度
            max-width: none; // 移除 desktop 的 max-width 限制
            min-width: unset; // 移除 min-width 限制，讓它自由縮放

            // 加入外邊距，讓下拉選單不會緊貼螢幕左右邊緣
            margin-left: 10px;
            margin-right: 10px;

            // 調整圓角，如果需要的話
            border-radius: 8px;
        }
    }
`;

export const StyledNavDropdownItem = styled(NavDropdown.Item)`
    font-size: var(--gt-font-size-xxxxs, 0.875rem); /* 假設下拉項目字體大小 */
    color: var(--gt-color-text-default, #121212);
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    text-decoration: none;

    &:hover {
        /* background-color: var(--gt-color-dropdown-item-hover-background, #e9ecef); */
        color: var(--gt-primary-700, #cc3b02);
        text-decoration: none;
    }

    img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        vertical-align: middle;
    }
`;

// StyledAuthButton 現在應該能正確使用 buttonLinksCss
export const StyledAuthButton = styled(Button)<{ $textColor?: string }>`
    ${buttonLinksCss} /* 應用 button-links 的基礎 */

    background-color: var(--gt-primary-500, #ff6f0a);
    border-color: var(--gt-primary-500, #ff6f0a);
    color: white;
    padding: 0.375rem 1rem;
    font-size: var(--bs-btn-font-size, 1rem);
    border-radius: var(--bs-border-radius, 0.25rem);

    &:hover {
        background-color: var(--gt-primary-700, #cc3b02);
        border-color: var(--gt-primary-700, #cc3b02);
        color: white;
        text-decoration: none;
    }
`;
