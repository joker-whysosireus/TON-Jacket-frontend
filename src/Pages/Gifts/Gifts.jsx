import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import { translations } from '../../Assets/Lang/translation';
import './Gifts.css';

function Gifts({ userData, updateUserData, language = 'english' }) {
    // Получаем переводы для текущего языка
    const t = translations[language]?.gifts || translations.english.gifts;

    const openChannelPost = () => {
        window.open('https://t.me/ton_mania_channel/20', '_blank');
    };

    return (
        <div className="gifts-container">
            <BalanceSection userData={userData} language={language}/>
            
            {/* Gifts Main Section */}
            <div className="gifts-content">
                <div className="gift-emoji">🎁</div>
                
                <div className="gifts-text">
                    <h2>{t.title}</h2>
                    <p>{t.description}</p>
                </div>
            </div>

            {/* Кнопка для открытия поста в канале */}
            <div className="channel-post-button-container">
                <button className="channel-post-button" onClick={openChannelPost}>
                    {t.channelButton}
                </button>
            </div>
            
            <Menu language={language} />
        </div>
    );
}

export default Gifts;