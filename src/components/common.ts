import styled, { css } from 'styled-components';

export const fontStyle = (fontSize: string, lineHeight: string, fontWeight?: string) => css`
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: ${fontWeight || 'normal'};
`;

export const CategoryBadge = styled.span`
    background-color: var(--gt-gray-50);
    padding: 8px 16px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    line-height: 120%;
    width: fit-content;
`;

export const PageTitle = styled.div<{ margin?: string; color?: string }>`
    color: ${({ color }) => color || 'var(--gt-gray-950)'};
    margin: ${({ margin }) => margin || '12px 0 16px 0'};
    font-size: 32px;
    font-weight: 700;
    line-height: 120%;
    display: flex;
    align-items: center;
`;

export const CustomRow = styled.div<{ justify?: string; direction?: string }>`
    display: flex;
    align-items: center;
    justify-content: ${({ justify }) => justify || 'flex-start'};
    flex-direction: ${({ direction }) => direction || 'row'};
`;
