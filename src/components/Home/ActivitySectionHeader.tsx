import React from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import IconWrapper from '../IconWrapper';
import './ActivitySectionHeader.scss';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    iconSvg?: React.ElementType;
    hasMore?: boolean; // 是否顯示「看更多」按鈕
    searchKeyword?: string;
    onViewMoreClick?: () => void; // 「看更多」按鈕的點擊事件
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    iconSvg: IconSvgComponent,
    hasMore = false,
    searchKeyword,
    onViewMoreClick
}) => {
    const renderTitle = () => {
        const titleParts =
            searchKeyword && title.includes(searchKeyword)
                ? title.split(new RegExp(`(${searchKeyword})`, 'gi'))
                : [title]; // Ensure it's always an array for map

        return (
            <h2 className="d-flex text-start mb-0 align-items-center gap-2">
                {titleParts.map((part, index) =>
                    part.toLowerCase() === searchKeyword?.toLowerCase() ? (
                        <span key={index} className="text-primary">
                            {part}
                        </span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
                {IconSvgComponent && (
                    <IconWrapper
                        size={40} // Default size (40px width/height)
                        bgColor="#FFEDD3" // Default background color
                    >
                        {' '}
                        {/* Now IconWrapper handles the background and centering */}
                        <IconSvgComponent size={20} color="#E5540B" /> {/* Pass size/color to the icon itself */}
                    </IconWrapper>
                )}
            </h2>
        );
    };

    return (
        <>
            {renderTitle()}
            {(subtitle || hasMore) && (
                <div className="d-flex justify-content-between align-items-center mt-2">
                    {subtitle && <p className="text-start fs-5 mb-4">{subtitle}</p>}
                    {hasMore && (
                        <Button variant="link" onClick={onViewMoreClick} className="button-text-icon-style">
                            看更多 <FaArrowRight className="icon-arrow" />
                        </Button>
                    )}
                </div>
            )}
        </>
    );
};

export default SectionHeader;
