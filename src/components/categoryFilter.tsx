import React, { useState, useEffect } from 'react';

interface CategoryFilterProps {
    categories: any[];
    selected: number[];
    onChange: (selected: number[]) => void;
    onConfirm: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onChange, onConfirm }) => {
    const [localSelected, setLocalSelected] = useState<number[]>(selected);

    useEffect(() => {
        setLocalSelected(selected);
    }, [selected]);

    const toggleCategory = (id: number) => {
        setLocalSelected(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
    };

    const clearAll = () => setLocalSelected([]);

    const selectAll = () => setLocalSelected(categories.map(c => c.id));

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
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">分類</span>
                <button
                    className="btn btn-link p-0 text-dark"
                    style={{ fontWeight: 600, textDecoration: 'none' }}
                    onClick={selectAll}
                >
                    全選
                </button>
            </div>
            <div className="mb-2 d-flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        className={`btn rounded-pill px-4 py-1 ${localSelected.includes(cat.id) ? 'btn-warning text-white' : 'btn-outline-secondary'}`}
                        style={{ fontWeight: 500 }}
                        onClick={() => toggleCategory(cat.id)}
                    >
                        <img
                            src={cat.media}
                            alt={cat.name}
                            style={{ width: 24, height: 24, marginRight: 6, borderRadius: '50%' }}
                        />
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-outline-warning" onClick={clearAll}>
                    清除設定
                </button>
                <button
                    className="btn btn-warning text-white"
                    onClick={() => {
                        onChange(localSelected);
                        onConfirm();
                    }}
                >
                    確認
                </button>
            </div>
        </div>
    );
};

export default CategoryFilter;
