import React from 'react';
import TonLogo from '../../../../Public/TonLogo.png';
import { translations } from '../../../../Assets/Lang/translation';

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
  onBetChange,
  language = 'english'
}) => {
  if (!showBetModal) return null;

  // Получаем переводы для текущего языка
  const t = translations[language]?.betModal || translations.english.betModal;
  const commonT = translations[language]?.common || translations.english.common;
  const balanceT = translations[language]?.balance || translations.english.balance;

  const isConfirmDisabled = betAmount <= 0 || betAmount > userData.ton_amount;
  const quickBetAmounts = [0.1, 0.5, 1, 2, 5, 10];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.title}</h2>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="bet-amount-display">
            <div className="bet-amount-label">{t.yourBetAmount}</div>
            <div className="bet-amount-value">
              <TonLogoIcon size={50} className="ton-logo-modal" />
              {betAmount.toFixed(2)}
            </div>
            <div className="balance-info">
              <div className="balance-label">{t.availableBalance}</div>
              <div className="balance-amount">
                <TonLogoIcon size={20} />
                {userData.ton_amount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="quick-bet-buttons">
            <div className="quick-bet-label">{t.quickBetAmounts}</div>
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
                  {amount} {balanceT.ton}
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
              {t.confirmBetSpin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetModal;