import styled from 'styled-components';

export const IconStyle = styled.img<{ width?: string; onClick?: () => void }>`
    width: ${({ width }) => width || '18px'};
    height: auto;
    margin-right: 8px;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

type IconProps = {
    src: string;
    width?: string;
    height?: string;
    alt?: string;
    className?: string;
    onClick?: () => void;
};

const Icon = (props: IconProps) => {
    const { src, width, height, alt, className, onClick } = props;
    return <IconStyle src={src} width={width} height={height} alt={alt} className={className} onClick={onClick} />;
};

export default Icon;
