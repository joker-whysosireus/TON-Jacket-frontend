import { useState, useEffect } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import { translations } from '../../../../Assets/Lang/translation';
import './Modals.css';

function WithdrawModal({ show, onClose, userData, onWithdraw, isWithdrawing, withdrawSuccess, language = 'english' }) {
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
        }
    }, [show, userData?.wallet]);

    useEffect(() => {
        if (!show) {
            setWithdrawAmount('');
        }
    }, [show]);

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
            await onWithdraw(withdrawAmount, walletAddress);
        }
    };

    const isValidWithdrawal = withdrawAmount && parseFloat(withdrawAmount) > 0 && 
                            parseFloat(withdrawAmount) <= userData?.ton_amount && 
                            walletAddress.length > 0;

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose}>
            <div className="convert-modal-content withdraw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="convert-modal-header">
                    <h2>{t.title}</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
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
                            />
                        </div>

                        <div className="convert-input-group">
                            <input
                                type="text"
                                placeholder={t.amountPlaceholder}
                                value={withdrawAmount}
                                onChange={handleWithdrawAmountChange}
                                className="convert-amount-input"
                            />
                            <button
                                onClick={handleMaxTonClick}
                                className="convert-max-button"
                                disabled={isWithdrawing}
                            >
                                {t.maxButton}
                            </button>
                        </div>

                        <div className="withdraw-notice">
                            <p>{t.notice1}</p>
                            <p>{t.notice2}</p>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={!isValidWithdrawal || isWithdrawing}
                            className={`convert-modal-button withdraw-action-btn ${!isValidWithdrawal || isWithdrawing ? 'disabled' : ''}`}
                        >
                            {isWithdrawing ? (
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