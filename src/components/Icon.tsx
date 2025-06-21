import styled from 'styled-components';

export const IconStyle = styled.img<{ width?: string; onClick?: () => void; margin?: string }>`
    width: ${({ width }) => width || '18px'};
    height: ${({ height }) => height || 'auto'};
    margin: ${({ margin }) => margin || '0 8px 0 0'};
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

type IconProps = {
    src: string;
    width?: string;
    height?: string;
    alt?: string;
    className?: string;
    onClick?: () => void;
    type?: 'svg' | 'png' | 'jpg';
    margin?: string;
};

const Icon = (props: IconProps) => {
    const { src, width, height, alt, className, onClick, type, margin } = props;
    if (type === 'svg') {
        return (
            <svg
                className="icon"
                width={width}
                height={height || width}
                viewBox={`0 0 16 16`}
                preserveAspectRatio="xMidYMid meet"
            >
                <path d={src} />
            </svg>
        );
    }

    return (
        <IconStyle
            src={src}
            width={width}
            height={height}
            alt={alt}
            className={`${className} icon`}
            onClick={onClick}
            margin={margin}
        />
    );
};

export default Icon;
