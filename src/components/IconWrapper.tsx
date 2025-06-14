import React, { useState } from 'react';
import './IconWrapper.css'; // Or adjust path to your global CSS file

interface IconWrapperProps {
    children: React.ReactNode; // This will be your icon component
    onClick?: () => void; // Optional click handler for the circle
    className?: string; // Optional for additional custom classes
    size?: number;
    bgColor?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children, onClick, className, size = 40, bgColor = '#FFEDD3' }) => {
    // Dynamically apply styles based on props
    const [isHovered, setIsHovered] = useState(false);
    const wrapperStyles: React.CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: isHovered ? '#ffb96d' : bgColor
    };

    return (
        <div
            className={`icon-background-circle ${className || ''}`}
            onClick={onClick}
            style={wrapperStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </div>
    );
};

export default IconWrapper;
