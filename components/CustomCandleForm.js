import { useEffect, useState } from 'react';
// import { useCart } from '../context/CartContext';
import faTrash from '../public/icons/trash.svg';
import Image from 'next/image';
import faXmark from '../public/icons/xmark-black.svg';
import styles from './customCandleForm.module.scss';

const CustomCandleForm = ({ id, candleNum, customizationData, onCustomizationChange, onRemove }) => {
    // const { cart, addToCart } = useCart();
    const [wordError, setWordError] = useState('');

    console.log("customizationData", customizationData)

    const handleWordChange = (e) => {
        const value = e.target.value;
        const words = value.trim().split(/[\s,]+/).filter(Boolean); // Split by space or comma
        if (words.length > 3) {
            setWordError("Only up to 3 words allowed.");
        } else {
            setWordError('');
            onCustomizationChange(id, candleNum, 'words', value)
        }
    };

    return (
        <div className={styles.custom}>
            <div className={styles.header}>
                <div className={styles.label}>Customization Candle # {candleNum+1}</div>
                <div className={styles.deleteIco} onClick={() => onRemove()}>
                    <Image src={faTrash} layout="fill" title="Remove candle" />
                </div>
            </div>
            {!customizationData.words && (
                <label className={styles.date}>
                    <div>Date (if no words):</div>
                    <input
                        type="date"
                        value={customizationData.date || ''}
                        onChange={(e) => onCustomizationChange(id, candleNum, 'date', e.target.value)}
                    />
                    <button className={styles.clearIcon} onClick={(e) => onCustomizationChange(id, candleNum, 'date', '')}>
                        <Image src={faXmark} layout="fill" title="Clear date" />
                    </button>                    
                </label>
            )}

            {!customizationData.date && (
                <label>
                    Three words (if no date):
                    <input
                        type="text"
                        placeholder="I Love You"
                        value={customizationData.words || ''}
                        onChange={handleWordChange}
                    />
                    {wordError && <span className={styles.error}>{wordError}</span>}
                </label>
            )}

            <div className={styles.nameContainer}>
                <div>
                    <label>
                        Name 1:
                        <input
                            type="text"
                            value={customizationData.name1 || ''}
                            onChange={(e) => onCustomizationChange(id, candleNum, 'name1', e.target.value)}
                        />
                    </label>
                    <label>
                        Zodiac Sign 1:
                        <input
                            type="text"
                            value={customizationData.zodiac1 || ''}
                            onChange={(e) => onCustomizationChange(id, candleNum, 'zodiac1', e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Name 2:
                        <input
                            type="text"
                            value={customizationData.name2 || ''}
                            onChange={(e) => onCustomizationChange(id, candleNum, 'name2', e.target.value)}
                        />
                    </label>
                    <label>
                        Zodiac Sign 2:
                        <input
                            type="text"
                            value={customizationData.zodiac2 || ''}
                            onChange={(e) => onCustomizationChange(id, candleNum, 'zodiac2', e.target.value)}
                        />
                    </label>
                </div>
            </div>
            {/* 
            <button className={styles.removeBtn} onClick={() => onRemove()}>
                Remove Candle
            </button> */}
        </div>
    );
};

export default CustomCandleForm;
