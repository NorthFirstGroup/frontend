import React from 'react';
import './IconWrapper.css'; // Or adjust path to your global CSS file

interface IconWrapperProps {
    children: React.ReactNode; // This will be your icon component
    onClick?: () => void; // Optional click handler for the circle
    className?: string; // Optional for additional custom classes
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children, onClick, className }) => {
    return (
        <div
            className={`icon-background-circle ${className || ''}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }} // Add pointer if clickable
        >
            {children}
        </div>
    );
};

export default IconWrapper;
