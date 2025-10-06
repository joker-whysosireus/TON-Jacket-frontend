import './WalletStats.css';

function WalletStats({ userData }) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon deposit-icon">
                        <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                    </div>
                    <span className="stat-label">Deposited</span>
                </div>
                <div className="stat-amount-container">
                    <div className="stat-amount">
                        {userData?.deposit_amount?.toFixed(2) || '0.00'}
                    </div>
                    <div className="stat-currency">TON</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <div className="stat-icon withdraw-icon">
                        <svg className="stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                    <span className="stat-label">Withdrawn</span>
                </div>
                <div className="stat-amount-container">
                    <div className="stat-amount">
                        {userData?.withdraw_amount?.toFixed(2) || '0.00'}
                    </div>
                    <div className="stat-currency">TON</div>
                </div>
            </div>
        </div>
    );
}

export default WalletStats;