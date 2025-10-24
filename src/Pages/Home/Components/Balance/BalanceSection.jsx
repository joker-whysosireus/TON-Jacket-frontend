import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BalanceSection.css';
import TonLogo from '../../../../Public/TonLogo.png';

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
  const navigate = useNavigate();
  
  const safeUserData = userData || {
    ton_amount: 0.000,
    coins: 0.000
  };

  const handleTonButtonClick = () => {
    navigate('/profile');
  };

  const handleCoinsButtonClick = () => {
    navigate('/tasks');
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
          onClick={handleTonButtonClick}
          title="Go to Profile"
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
          onClick={handleCoinsButtonClick}
          title="Go to Tasks"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BalanceSection;