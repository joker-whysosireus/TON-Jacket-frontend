import { useRef, useEffect } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import './UserSection.css';

function UserSection({ userData, walletConnected, setWalletConnected }) {
    const [tonConnectUI] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress(true);
    const buttonRef = useRef(null);

    const handleWalletAction = async () => {
        if (walletConnected) {
            if (window.confirm('Are you sure you want to disconnect your wallet?')) {
                await cleanDisconnect();
            }
        } else {
            tonConnectUI.openModal();
        }
    };

    const cleanDisconnect = async () => {
        try {
            await tonConnectUI.disconnect();
            localStorage.removeItem('ton-connect');
            localStorage.removeItem('wallet-connected');
            setWalletConnected(false);
            await tonConnectUI.connectionRestore.disconnect();
        } catch (error) {
            console.error('Disconnection failed:', error);
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return 'Not connected';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    useEffect(() => {
        if (!buttonRef.current) return;
        buttonRef.current.classList.toggle('connected', walletConnected);
        buttonRef.current.classList.toggle('disconnected', !walletConnected);
    }, [walletConnected]);

    return (
        <div className="user-section">
            <div className="user-info">
                <div className="avatar">
                    {userData?.avatar ? (
                        <img src={userData.avatar} alt="Avatar" className="avatar-img" />
                    ) : (
                        <div className="avatar-default">
                            {userData?.first_name?.[0] || 'U'}
                        </div>
                    )}
                </div>
                
                <div className="user-details">
                    <div className="name">
                        {userData?.first_name || 'No name'}
                    </div>
                    
                    <div className="username">
                        @{userData?.username || 'nousername'}
                    </div>
                </div>
            </div>

            <div className="ton-connect-container">
                <button
                    className="ton-connect-button"
                    onClick={handleWalletAction}
                    ref={buttonRef}
                >
                    {walletConnected ? formatAddress(userFriendlyAddress) : 'Connect Wallet'}
                </button>
            </div>
        </div>
    );
}

export default UserSection;