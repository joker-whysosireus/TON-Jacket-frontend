import { useState, useEffect } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import { translations } from '../../../../Assets/Lang/translation';
import './Modals.css';

function WithdrawModal({ 
    show, 
    onClose, 
    userData, 
    onWithdraw, 
    isWithdrawing, 
    withdrawSuccess, 
    withdrawLocked,
    timeLeft,
    formatTimeLeft,
    language = 'english' 
}) {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    // Получаем переводы для текущего языка
    const t = translations[language]?.profileModals?.withdraw || translations.english.profileModals.withdraw;
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

    useEffect(() => {
        if (show && userData?.wallet) {
            const wallet = userData.wallet;
            if (wallet && wallet !== "no wallet" && wallet !== "" && wallet !== "undefined") {
                setWalletAddress(wallet);
            }
            
            // Проверяем условия при открытии модального окна
            checkWithdrawConditions();
        }
    }, [show, userData?.wallet]);

    useEffect(() => {
        if (!show) {
            setWithdrawAmount('');
        }
    }, [show]);

    // Функция проверки условий вывода
    const checkWithdrawConditions = () => {
        const hasDepositedEnough = userData?.deposit_amount >= 1;
        const hasPlacedBet = userData?.bet_amount > 0;
        
        if (!hasDepositedEnough || !hasPlacedBet) {
            const alertTexts = {
                english: "Withdrawal is not available. To withdraw funds:\n\n• Deposit at least 1 TON to your balance\n• Place at least one bet in the game\n\nAfter completing these conditions, you will be able to withdraw your TON.",
                russian: "Вывод недоступен. Для вывода средств:\n\n• Пополните баланс минимум на 1 TON\n• Сделайте хотя бы одну ставку в игре\n\nПосле выполнения этих условий вы сможете выводить TON."
            };
            
            alert(alertTexts[language] || alertTexts.english);
            onClose();
            return false;
        }
        
        return true;
    };

    const handleWithdrawAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            const numValue = parseFloat(value);
            if (value === '' || numValue <= userData?.ton_amount) {
                setWithdrawAmount(value);
            }
        }
    };

    const handleMaxTonClick = () => {
        setWithdrawAmount(userData?.ton_amount?.toString() || '0');
    };

    const handleWithdraw = async () => {
        if (parseFloat(withdrawAmount) > 0 && walletAddress) {
            // Дополнительная проверка перед отправкой
            if (!checkWithdrawConditions()) {
                return;
            }
            
            await onWithdraw(withdrawAmount, walletAddress);
        }
    };

    const isValidWithdrawal = withdrawAmount && 
                            parseFloat(withdrawAmount) > 0 && 
                            parseFloat(withdrawAmount) <= userData?.ton_amount && 
                            walletAddress.length > 0 &&
                            !withdrawLocked;

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose}>
            <div className="convert-modal-content withdraw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="convert-modal-header">
                    <h2>{t.title}</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    {withdrawLocked && (
                        <div className="withdraw-cooldown-notice">
                            <div className="cooldown-icon">⏰</div>
                            <div className="cooldown-text">
                                <strong>Withdrawal on Cooldown</strong>
                                <p>Next withdrawal available in: {formatTimeLeft(timeLeft)}</p>
                            </div>
                        </div>
                    )}

                    <div className="convert-modal-balance withdraw-balance">
                        <div className="balance-content-with-logo">
                            <TonLogoIcon size={32} className="ton-logo-align" />
                            <div className="convert-balance-amount withdraw-balance-amount">
                                {userData?.ton_amount?.toFixed(3) || '0.000'} {balanceT.ton}
                            </div>
                        </div>
                        <div className="convert-conversion-info">{t.availableForWithdrawal}</div>
                    </div>

                    <div className="convert-modal-input-section">
                        <div className="withdraw-input-group">
                            <input
                                type="text" 
                                placeholder={t.walletPlaceholder}
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                className="wallet-address-input"
                                disabled={withdrawLocked}
                            />
                        </div>

                        <div className="convert-input-group">
                            <input
                                type="text"
                                placeholder={t.amountPlaceholder}
                                value={withdrawAmount}
                                onChange={handleWithdrawAmountChange}
                                className="convert-amount-input"
                                disabled={withdrawLocked}
                            />
                            <button
                                onClick={handleMaxTonClick}
                                className="convert-max-button"
                                disabled={isWithdrawing || withdrawLocked}
                            >
                                {t.maxButton}
                            </button>
                        </div>

                        <div className="withdraw-notice">
                            <p>{t.notice1}</p>
                            <p>{t.notice2}</p>
                            {withdrawLocked && (
                                <p className="cooldown-notice">⚠️ Withdrawals are available once every 24 hours</p>
                            )}
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={!isValidWithdrawal || isWithdrawing || withdrawLocked}
                            className={`convert-modal-button withdraw-action-btn ${!isValidWithdrawal || isWithdrawing || withdrawLocked ? 'disabled' : ''}`}
                        >
                            {withdrawLocked ? (
                                `Wait ${formatTimeLeft(timeLeft)}`
                            ) : isWithdrawing ? (
                                withdrawSuccess ? (
                                    t.success
                                ) : (
                                    <>
                                        <div className="spinner"></div>
                                        {t.processing}
                                    </>
                                )
                            ) : (
                                t.withdrawButton
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawModal;