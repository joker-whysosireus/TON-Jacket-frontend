import { useState } from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import './Modals.css';

function DepositModal({ show, onClose, userData, onDeposit, isDepositing }) {
    const [depositAmount, setDepositAmount] = useState('');
    const fixedAmounts = [1, 5, 10, 25, 50, 100];

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

    const handleFixedAmountClick = (amount) => {
        setDepositAmount(amount.toString());
    };

    const isValidDeposit = depositAmount && parseFloat(depositAmount) > 0;

    if (!show) return null;

    return (
        <div className="convert-modal-overlay" onClick={onClose}>
            <div className="convert-modal-content deposit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="convert-modal-header">
                    <h2>💰 Deposit TON</h2>
                    <button className="convert-modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="convert-modal-body">
                    <div className="deposit-amount-display">
                        <TonLogoIcon size={32} />
                        <span className="deposit-amount-text">{depositAmount || '0'} TON</span>
                    </div>

                    <div className="deposit-info">
                        <p>Select amount to deposit</p>
                    </div>

                    <div className="bet-modal-amounts">
                        <div className="amount-buttons-grid">
                            {fixedAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    className={`choice-btn ${depositAmount === amount.toString() ? 'active' : ''}`}
                                    onClick={() => handleFixedAmountClick(amount)}
                                >
                                    {amount} TON
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onDeposit(depositAmount)}
                        disabled={!isValidDeposit || isDepositing}
                        className={`deposit-action-button ${!isValidDeposit || isDepositing ? 'disabled' : ''}`}
                    >
                        {isDepositing ? 'PROCESSING...' : `Deposit ${depositAmount} TON`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DepositModal;