import React, { useState, useMemo, useEffect } from 'react';

interface Area {
    id: number;
    name: string;
}
interface SearchFilterProps {
    availAreas: Area[];
    onChange?: (selected: number[]) => void; // 新增 onChange props
    onConfirm?: () => void; // 新增
}

// 分組規則
const GROUP_RULES: { label: string; keywords: string[] }[] = [
    { label: '北部地區', keywords: ['基隆', '台北', '新北', '桃園', '新竹'] },
    { label: '中部地區', keywords: ['苗栗', '台中', '彰化', '南投', '雲林'] },
    { label: '南部地區', keywords: ['嘉義', '台南', '高雄', '屏東'] },
    { label: '東部地區', keywords: ['宜蘭', '花蓮', '台東'] },
    { label: '離島地區', keywords: ['澎湖', '金門', '連江'] }
];

function groupAreas(availAreas: Area[]) {
    const groups = GROUP_RULES.map(rule => ({
        label: rule.label,
        areas: availAreas.filter(area => rule.keywords.some(keyword => area.name.includes(keyword)))
    }));
    // 過濾掉沒有地區的分組
    return groups.filter(group => group.areas.length > 0);
}

const SearchFilter: React.FC<SearchFilterProps> = ({ availAreas, onChange, onConfirm }) => {
    const [selected, setSelected] = useState<number[]>([]);

    // 當 selected 變動時通知父層
    useEffect(() => {
        if (onChange) onChange(selected);
    }, [selected, onChange]);

    // 依據 availAreas 動態分組
    const areaGroups = useMemo(() => groupAreas(availAreas), [availAreas]);

    const toggleArea = (id: number) => {
        setSelected(prev => (prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]));
    };

    const selectAll = (areas: Area[]) => {
        setSelected(prev => Array.from(new Set([...prev, ...areas.map(a => a.id)])));
    };

    const clearAll = () => setSelected([]);

    return (
        <div
            className="p-4 bg-white rounded-4"
            style={{
                minWidth: 375,
                width: 375,
                position: 'absolute',
                zIndex: 1000,
                boxShadow: '0px 8px 24px 0px #959DA552'
            }}
        >
            {areaGroups.map(group => (
                <div key={group.label} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{group.label}</span>
                        <button
                            className="btn btn-link p-0 text-dark"
                            style={{ fontWeight: 600, textDecoration: 'none' }}
                            onClick={() => selectAll(group.areas)}
                        >
                            全選
                        </button>
                    </div>
                    <div className="mb-2 d-flex flex-wrap gap-2">
                        {group.areas.map(area => (
                            <button
                                key={area.id}
                                type="button"
                                className={`btn rounded-pill px-4 py-1 ${selected.includes(area.id) ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                                style={{ fontWeight: 500 }}
                                onClick={() => toggleArea(area.id)}
                            >
                                {area.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-outline-warning" onClick={clearAll}>
                    清除設定
                </button>
                <button className="btn btn-warning text-white" onClick={onConfirm}>
                    確認
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
