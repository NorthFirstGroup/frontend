import React from 'react';
import { toast, ToastOptions } from 'react-hot-toast';

const defaultStyle: React.CSSProperties = {
  maxWidth: 250,
  backgroundColor: '#EA6320', // Default background color
  color: 'white', // Default text color
  borderRadius: '0.25rem',
  padding: '0.75rem 1rem',
};

/**
 * 顯示一個帶有預設樣式的自定義 Toast 通知。
 * @param message 顯示的訊息。
 * @param variant Toast 的類型 ('success', 'error', 'default')。
 * @param options 可選的 react-hot-toast 選項，會覆蓋預設配置。
 */
export const showToast = (
  message: string,
  variant: 'success' | 'error' | 'default' = 'default',
  options?: ToastOptions // 允許額外傳入選項覆蓋預設
) => {
  let customStyle: React.CSSProperties = { ...defaultStyle };

  if (variant === 'success') {
    // Apply success-specific style, if different from defaultStyle
    customStyle = {
      ...defaultStyle, // Start with default styles
      backgroundColor: '#EA6320', // Use your specific success color
      color: 'white',
    };
  } else if (variant === 'error') {
    // Apply error-specific style
    customStyle = {
      ...defaultStyle, // Start with default styles
      backgroundColor: '#dc3545', // Bootstrap danger red
      color: 'white',
    };
  }

  // Merge the custom style with any provided options.style
  // The 'style' property within options will take precedence
  const mergedOptions: ToastOptions = {
    ...options, 
    style: {
      ...customStyle, 
      ...(options?.style || {}), 
    },
  };

  if (variant === 'success') {
    toast.success(message, mergedOptions);
  } else if (variant === 'error') {
    toast.error(message, mergedOptions);
  } else {
    toast(message, mergedOptions);
  }
};

