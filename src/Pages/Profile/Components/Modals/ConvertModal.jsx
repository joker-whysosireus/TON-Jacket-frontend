import { useState, useEffect } from 'react';
import './Modals.css';

function ConvertModal({ show, onClose, userData, onConvert, isConverting, convertSuccess }) {
    const [coinsAmount, setCoinsAmount] = useState('');
    const [tonEquivalent, setTonEquivalent] = useState(0);
    const conversionRate = 0.00001;
    const minConvertAmount = 1000;

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
                    <h2>💰 Convert Coins to TON</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    <div className="convert-modal-balance">
                        <div className="convert-balance-amount">
                            {userData?.coins?.toFixed(2) || '0.00'} 🏅
                        </div>
                        <div className="convert-conversion-info">Available for conversion</div>
                        <div className="convert-rate-info">
                            🏅1000 coins = 0.01 TON
                        </div>
                        <div className="convert-minimum-info">
                            Minimum conversion: 1000 coins
                        </div>
                    </div>

                    <div className="convert-modal-input-section">
                        <div className="convert-conversion-result">
                            <div className="convert-conversion-label">You will receive</div>
                            <div className="convert-ton-amount">
                                {((userData?.coins || 0) * conversionRate).toFixed(2)} TON
                            </div>
                        </div>

                        <button
                            onClick={onConvert}
                            disabled={!userData?.coins || userData.coins < minConvertAmount || isConverting}
                            className={`convert-modal-button ${!userData?.coins || userData.coins < minConvertAmount || isConverting ? 'disabled' : ''}`}
                        >
                            {isConverting ? (
                                convertSuccess ? (
                                    'Success!'
                                ) : (
                                    <div className="spinner"></div>
                                )
                            ) : (
                                'CONVERT TO TON'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConvertModal;