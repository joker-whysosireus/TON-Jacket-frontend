import { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from '../Home/Components/Balance/BalanceSection';
import UserSection from './Components/User/UserSection';
import WalletStats from './Components/Wallet/WalletStats';
import ActionCards from './Components/Cards/ActionCards';
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

    // Listen for wallet connection to update userData - ИСПРАВЛЕННЫЙ useEffect
    useEffect(() => {
        let unsubscribe;
        
        const handleStatusChange = async (walletInfo) => {
            if (walletInfo && userData) {
                try {
                    // Используем user-friendly адрес для сохранения в базу данных
                    const addressToSave = userFriendlyAddress;
                    
                    // Проверяем, что адрес валидный и не пустой
                    if (!addressToSave || addressToSave === '' || addressToSave === 'undefined') {
                        console.log("Invalid wallet address, skipping save");
                        return;
                    }

                    // Проверяем, не совпадает ли текущий адрес с уже сохраненным
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
                // Если кошелек отключен, обновляем состояние
                console.log("Wallet disconnected");
                setWalletConnected(false);
            }
        };

        // Подписываемся на изменения статуса кошелька
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
                    startConfetti(); // Добавляем конфетти для конвертации
                    
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
                // Отправляем запрос на обработку вывода
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
                    // Обновляем данные пользователя
                    updateUserData(result.data);
                    setWithdrawSuccess(true);
                    startConfetti(); // Добавляем конфетти для вывода
                    
                    // Ждем 1.5 секунды перед закрытием
                    setTimeout(() => {
                        setIsWithdrawing(false);
                        setWithdrawSuccess(false);
                        setShowWithdrawModal(false);
                    }, 1500);
                } else {
                    console.error('Error processing withdrawal:', result.error);
                    setIsWithdrawing(false);
                }
            } catch (error) {
                console.error('Error processing withdrawal:', error);
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
            // Игнорируем ошибки отмены пользователем, остальные ошибки просто не показываем
        } finally {
            setIsDepositing(false);
        }
    };

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
            
            <UserSection 
                userData={userData}
                walletConnected={walletConnected}
                setWalletConnected={setWalletConnected}
                userFriendlyAddress={userFriendlyAddress}
            />

            <div className="wallet-interface">
                <div className="wallet-content">
                    <WalletStats userData={userData} />
                    
                    <ActionCards 
                        setShowConvertModal={setShowConvertModal}
                        setShowWithdrawModal={setShowWithdrawModal}
                        setShowDepositModal={setShowDepositModal}
                    />
                </div>
            </div>

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