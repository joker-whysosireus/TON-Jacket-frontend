import './Friends.css';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';

function Friends({ userData, updateUserData }) {
    const handleInviteClick = () => {
        const telegramUserId = userData?.telegram_user_id;
        if (!telegramUserId) {
            console.warn("Telegram User ID not found.");
            return;
        }

        const message = "Join me in TON Jacket and let's spin to win TON! Use my invite link to join and get bonus coins! 🎰💰";
        const startAppValue = `ref_${telegramUserId}`; 
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/TONJacketBot?startapp=${startAppValue}`)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    };

    return (
        <div className='container'>
            <BalanceSection userData={userData}/>
            
            {/* Секция с информацией о друзьях */}
            <div className="friends-info-section">
                <div className="handshake-emoji">🤝</div>
                <div className="invite-description">
                    <p className="description-line">Invite your friends to get more coins,</p>
                    <p className="description-line">which you can transfer to TON for free spins!</p>
                    <p className="description-line">The more friends you invite, the more coins you get!</p>
                </div>
            </div>

            {/* Секция с коинами и количеством друзей */}
            <div className="stats-section">
                <div className="stat-item">
                    <div className="stat-value">🏅{userData?.coins_for_invite?.toFixed(3) || '0.000'}</div>
                    <div className="stat-label">Coins from Invites</div>
                </div>
                
                <div className="stat-divider"></div>
                
                <div className="stat-item">
                    <div className="stat-value">{userData?.invited_friends || 0}</div>
                    <div className="stat-label">Friends Invited</div>
                </div>
            </div>

            {/* Кнопка приглашения */}
            <div className='button-section'>
                <button className='Invite-button' onClick={handleInviteClick}>INVITE FRIENDS</button>
            </div>
            
            <Menu />
        </div>
    );
}

export default Friends;