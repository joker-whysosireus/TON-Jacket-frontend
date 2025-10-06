import TonLogo from '../../../../Public/TonLogo.png';
import './ActionCards.css';

function ActionCards({ setShowConvertModal, setShowWithdrawModal, setShowDepositModal }) {
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

    return (
        <div className="actions-section">
            <h3 className="subsection-title">Top up your balance</h3>
            <p className="subsection-description">In the opened window, select the amount of TON.</p>
            <div className="action-card">
                <div className="action-header">
                    <div className="action-icon">
                        <TonLogoIcon size={24} />
                    </div>
                    <div className="action-info">
                        <h3 className="action-title">Deposit TON</h3>
                        <p className="action-subtitle">Add TON to your balance</p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowDepositModal(true)}
                    className="action-button deposit-button"
                >
                    DEPOSIT
                </button>
            </div>

            <h3 className="subsection-title">Convert Coins to TON</h3>
            <p className="subsection-description">In the opened window, select the amount of coins.</p>
            <div className="action-card">
                <div className="action-header">
                    <div className="action-icon">
                        <span className="coin-emoji">🏅</span>
                    </div>
                    <div className="action-info">
                        <h3 className="action-title">Convert Coins</h3>
                        <p className="action-subtitle">1000 Coins = 0.01 TON</p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowConvertModal(true)}
                    className="action-button convert-button"
                >
                    CONVERT
                </button>
            </div>

            <h3 className="subsection-title">Withdraw funds to your wallet</h3>
            <p className="subsection-description">In the opened window, select the amount of TON.</p>
            <div className="action-card">
                <div className="action-header">
                    <div className="action-icon">
                        <TonLogoIcon size={24} />
                    </div>
                    <div className="action-info">
                        <h3 className="action-title">Withdraw TON</h3>
                        <p className="action-subtitle">Send to external wallet</p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="action-button withdraw-action-button"
                >
                    WITHDRAW
                </button>
            </div>
        </div>
    );
}

export default ActionCards;