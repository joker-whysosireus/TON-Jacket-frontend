import { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import ConvertModal from './Components/Modals/ConvertModal';
import WithdrawModal from './Components/Modals/WithdrawModal';
import DepositModal from './Components/Modals/DepositModal';
import './Profile.css';

function Profile({ userData, updateUserData }) {
    const [tonConnectUI] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress(true);
    const rawAddress = useTonAddress(false);
    const [walletConnected, setWalletConnected] = useState(false);
    
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    
    // Состояния для управления процессом операций
    const [isConverting, setIsConverting] = useState(false);
    const [convertSuccess, setConvertSuccess] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [depositSuccess, setDepositSuccess] = useState(false);

    // Состояния для Confetti
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiOpacity, setConfettiOpacity] = useState(1);
    const [windowDimensions, setWindowDimensions] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });

    const conversionRate = 0.00001;
    const minConvertAmount = 1000;
    
    // Правильный адрес для депозита
    const depositWalletAddress = "UQB_2coQNHxdWZN0b7y9QUy13jLl2XNaN2yPcicFJbCbhSEK";

    // Confetti animation
    const startConfetti = useCallback(() => {
        setShowConfetti(true);
        setConfettiOpacity(1);
        
        setTimeout(() => {
            setConfettiOpacity(0);
        }, 3000);
        
        setTimeout(() => {
            setShowConfetti(false);
        }, 4000);
    }, []);

    // Effect для обновления размеров окна
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check wallet connection status
    useEffect(() => {
        const checkConnection = () => {
            const isConnected = !!localStorage.getItem('ton-connect') || !!rawAddress;
            setWalletConnected(isConnected);
        };
        
        checkConnection();
        
        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            setWalletConnected(!!wallet);
        });
        
        return () => unsubscribe();
    }, [tonConnectUI, rawAddress]);

    // Listen for wallet connection to update userData
    useEffect(() => {
        let unsubscribe;
        
        const handleStatusChange = async (walletInfo) => {
            if (walletInfo && userData) {
                try {
                    const addressToSave = userFriendlyAddress;
                    
                    if (!addressToSave || addressToSave === '' || addressToSave === 'undefined') {
                        console.log("Invalid wallet address, skipping save");
                        return;
                    }

                    if (userData.wallet === addressToSave) {
                        console.log("Wallet address already up to date");
                        return;
                    }

                    console.log("Saving wallet address to database:", addressToSave);

                    const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/updateWallet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userData.telegram_user_id,
                            walletAddress: addressToSave
                        })
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        console.log("Wallet address updated successfully in database");
                        updateUserData({
                            ...userData,
                            wallet: addressToSave
                        });
                    } else {
                        console.error('Error updating wallet in database:', result.error);
                    }
                } catch (error) {
                    console.error('Error updating wallet:', error);
                }
            } else if (!walletInfo && userData) {
                console.log("Wallet disconnected");
                setWalletConnected(false);
            }
        };

        if (tonConnectUI && typeof tonConnectUI.onStatusChange === 'function') {
            unsubscribe = tonConnectUI.onStatusChange(handleStatusChange);
        }

        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [tonConnectUI, userData, updateUserData, userFriendlyAddress]);

    // Дополнительный useEffect для обработки начального подключения
    useEffect(() => {
        if (userFriendlyAddress && userFriendlyAddress !== '' && userData && userData.wallet !== userFriendlyAddress) {
            console.log("Initial wallet connection detected, updating...");
            const updateWallet = async () => {
                try {
                    const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/updateWallet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userData.telegram_user_id,
                            walletAddress: userFriendlyAddress
                        })
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        console.log("Initial wallet address saved successfully");
                        updateUserData({
                            ...userData,
                            wallet: userFriendlyAddress
                        });
                    }
                } catch (error) {
                    console.error('Error saving initial wallet:', error);
                }
            };
            
            updateWallet();
        }
    }, [userFriendlyAddress, userData, updateUserData]);

    const handleConvert = async () => {
        const amount = userData?.coins || 0;
        if (amount > 0 && amount >= minConvertAmount) {
            setIsConverting(true);
            setConvertSuccess(false);

            try {
                const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/convertCoinsToTON', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userData.telegram_user_id,
                        coinsAmount: amount,
                        tonAmount: amount * conversionRate
                    })
                });

                const result = await response.json();
                
                if (response.ok) {
                    updateUserData(result.data);
                    setConvertSuccess(true);
                    startConfetti();
                    
                    setTimeout(() => {
                        setShowConvertModal(false);
                        setIsConverting(false);
                        setConvertSuccess(false);
                    }, 1500);
                } else {
                    setIsConverting(false);
                }
            } catch (error) {
                setIsConverting(false);
            }
        }
    };

    const handleWithdraw = async (withdrawAmount, walletAddress) => {
        if (parseFloat(withdrawAmount) > 0 && walletAddress) {
            setIsWithdrawing(true);
            setWithdrawSuccess(false);
            
            try {
                const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/process-withdraw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userData.telegram_user_id,
                        amount: parseFloat(withdrawAmount),
                        walletAddress: walletAddress
                    })
                });

                const result = await response.json();
                
                if (response.ok) {
                    setWithdrawSuccess(true);
                    startConfetti();
                    
                    setTimeout(() => {
                        setIsWithdrawing(false);
                        setWithdrawSuccess(false);
                        setShowWithdrawModal(false);
                    }, 1500);
                } else {
                    console.error('Error sending withdrawal notification:', result.error);
                    setIsWithdrawing(false);
                }
            } catch (error) {
                console.error('Error sending withdrawal notification:', error);
                setIsWithdrawing(false);
            }
        }
    };

    const handleDepositWithTon = async (depositAmount) => {
        if (!tonConnectUI.connected) {
            setShowDepositModal(false);
            tonConnectUI.openModal();
            return;
        }

        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            return;
        }

        setIsDepositing(true);
        setDepositSuccess(false);

        try {
            const amountInNanotons = (parseFloat(depositAmount) * 1e9).toString();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: depositWalletAddress,
                        amount: amountInNanotons,
                    }
                ]
            };

            const result = await tonConnectUI.sendTransaction(transaction);

            const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/deposit-ton', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.telegram_user_id,
                    amount: parseFloat(depositAmount)
                })
            });

            const resultData = await response.json();

            if (response.ok) {
                updateUserData(resultData.data);
                setDepositSuccess(true);
                startConfetti();
                
                setTimeout(() => {
                    setShowDepositModal(false);
                }, 2000);
            }
        } catch (error) {
            // Игнорируем ошибки отмены пользователем
        } finally {
            setIsDepositing(false);
        }
    };

    // Wallet connection handler
    const handleWalletAction = async () => {
        if (walletConnected) {
            if (window.confirm('Are you sure you want to disconnect your wallet?')) {
                try {
                    await tonConnectUI.disconnect();
                    localStorage.removeItem('ton-connect');
                    localStorage.removeItem('wallet-connected');
                    setWalletConnected(false);
                    await tonConnectUI.connectionRestore.disconnect();
                } catch (error) {
                    console.error('Disconnection failed:', error);
                }
            }
        } else {
            tonConnectUI.openModal();
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return 'Not connected';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    // Иконки как в Figma
    const ArrowUpFromLineIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 9-6-6-6 6"/>
            <path d="M12 3v14"/>
            <path d="M5 21h14"/>
        </svg>
    );

    const ArrowDownToLineIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 17V3"/>
            <path d="m6 11 6 6 6-6"/>
            <path d="M19 21H5"/>
        </svg>
    );

    const RefreshCwIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
        </svg>
    );

    return (
        <div className="profile-container">
            {showConfetti && (
                <div style={{
                    opacity: confettiOpacity,
                    transition: 'opacity 1s ease-out',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 9999
                }}>
                    <Confetti
                        width={windowDimensions.width}
                        height={windowDimensions.height}
                        numberOfPieces={300}
                        gravity={0.5}
                        initialVelocityY={15}
                        recycle={false}
                        run={showConfetti}
                        colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
                    />
                </div>
            )}

            <BalanceSection userData={userData} />

            {/* Header Section как в Figma */}
            <div className="profile-header-section">
                <div className="header-icon">👤</div>
                <p className="header-description">
                    Withdraw TON to your wallet, convert coins to TON, or top up your balance in TON
                </p>
            </div>

            {/* Wallet Connect Button */}
            <div className="wallet-connect-section">
                <button
                    className={`wallet-connect-button ${walletConnected ? 'connected' : 'disconnected'}`}
                    onClick={handleWalletAction}
                >
                    {walletConnected ? formatAddress(userFriendlyAddress) : 'Connect Wallet'}
                </button>
            </div>

            {/* Cards Section как в Figma */}
            <div className="profile-cards-section">
                {/* Withdrawal Card */}
                <div 
                    className="profile-card" 
                    onClick={() => setShowWithdrawModal(true)}
                >
                    <div className="card-content">
                        <div className="card-icon">
                            <ArrowUpFromLineIcon />
                        </div>
                        <div className="card-text">
                            <h3 className="card-title">Withdrawal</h3>
                            <p className="card-description">Withdraw TON to your wallet</p>
                        </div>
                    </div>
                </div>

                {/* Conversion Card */}
                <div 
                    className="profile-card" 
                    onClick={() => setShowConvertModal(true)}
                >
                    <div className="card-content">
                        <div className="card-icon">
                            <RefreshCwIcon />
                        </div>
                        <div className="card-text">
                            <h3 className="card-title">Conversion</h3>
                            <p className="card-description">Convert coins to TON</p>
                        </div>
                    </div>
                </div>

                {/* Top-up Card */}
                <div 
                    className="profile-card" 
                    onClick={() => setShowDepositModal(true)}
                >
                    <div className="card-content">
                        <div className="card-icon">
                            <ArrowDownToLineIcon />
                        </div>
                        <div className="card-text">
                            <h3 className="card-title">Top-up</h3>
                            <p className="card-description">Add TON to your balance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальные окна */}
            <ConvertModal 
                show={showConvertModal}
                onClose={() => setShowConvertModal(false)}
                userData={userData}
                onConvert={handleConvert}
                isConverting={isConverting}
                convertSuccess={convertSuccess}
            />

            <WithdrawModal 
                show={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                userData={userData}
                onWithdraw={handleWithdraw}
                isWithdrawing={isWithdrawing}
                withdrawSuccess={withdrawSuccess}
            />

            <DepositModal 
                show={showDepositModal}
                onClose={() => setShowDepositModal(false)}
                userData={userData}
                onDeposit={handleDepositWithTon}
                isDepositing={isDepositing}
                depositSuccess={depositSuccess}
            />

            <Menu />
        </div>
    );
}

export default Profile;