import { useState, useEffect } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
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
    const address = useTonAddress();
    const [walletConnected, setWalletConnected] = useState(false);
    
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);

    const conversionRate = 0.00001;
    const minConvertAmount = 1000;
    const depositWalletAddress = "UQB_2coQNHxdWZN0b7y9QUy13jLl2XNaN2yPcicFJbCbhSEK";

    // Check wallet connection status
    useEffect(() => {
        const checkConnection = () => {
            const isConnected = !!localStorage.getItem('ton-connect') || !!address;
            setWalletConnected(isConnected);
        };
        
        checkConnection();
        
        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            setWalletConnected(!!wallet);
        });
        
        return () => unsubscribe();
    }, [tonConnectUI, address]);

    // Listen for wallet connection to update userData
    useEffect(() => {
        let unsubscribe;
        
        const handleStatusChange = async (walletInfo) => {
            if (walletInfo && userData) {
                try {
                    const address = walletInfo.account.address;
                    
                    const response = await fetch('https://ton-jacket-backend.netlify.app/.netlify/functions/updateWallet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userData.telegram_user_id,
                            walletAddress: address
                        })
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        updateUserData({
                            ...userData,
                            wallet: address
                        });
                    } else {
                        console.error('Error updating wallet:', result.error);
                    }
                } catch (error) {
                    console.error('Error updating wallet:', error);
                }
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
    }, [tonConnectUI, userData, updateUserData]);

    const handleConvert = async () => {
        const amount = userData?.coins || 0;
        if (amount > 0 && amount >= minConvertAmount) {
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
                    setShowConvertModal(false);
                } else {
                    console.error('Error converting coins:', result.error);
                    alert('Error converting coins: ' + result.error);
                }
            } catch (error) {
                console.error('Error converting coins:', error);
                alert('Error converting coins: ' + error.message);
            }
        }
    };

    const handleWithdraw = async (withdrawAmount, walletAddress) => {
        if (parseFloat(withdrawAmount) > 0 && walletAddress) {
            // Simulate transaction processing
            setTimeout(() => {
                const newTonAmount = userData.ton_amount - parseFloat(withdrawAmount);
                const newWithdrawAmount = userData.withdraw_amount + parseFloat(withdrawAmount);
                
                updateUserData({
                    ...userData,
                    ton_amount: newTonAmount,
                    withdraw_amount: newWithdrawAmount
                });

                setShowWithdrawModal(false);
            }, 2000);
        }
    };

    const handleDepositWithTon = async (depositAmount) => {
        if (!tonConnectUI.connected) {
            tonConnectUI.openModal();
            return;
        }

        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            alert('Please select an amount');
            return;
        }

        setIsDepositing(true);

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
            console.log("Transaction sent:", result);

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
                setShowDepositModal(false);
                alert('TON deposited successfully!');
            } else {
                console.error('Error depositing TON:', resultData.error);
                alert('Error depositing TON: ' + resultData.error);
            }

        } catch (error) {
            console.error('Error sending TON:', error);
            alert('Error sending TON: ' + error.message);
        } finally {
            setIsDepositing(false);
        }
    };

    return (
        <div className="profile-container">
            <BalanceSection />
            
            <UserSection 
                userData={userData}
                walletConnected={walletConnected}
                setWalletConnected={setWalletConnected}
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
            />

            <WithdrawModal 
                show={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                userData={userData}
                onWithdraw={handleWithdraw}
            />

            <DepositModal 
                show={showDepositModal}
                onClose={() => setShowDepositModal(false)}
                userData={userData}
                onDeposit={handleDepositWithTon}
                isDepositing={isDepositing}
            />

            <Menu />
        </div>
    );
}

export default Profile;