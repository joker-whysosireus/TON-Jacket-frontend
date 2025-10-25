import { useState, useEffect } from 'react';
import { translations } from '../../../../Assets/Lang/translation';
import './ConvertModal.css'

function ConvertModal({ show, onClose, userData, onConvert, isConverting, convertSuccess, language = 'english' }) {
    const [coinsAmount, setCoinsAmount] = useState('');
    const [tonEquivalent, setTonEquivalent] = useState(0);
    const conversionRate = 0.00001;
    const minConvertAmount = 1000;

    // Получаем переводы для текущего языка
    const t = translations[language]?.profileModals?.convert || translations.english.profileModals.convert;
    const balanceT = translations[language]?.balance || translations.english.balance;

    useEffect(() => {
        const amount = parseFloat(coinsAmount) || 0;
        setTonEquivalent(amount * conversionRate);
    }, [coinsAmount, conversionRate]);

    // Сброс состояний при закрытии
    useEffect(() => {
        if (!show) {
            setCoinsAmount('');
            setTonEquivalent(0);
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose}>
            <div className="convert-modal-content convert-modal" onClick={(e) => e.stopPropagation()}>
                <div className="convert-modal-header">
                    <h2>{t.title}</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    <div className="convert-modal-balance">
                        <div className="convert-balance-amount">
                            {userData?.coins?.toFixed(2) || '0.00'} 🏅
                        </div>
                        <div className="convert-conversion-info">{t.availableForConversion}</div>
                        <div className="convert-rate-info">
                            {t.conversionRate}
                        </div>
                        <div className="convert-minimum-info">
                            {t.minimumConversion}
                        </div>
                    </div>

                    <div className="convert-modal-input-section">
                        <div className="convert-conversion-result">
                            <div className="convert-conversion-label">{t.youWillReceive}</div>
                            <div className="convert-ton-amount">
                                {((userData?.coins || 0) * conversionRate).toFixed(2)} {balanceT.ton}
                            </div>
                        </div>

                        <button
                            onClick={onConvert}
                            disabled={!userData?.coins || userData.coins < minConvertAmount || isConverting}
                            className={`convert-modal-button ${!userData?.coins || userData.coins < minConvertAmount || isConverting ? 'disabled' : ''}`}
                        >
                            {isConverting ? (
                                convertSuccess ? (
                                    t.success
                                ) : (
                                    <>
                                        <div className="spinner"></div>
                                        {t.converting}
                                    </>
                                )
                            ) : (
                                t.convertButton
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConvertModal;