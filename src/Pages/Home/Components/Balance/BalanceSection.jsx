import React from 'react';
import './BalanceSection.css';
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

const GoldIcon = ({ size = 20, className = "" }) => {
  return (
    <span 
      className={`gold-icon ${className}`}
      style={{ fontSize: size, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }} 
    >
      🏅
    </span>
  );
};

const BalanceSection = ({ userData, onAddBalance }) => {
  const safeUserData = userData || {
    ton_amount: 100.000,
    coins: 500.000
  };

  return (
    <div className="balance-section">
      <div className="balance-item balance-item-ton">
        <div className="balance-content">
          <TonLogoIcon size={22} className="ton-logo-balance" />
          <div className="balance-text-container">
            <span className="balance-value">{safeUserData.ton_amount.toFixed(2)}</span>
            <span className="balance-label">TON</span>
          </div>
        </div>
        <button 
          className="balance-add-btn"
          onClick={() => onAddBalance('ton', 10)}
          title="Add TON"
        >
          +
        </button>
      </div>
      
      <div className="balance-item balance-item-coins">
        <div className="balance-content">
          <GoldIcon size={22} className="gold-icon" />
          <div className="balance-text-container-coins">
            <span className="balance-value">{safeUserData.coins}</span>
            <span className="balance-label">Coins</span>
          </div>
        </div>
        <button 
          className="balance-add-btn-coins"
          onClick={() => onAddBalance('coins', 100)}
          title="Add Coins"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BalanceSection;