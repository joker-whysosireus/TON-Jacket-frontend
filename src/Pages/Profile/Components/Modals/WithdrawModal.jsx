import { useState, useEffect } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import './Modals.css';

function WithdrawModal({ show, onClose, userData, onWithdraw, isWithdrawing, withdrawSuccess }) {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

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
        if (show && userData?.wallet && userData.wallet !== "no wallet") {
            setWalletAddress(userData.wallet);
        }
    }, [show, userData?.wallet]);

    // Сброс состояний при закрытии
    useEffect(() => {
        if (!show) {
            setWithdrawAmount('');
            setWalletAddress('');
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
                    <h2>💰 Withdraw TON</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    <div className="convert-modal-balance withdraw-balance">
                        <div className="balance-content-with-logo">
                            <TonLogoIcon size={32} className="ton-logo-align" />
                            <div className="convert-balance-amount withdraw-balance-amount">
                                {userData?.ton_amount?.toFixed(2) || '0.00'} TON
                            </div>
                        </div>
                        <div className="convert-conversion-info">Available for withdrawal</div>
                    </div>

                    <div className="convert-modal-input-section">
                        <div className="withdraw-input-group">
                            <input
                                type="text" 
                                placeholder="Wallet address (EQ...)"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                className="wallet-address-input"
                            />
                        </div>

                        <div className="convert-input-group">
                            <input
                                type="text"
                                placeholder="Amount (TON)"
                                value={withdrawAmount}
                                onChange={handleWithdrawAmountChange}
                                className="convert-amount-input"
                            />
                            <button
                                onClick={handleMaxTonClick}
                                className="convert-max-button"
                                disabled={isWithdrawing}
                            >
                                MAX
                            </button>
                        </div>

                        <div className="withdraw-notice">
                            <p>⚠️ Withdrawal may take up to 21 days to process.</p>
                            <p>The bot will send you a notification when your TON transfer is completed.</p>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={!isValidWithdrawal || isWithdrawing}
                            className={`convert-modal-button withdraw-action-btn ${!isValidWithdrawal || isWithdrawing ? 'disabled' : ''}`}
                        >
                            {isWithdrawing ? (
                                withdrawSuccess ? (
                                    'Success!'
                                ) : (
                                    <div className="spinner"></div>
                                )
                            ) : (
                                'WITHDRAW TON'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawModal;