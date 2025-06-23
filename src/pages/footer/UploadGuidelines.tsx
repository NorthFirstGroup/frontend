import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const UploadGuidelines: React.FC = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <h2 className="text-primary mb-4 text-center">GoTicket 廠商活動上架規範</h2>
                    <p className="lead text-muted text-center mb-5">
                        為確保 GoTicket
                        平台活動內容的品質與合法性，並保障主辦單位與購票消費者的權益，請所有廠商在上架活動前，務必詳閱並遵守以下規範。
                    </p>

                    <h3 className="text-primary mb-3">一、基本原則</h3>
                    <ul>
                        <li>
                            <strong>合法性：</strong> 所有上架活動內容必須符合中華民國相關法令規定。
                        </li>
                        <li>
                            <strong>真實性：</strong> 活動資訊必須真實、準確，不得有虛假、誇大或誤導性內容。
                        </li>
                        <li>
                            <strong>完整性：</strong> 活動資訊應提供足夠細節，確保消費者能充分了解活動內容。
                        </li>
                        <li>
                            <strong>平台適用性：</strong> GoTicket
                            平台主要為售票服務，所有活動應與票務相關。嚴禁上架與票務無關或非法的活動內容。
                        </li>
                    </ul>

                    <h3 className="text-primary mb-3 mt-4">二、活動資訊規範</h3>
                    <p>請確保您的活動資訊符合以下要求：</p>
                    <ol>
                        <li>
                            <strong>活動名稱：</strong>
                            <ul>
                                <li>應簡潔明確，直接反映活動主題。</li>
                                <li>禁止包含過多符號、表情符號、促銷訊息、網址或重複關鍵字以增加曝光。</li>
                                <li>禁止使用無識別度或獨特性的名稱。</li>
                                <li>若為系列活動，請善用票種區分場次，勿上架多個相同/相似活動頁。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>活動圖片 (Banner/主視覺)：</strong>
                            <ul>
                                <li>圖片需清晰、具吸引力，且與活動內容高度相關。</li>
                                <li>解析度建議為 72dpi 以上，檔案格式為 JPEG、PNG 或 GIF。</li>
                                <li>禁止含有腥羶色、血腥暴力、非法直銷、非法博弈或任何違法及易引起用戶疑問的內容。</li>
                                <li>禁止使用組合圖片、邊框、自拍照或過度裁切的圖片。</li>
                                <li>圖片中若有人物，需確保符合肖像權規範。</li>
                                <li>產品不可被包裝覆蓋，插圖、文字、配件請勿大過商品主體且須小於整張圖片的 20%。</li>
                                <li>請勿使用沒有辨識度跟獨特性的名稱。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>活動說明：</strong>
                            <ul>
                                <li>提供詳細的活動介紹，包含活動目的、內容、特色等。</li>
                                <li>建議包含活動流程、注意事項、交通方式、入場須知等，以利消費者了解。</li>
                                <li>
                                    禁止嵌入外部報名連結或外部匯款資訊，所有購票及報名流程需在 GoTicket 平台內完成。
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>活動時間與地點：</strong>
                            <ul>
                                <li>明確標示活動的開始與結束日期、時間。</li>
                                <li>詳列活動地點，若有地圖或交通指引更佳。</li>
                                <li>若有多個場次，請清晰標明每個場次的日期、時間與對應票種。</li>
                            </ul>
                        </li>
                    </ol>

                    <h3 className="text-primary mb-3 mt-4">三、票務資訊規範</h3>
                    <ol>
                        <li>
                            <strong>票種設定：</strong>
                            <ul>
                                <li>清晰定義每種票券的名稱、說明、價格、數量限制。</li>
                                <li>若有早鳥票、VIP 票、團體票等不同票種，請清楚說明其權益差異。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>票價與退票政策：</strong>
                            <ul>
                                <li>票價設定需明確且合理。</li>
                                <li>
                                    退票規則應清楚載明，且符合消費者保護法規定。
                                    <strong>活動開始售票且有人報名後，退票規則不可再修改</strong>。
                                </li>
                                <li>GoTicket 平台會收取金流手續費，請主辦單位將費用列入考量。</li>
                            </ul>
                        </li>
                        <li>
                            <strong>庫存管理：</strong>
                            <ul>
                                <li>準確設定票券張數，避免超賣或不足。</li>
                                <li>若票券售罄，可設定是否啟用候補機制。</li>
                            </ul>
                        </li>
                    </ol>

                    <h3 className="text-primary mb-3 mt-4">四、內容限制與禁止事項</h3>
                    <ul>
                        <li>
                            <strong>非法或有害內容：</strong>{' '}
                            禁止宣傳、販售或包含槍枝、毒品、禁藥、盜版軟體、賭博、色情、暴力、仇恨、歧視等任何非法或有害內容。
                        </li>
                        <li>
                            <strong>侵犯智慧財產權：</strong>{' '}
                            禁止使用任何未經授權的文字、圖片、影音、商標等，若因此產生糾紛，主辦單位需負全責。
                        </li>
                        <li>
                            <strong>欺詐或誤導性行為：</strong> 禁止從事不法交易行為或張貼虛假不實、引人犯罪之訊息。
                        </li>
                        <li>
                            <strong>不當營利：</strong> 未經 GoTicket
                            同意，禁止利用平台從事與平台使用目的無關之營利行為。
                        </li>
                        <li>
                            <strong>洗錢與黃牛行為：</strong>{' '}
                            嚴禁任何形式的洗錢行為。禁止以超過票面金額或定價轉售票券進行圖利，一經查證將依相關法規處理。
                        </li>
                        <li>
                            <strong>個人資料：</strong>{' '}
                            禁止在活動頁面要求消費者提供過多不必要的個人資訊，並應遵守個人資料保護法。
                        </li>
                    </ul>

                    <h3 className="text-primary mb-3 mt-4">五、審核與發佈流程</h3>
                    <ul>
                        <li>
                            <strong>提交審核：</strong> 所有付費活動在發佈前皆須通過 GoTicket
                            平台的審核。免費活動雖不需審核即可發佈，但平台專員會不定期檢查是否有違規情形。
                        </li>
                        <li>
                            <strong>審核時間：</strong> 一般審核約需 2 個工作天，請主辦單位提早提交。
                        </li>
                        <li>
                            <strong>審核標準：</strong> GoTicket
                            將依據上述規範進行審核，若活動內容不符規範，將會要求修改或拒絕上架。
                        </li>
                        <li>
                            <strong>活動變更：</strong>
                            <ul>
                                <li>
                                    <strong>不可更改部分 (已售出票券的活動)：</strong>{' '}
                                    報名表欄位、票種名稱、票種說明、單次購買數量限制、退票規則、不開放刪除與下架等。
                                </li>
                                <li>
                                    <strong>可更改部分：：</strong>{' '}
                                    活動圖片、活動文字、活動時間、售票時間、有效時間、票券張數、活動是否公開、票券發售狀態等。
                                </li>
                                <li>
                                    若因特殊情況需取消活動，已有人報名的活動無法直接下架，請參照平台指示操作，並務必通知所有購票人。
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <h3 className="text-primary mb-3 mt-4">六、法律與條款</h3>
                    <ul>
                        <li>
                            主辦單位上架活動即表示同意 GoTicket 的
                            <a href="/privacy-policy" className="text-decoration-none text-info">
                                隱私權政策
                            </a>
                            與
                            <a href="/terms-of-service" className="text-decoration-none text-info">
                                使用者條款
                            </a>
                            。
                        </li>
                        <li>
                            GoTicket
                            保留對活動內容的最終解釋權與審核權，並有權在不另行通知的情況下移除不符合規範的內容。
                        </li>
                        <li>若廠商違反任何規範導致 GoTicket 或第三方遭受損害，廠商應負全部法律責任。</li>
                    </ul>

                    <h3 className="text-primary mb-3 mt-4">七、聯絡我們</h3>
                    <p>
                        若您對活動上架規範有任何疑問，或在活動上架過程中遇到問題，請隨時透過
                        <a href="/contact-us" className="text-decoration-none text-info">
                            聯絡我們
                        </a>
                        頁面與 GoTicket 客服團隊聯繫。
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default UploadGuidelines;
