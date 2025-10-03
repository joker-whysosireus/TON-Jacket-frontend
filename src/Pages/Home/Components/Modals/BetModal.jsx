import React from 'react';
import TonLogo from '../img/TonLogo.png'; // Правильный путь

const TonLogoIcon = ({ size = 20, className = "" }) => {
  return (
    <img 
      src={TonLogo} 
      alt="TON" 
      className={`ton-logo ${className}`}
      style={{ width: size, height: size }} 
    />
  );
};

const BetModal = ({ 
  showBetModal, 
  betAmount, 
  userData,
  onClose, 
  onConfirm, 
  onBetChange 
}) => {
  if (!showBetModal) return null;

  const isConfirmDisabled = betAmount <= 0 || betAmount > userData.ton_amount;
  const quickBetAmounts = [0.1, 0.5, 1, 2, 5, 10];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚀 Place Your Bet</h2>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="bet-amount-display">
            <div className="bet-amount-label">Your Bet Amount</div>
            <div className="bet-amount-value">
              <TonLogoIcon size={50} className="ton-logo-modal" />
              {betAmount.toFixed(2)}
            </div>
            <div className="balance-info">
              <div className="balance-label">Available Balance:</div>
              <div className="balance-amount">
                <TonLogoIcon size={20} />
                {userData.ton_amount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="quick-bet-buttons">
            <div className="quick-bet-label">Quick Bet Amounts:</div>
            <div className="quick-bet-grid">
              {quickBetAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`quick-bet-btn ${betAmount === amount ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBetChange(amount);
                  }}
                >
                  {amount} TON
                </button>
              ))}
            </div>
          </div>

          <div className="bet-modal-actions">
            <button 
              className="bet-confirm-btn"
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
              disabled={isConfirmDisabled}
            >
              Confirm Bet & Spin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetModal;