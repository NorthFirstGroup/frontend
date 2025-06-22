import { uploadToS3 } from '@api/uploadApi';
import { useAuth } from '@hooks/useAuth';
import React, { useEffect, useRef, useState } from 'react';
import Icon from '@components/Icon';
import Image from '@assets/icons/image.png';
import Delete from '@assets/icons/delete.png';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const UploadImgWrapper = styled.div`
    border: 1px solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    width: 100%;
    aspect-ratio: 3 / 2;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DeleteIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const WantToUploadImg = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 100%;
    height: 100%;
`;

const UploadedBlock = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
`;
const UploadedBlockCover = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
`;
const UploadedImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

type UploadImgProps = {
    onChange?: (url: string) => void;
    url?: string;
};

export const UploadImg = (props: UploadImgProps) => {
    const { onChange, url } = props;
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && user?.id) {
            const url = await uploadToS3(user.id, selectedFile, false);
            setImageUrl(url);
            if (onChange) onChange(url);
        }
    };
    useEffect(() => {
        if (url) {
            setImageUrl(url);
        }
    }, [url]);

    return (
        <UploadImgWrapper>
            {imageUrl ? (
                <UploadedBlock>
                    <UploadedBlockCover />
                    <UploadedImg src={imageUrl} alt="Uploaded Image" />
                    <DeleteIcon onClick={() => setImageUrl(null)}>
                        <Icon src={Delete} className="m-0" width="14px" />
                    </DeleteIcon>
                </UploadedBlock>
            ) : (
                <WantToUploadImg onClick={handleClick}>
                    <Icon src={Image} width="35px" className="mb-2" />
                    <span className="mb-2">支援 JPG、JPEG、PNG 檔案</span>
                    <Button variant="primary">上傳圖片</Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                </WantToUploadImg>
            )}
        </UploadImgWrapper>
    );
};

export default UploadImg;

// avatarUrl = await uploadToS3(userId, file);
