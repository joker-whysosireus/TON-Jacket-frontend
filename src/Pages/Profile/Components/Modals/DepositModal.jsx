import { useState, useEffect } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import { translations, formatString } from '../../../../Assets/Lang/translation';
import './Modals.css';

function DepositModal({ show, onClose, userData, onDeposit, isDepositing, depositSuccess, language = 'english' }) {
    const [depositAmount, setDepositAmount] = useState('');
    const fixedAmounts = [1, 5, 10, 25, 50, 100];

    // Получаем переводы для текущего языка
    const t = translations[language]?.profileModals?.deposit || translations.english.profileModals.deposit;
    const balanceT = translations[language]?.balance || translations.english.balance;

    const TonLogoIcon = ({ size = 20, className = "" }) => {
        return (
            <img 
                src={TonLogo} 
                alt="TON" 
                className={`profile-ton-logo ${className}`}
                style={{ width: size, height: size }} 
            />
        );
    };

    // Сброс состояний при закрытии
    useEffect(() => {
        if (!show) {
            setDepositAmount('');
        }
    }, [show]);

    const handleFixedAmountClick = (amount) => {
        setDepositAmount(amount.toString());
    };

    const isValidDeposit = depositAmount && parseFloat(depositAmount) > 0;

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose} style={{ zIndex: 999 }}>
            <div className="convert-modal-content deposit-modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1000 }}>
                <div className="convert-modal-header">
                    <h2>{t.title}</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    <div className="deposit-amount-display">
                        <TonLogoIcon size={32} />
                        <span className="deposit-amount-text">{depositAmount || '0'} {balanceT.ton}</span>
                    </div>

                    <div className="deposit-info">
                        <p>{t.selectAmount}</p>
                    </div>

                    <div className="bet-modal-amounts">
                        <div className="amount-buttons-grid">
                            {fixedAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    className={`choice-btn ${depositAmount === amount.toString() ? 'active' : ''} ${isDepositing ? 'disabled' : ''}`}
                                    onClick={() => handleFixedAmountClick(amount)}
                                    disabled={isDepositing}
                                >
                                    {amount} {balanceT.ton}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onDeposit(depositAmount)}
                        disabled={!isValidDeposit || isDepositing}
                        className={`deposit-action-button ${!isValidDeposit || isDepositing ? 'disabled' : ''}`}
                    >
                        {isDepositing ? (
                            depositSuccess ? (
                                t.success
                            ) : (
                                <>
                                    <div className="spinner"></div>
                                    {t.depositing}
                                </>
                            )
                        ) : (
                            formatString(t.depositButton, { amount: depositAmount })
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DepositModal;