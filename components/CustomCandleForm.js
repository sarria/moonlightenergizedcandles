import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './customCandleForm.module.scss';

const CustomCandleForm = ({ formId, customizationData, onCustomizationChange, onRemove, itemId }) => {
    const { cart, addToCart } = useCart();
    const [wordError, setWordError] = useState('');

    const handleWordChange = (e) => {
        const value = e.target.value;
        const words = value.trim().split(/[\s,]+/).filter(Boolean); // Split by space or comma
        if (words.length > 3) {
            setWordError("Only up to 3 words allowed.");
        } else {
            setWordError('');
            onCustomizationChange(formId, 'words', value);
        }
    };
    

    return (
        <div className={styles.custom}>
            <div className={styles.header}>Customization Form</div>
            {!customizationData.words && (
                <label>
                    Date (if no words):
                    <input
                        type="date"
                        value={customizationData.date || ''}
                        onChange={(e) => onCustomizationChange(formId, 'date', e.target.value)}
                    />
                </label>
            )}

            {!customizationData.date && (
                <label>
                    Three words (if no date):
                    <input
                        type="text"
                        placeholder="Love, Strength, Peace"
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
                            onChange={(e) => onCustomizationChange(formId, 'name1', e.target.value)}
                        />
                    </label>
                    <label>
                        Zodiac Sign 1:
                        <input
                            type="text"
                            value={customizationData.zodiac1 || ''}
                            onChange={(e) => onCustomizationChange(formId, 'zodiac1', e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Name 2:
                        <input
                            type="text"
                            value={customizationData.name2 || ''}
                            onChange={(e) => onCustomizationChange(formId, 'name2', e.target.value)}
                        />
                    </label>
                    <label>
                        Zodiac Sign 2:
                        <input
                            type="text"
                            value={customizationData.zodiac2 || ''}
                            onChange={(e) => onCustomizationChange(formId, 'zodiac2', e.target.value)}
                        />
                    </label>
                </div>
            </div>

            <button className={styles.removeBtn} onClick={() => onRemove()}>
                Remove Candle
            </button>
        </div>
    );
};

export default CustomCandleForm;
