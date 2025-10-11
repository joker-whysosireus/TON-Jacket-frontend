import './Friends.css';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import { translations } from '../../Assets/Lang/translation';

function Friends({ userData, updateUserData, language = 'english' }) {
    // Получаем переводы для текущего языка
    const t = translations[language]?.friends || translations.english.friends;

    const handleInviteClick = () => {
        const telegramUserId = userData?.telegram_user_id;
        if (!telegramUserId) {
            console.warn("Telegram User ID not found.");
            return;
        }

        const message = language === 'russian' 
            ? "Присоединяйся ко мне в TON Mania и крути слоты, чтобы выиграть TON! Используй мою ссылку-приглашение, чтобы присоединиться и получить бонусные монеты! 🎰💰"
            : "Join me in TON Mania and let's spin to win TON! Use my invite link to join and get bonus coins! 🎰💰";
            
        const startAppValue = `ref_${telegramUserId}`; 
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/ton_mania_slots_bot?startapp=${startAppValue}`)}&text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    };

    return (
        <div className='container'>
            <BalanceSection userData={userData} language={language}/>
            
            {/* Секция с информацией о друзьях */}
            <div className="friends-info-section">
                <div className="handshake-emoji">🤝</div>
                <div className="invite-description">
                    <p className="description-line">{t.inviteFriends}</p>
                    <p className="description-line">
                        {language === 'russian' 
                            ? "приглашайте друзей и получайте больше коинов," 
                            : "which you can transfer to TON for free spins!"
                        }
                    </p>
                    <p className="description-line">
                        {language === 'russian'
                            ? "которые можно конвертировать в TON!"
                            : "The more friends you invite, the more coins you get!"
                        }
                    </p>
                </div>
            </div>

            {/* Секция с коинами и количеством друзей */}
            <div className="stats-section">
                <div className="stat-item">
                    <div className="stat-value">🏅{userData?.coins_for_invite?.toFixed(3) || '0.000'}</div>
                    <div className="stat-label">
                        {language === 'russian' ? 'Монет за приглашения' : 'Coins from Invites'}
                    </div>
                </div>
                
                <div className="stat-divider"></div>
                
                <div className="stat-item">
                    <div className="stat-value">{userData?.invited_friends || 0}</div>
                    <div className="stat-label">
                        {language === 'russian' ? 'Приглашено друзей' : 'Friends Invited'}
                    </div>
                </div>
            </div>

            {/* Кнопка приглашения */}
            <div className='button-section'>
                <button className='Invite-button' onClick={handleInviteClick}>
                    {t.inviteFriends.toUpperCase()}
                </button>
            </div>
            
            <Menu language={language} />
        </div>
    );
}

export default Friends;