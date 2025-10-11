import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import './Gifts.css';

function Gifts({ userData, updateUserData }) {
    const openChannelPost = () => {
        // Замените на актуальную ссылку на пост в вашем канале
        window.open('https://t.me/ton_mania_channel/1', '_blank');
    };

    return (
        <div className="gifts-container">
            <BalanceSection userData={userData}/>
            
            {/* Gifts Main Section */}
            <div className="gifts-content">
                <div className="gift-emoji">🎁</div>
                
                <div className="gifts-text">
                    <h2>Coming Soon: Exclusive TON NFT Gifts</h2>
                    <p>
                        The TON Mania team is working on integrating with platforms like 
                        <strong> Fragment</strong> and <strong>Getgems</strong> to bring you 
                        unique NFT gifts that you can purchase or win directly from our slot machine! 
                        Soon you'll be able to collect, trade, and showcase rare digital items 
                        on the TON blockchain.
                    </p>
                </div>
            </div>

            {/* Кнопка для открытия поста в канале */}
            <div className="channel-post-button-container">
                <button className="channel-post-button" onClick={openChannelPost}>
                    📢 Check Our Channel Post
                </button>
            </div>
            
            <Menu />
        </div>
    );
}

export default Gifts;