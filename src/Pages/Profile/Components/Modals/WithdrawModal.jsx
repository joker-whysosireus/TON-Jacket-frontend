import { useState, useEffect } from 'react';
import './Modals.css';

function WithdrawModal({ show, onClose, userData, onWithdraw }) {
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    useEffect(() => {
        if (show && userData?.wallet && userData.wallet !== "no wallet") {
            setWalletAddress(userData.wallet);
        }
    }, [show, userData?.wallet]);

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
            setIsWithdrawing(true);
            await onWithdraw(withdrawAmount, walletAddress);
            setIsWithdrawing(false);
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
                    <div className="convert-modal-balance">
                        <div className="convert-balance-amount">
                            {userData?.ton_amount?.toFixed(6) || '0.000000'} TON
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
                            {isWithdrawing ? 'PROCESSING...' : 'WITHDRAW TON'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawModal;