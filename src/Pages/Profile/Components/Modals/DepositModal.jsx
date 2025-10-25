import { useState, useEffect } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import { translations, formatString } from '../../../../Assets/Lang/translation';
import './DepositModal.css';

function DepositModal({ show, onClose, userData, onDeposit, isDepositing, depositSuccess, language = 'english' }) {
    const [depositAmount, setDepositAmount] = useState('');
    const fixedAmounts = [1, 5, 10, 25, 50, 100];

    // Получаем переводы для текущего языка
    const t = translations[language]?.profileModals?.deposit || translations.english.profileModals.deposit;
    const balanceT = translations[language]?.balance || translations.english.balance;

    // Акция 1.5x (можно сделать динамической по дате)
    const isBonusActive = true; // Можно заменить на проверку даты: new Date() < new Date('2024-12-31')
    const bonusMultiplier = 1.5;

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
    
    // Рассчитываем сумму с бонусом
    const calculateBonusAmount = () => {
        if (!depositAmount) return 0;
        const amount = parseFloat(depositAmount);
        return amount * bonusMultiplier;
    };

    const getBonusText = () => {
        if (!isBonusActive) return null;
        return formatString(t.bonusText || "Get {total} TON with 1.5x bonus!", { 
            total: calculateBonusAmount().toFixed(1)
        });
    };

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose} style={{ zIndex: 999 }}>
            <div className="convert-modal-content deposit-modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1000 }}>
                <div className="convert-modal-header">
                    <h2>{t.title}</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    {/* Баннер акции */}
                    {isBonusActive && (
                        <div className="deposit-bonus-banner">
                            <div className="bonus-icon">🎁</div>
                            <div className="bonus-text">
                                <div className="bonus-title">SPECIAL OFFER!</div>
                                <div className="bonus-subtitle">1.5x Deposit Bonus - 2 weeks only!</div>
                            </div>
                        </div>
                    )}

                    <div className="deposit-amount-display">
                        <TonLogoIcon size={32} />
                        <div className="deposit-amount-info">
                            <span className="deposit-amount-text">{depositAmount || '0'} {balanceT.ton}</span>
                            {depositAmount && isBonusActive && (
                                <span className="deposit-bonus-amount">
                                    + {(parseFloat(depositAmount) * 0.5).toFixed(1)} {balanceT.ton} bonus
                                </span>
                            )}
                        </div>
                    </div>

                    {depositAmount && isBonusActive && (
                        <div className="deposit-total-receive">
                            <span className="total-receive-text">
                                You will receive: <strong>{calculateBonusAmount().toFixed(1)} {balanceT.ton}</strong>
                            </span>
                        </div>
                    )}

                    <div className="deposit-info">
                        <p>{t.selectAmount}</p>
                    </div>

                    <div className="bet-modal-amounts">
                        <div className="amount-buttons-grid">
                            {fixedAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    className={`choice-btn bonus-choice-btn ${depositAmount === amount.toString() ? 'active' : ''} ${isDepositing ? 'disabled' : ''}`}
                                    onClick={() => handleFixedAmountClick(amount)}
                                    disabled={isDepositing}
                                >
                                    <div className="choice-btn-content">
                                        <span className="choice-amount">{amount} {balanceT.ton}</span>
                                        {isBonusActive && (
                                            <span className="choice-bonus">+{(amount * 0.5).toFixed(0)}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onDeposit(depositAmount)}
                        disabled={!isValidDeposit || isDepositing}
                        className={`deposit-action-button ${!isValidDeposit || isDepositing ? 'disabled' : ''} ${isBonusActive ? 'bonus-button' : ''}`}
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
                            <div className="deposit-button-content">
                                <span>{formatString(t.depositButton, { amount: depositAmount })}</span>
                                {isBonusActive && depositAmount && (
                                    <span className="deposit-bonus-badge">+50% BONUS</span>
                                )}
                            </div>
                        )}
                    </button>

                    {/* Уведомление об акции */}
                    {isBonusActive && (
                        <div className="deposit-promo-notice">
                            <div className="promo-icon">⏰</div>
                            <div className="promo-text">
                                <strong>Limited Time:</strong> Get 1.5x on all deposits! Offer ends in 2 weeks.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DepositModal;