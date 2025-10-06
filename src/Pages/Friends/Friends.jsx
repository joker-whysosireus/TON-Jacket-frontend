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
            <BalanceSection />
            
            {/* Секция с информацией о друзьях */}
            <div className="friends-info-section">
                <div className="handshake-emoji">🤝</div>
                <div className="invited-friends-count">
                    <span className="count-number">{userData?.invited_friends || 0}</span>
                    <span className="count-label"> Friend(s)</span>
                </div>
                <div className="invite-description">
                    Invite your friends to get more coins, which you can transfer to TON for free spins!
                </div>
            </div>

            {/* Секция с коинами и кнопкой */}
            <div className="coins-button-section">
                <div className="coins-for-invite-section">
                    <div className="coins-amount">
                        🏅{userData?.coins_for_invite?.toFixed(3) || '0.000'}
                    </div>
                    <div className="coins-label">
                        Coins from Invites
                    </div>
                </div>

                <div className='Container-button'>
                    <button className='Invite-button' onClick={handleInviteClick}>INVITE FRIENDS</button>
                </div>
            </div>
            
            <Menu />
        </div>
    );
}

export default Friends;