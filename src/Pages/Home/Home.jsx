import { useState, useRef, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from './Components/Balance/BalanceSection';
import BetResultAndInstruction from './Components/BetResultAndInstruction/BetResultAndInstruction';
import BetModal from './Components/Modals/BetModal';
import InstructionsModal from './Components/Modals/InstructionsModal';

import './Home.css';

// Константы
const SYMBOLS_CONFIG = [
  { id: 1, symbol: '🍒', name: 'Cherry', weight: 35, type: 'fruit' },
  { id: 2, symbol: '🍋', name: 'Lemon', weight: 30, type: 'fruit' },
  { id: 3, symbol: '🍊', name: 'Orange', weight: 25, type: 'fruit' },
  { id: 4, symbol: '🍉', name: 'Watermelon', weight: 20, type: 'fruit' },
  { id: 5, symbol: '🔔', name: 'Bell', weight: 18, type: 'bell' },
  { id: 6, symbol: '⭐', name: 'Star', weight: 15, type: 'star' },
  { id: 7, symbol: '🍇', name: 'Grapes', weight: 12, type: 'fruit' },
  { id: 8, symbol: '🔶', name: 'Diamond', weight: 10, type: 'diamond' },
  { id: 9, symbol: '⑦', name: 'Seven', weight: 8, type: 'seven' },
  { id: 10, symbol: '💎', name: 'Premium Diamond', weight: 6, type: 'premium' },
  { id: 11, symbol: '👑', name: 'Crown', weight: 4, type: 'premium' },
  { id: 12, symbol: '💀', name: 'Skull', weight: 2, type: 'skull' },
  { id: 13, symbol: '🔥', name: 'Fire', weight: 1, type: 'special' }
];

const getWinForCombination = (symbols) => {
  const [a, b, c] = symbols;
  
  console.log('🎰 Проверка выигрыша для комбинации:', symbols.join(' '));
  
  // 1. ТРОЙНЫЕ КОМБИНАЦИИ
  if (a === b && b === c) {
    const tripleWins = {
      '🍒': { multiplier: 5, name: 'TRIPLE CHERRY' },
      '🍋': { multiplier: 8, name: 'TRIPLE LEMON' },
      '🍊': { multiplier: 10, name: 'TRIPLE ORANGE' },
      '🍉': { multiplier: 15, name: 'TRIPLE WATERMELON' },
      '🔔': { multiplier: 30, name: 'TRIPLE BELL' },
      '⭐': { multiplier: 25, name: 'TRIPLE STAR' },
      '🍇': { multiplier: 20, name: 'TRIPLE GRAPES' },
      '🔶': { multiplier: 40, name: 'TRIPLE DIAMOND' },
      '⑦': { multiplier: 50, name: 'TRIPLE SEVEN' },
      '💎': { multiplier: 200, name: 'DIAMOND JACKPOT' },
      '👑': { multiplier: 100, name: 'CROWN JACKPOT' },
      '💀': { multiplier: 0, name: 'SKULL BUST' },
      '🔥': { multiplier: 75, name: 'FIRE BONUS' }
    };
    return tripleWins[a] || null;
  }
  
  // 2. СПЕЦИАЛЬНЫЕ КОМБИНАЦИИ
  if (a === '💎' && b === '💎' && c === '⭐') return { multiplier: 15, name: 'DIAMOND STAR' };
  if (a === '👑' && b === '👑' && c === '⭐') return { multiplier: 12, name: 'CROWN STAR' };
  if (a === '⑦' && b === '⑦' && c === '⭐') return { multiplier: 10, name: 'SEVEN STAR' };
  if (a === '🔔' && b === '🔔' && c === '⭐') return { multiplier: 8, name: 'BELL STAR' };
  
  // 3. ДВОЙНЫЕ КОМБИНАЦИИ
  if (a === b || a === c || b === c) {
    let doubleSymbol;
    if (a === b) doubleSymbol = a;
    else if (a === c) doubleSymbol = a;
    else doubleSymbol = b;
    
    const doubleWins = {
      '🍒': { multiplier: 2, name: 'DOUBLE CHERRY' },
      '🍋': { multiplier: 2, name: 'DOUBLE LEMON' },
      '🍊': { multiplier: 2, name: 'DOUBLE ORANGE' },
      '🍉': { multiplier: 2, name: 'DOUBLE WATERMELON' },
      '🔔': { multiplier: 2.5, name: 'DOUBLE BELL' },
      '⭐': { multiplier: 2, name: 'DOUBLE STAR' },
      '🍇': { multiplier: 2, name: 'DOUBLE GRAPES' },
      '🔶': { multiplier: 3, name: 'DOUBLE DIAMOND' },
      '⑦': { multiplier: 4, name: 'DOUBLE SEVEN' },
      '💎': { multiplier: 8, name: 'DOUBLE PREMIUM DIAMOND' },
      '👑': { multiplier: 6, name: 'DOUBLE CROWN' },
      '💀': { multiplier: 0, name: 'DOUBLE SKULL' },
      '🔥': { multiplier: 5, name: 'DOUBLE FIRE' }
    };
    
    return doubleWins[doubleSymbol] || null;
  }
  
  // 4. ФРУКТОВЫЕ МИКСЫ
  const fruits = ['🍒', '🍋', '🍊', '🍉', '🍇'];
  const isAllFruits = fruits.includes(a) && fruits.includes(b) && fruits.includes(c);
  const uniqueFruits = new Set([a, b, c]);
  
  if (isAllFruits && uniqueFruits.size === 3) {
    return { multiplier: 1.5, name: 'FRUIT MIX' };
  }
  
  return null;
};

function Home({ userData, updateUserData, isActive }) {
  const [selectedOption, setSelectedOption] = useState('ton');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betResult, setBetResult] = useState('Welcome! Place your bet and spin!');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [betAmount, setBetAmount] = useState(0.1);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  
  const [currentSymbols, setCurrentSymbols] = useState(['🍒', '🍒', '🍒']);
  const [nextSpinSymbols, setNextSpinSymbols] = useState(null);
  
  const animationRef = useRef(null);

  const safeUserData = userData || {
    ton_amount: 100.000,
    coins: 500.000,
    telegram_user_id: null,
    first_name: 'User',
    username: 'user'
  };

  // Функция для увеличения bet_amount в базе данных
  const updateBetAmountInDB = async (amount) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('No telegram user ID found');
        return false;
      }

      const response = await fetch('/.netlify/functions/update-bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          betAmount: amount
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Bet amount updated successfully');
        if (updateUserData) {
          await updateUserData();
        }
        return true;
      } else {
        console.error('Error updating bet amount:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating bet amount:', error);
      return false;
    }
  };

  // Функция для увеличения coins в базе данных
  const updateCoinsInDB = async (coinsToAdd = 100) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('No telegram user ID found');
        return false;
      }

      const response = await fetch('/.netlify/functions/update-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          coinsToAdd: coinsToAdd
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Coins updated successfully');
        if (updateUserData) {
          await updateUserData();
        }
        return true;
      } else {
        console.error('Error updating coins:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating coins:', error);
      return false;
    }
  };

  // Create symbols pool with weights
  const symbolsPool = useCallback(() => {
    const pool = [];
    SYMBOLS_CONFIG.forEach(symbolConfig => {
      for (let i = 0; i < symbolConfig.weight; i++) {
        pool.push(symbolConfig.symbol);
      }
    });
    return pool;
  }, []);

  const getRandomSymbol = useCallback(() => {
    const pool = symbolsPool();
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }, [symbolsPool]);

  // Генерация случайных символов для следующего вращения
  const generateNextSpinSymbols = useCallback(() => {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  }, [getRandomSymbol]);

  // Balance management
  const addBalance = useCallback((type, amount) => {
    if (updateUserData && safeUserData) {
      const newData = {
        ...safeUserData,
        [type === 'ton' ? 'ton_amount' : 'coins']: 
          parseFloat((safeUserData[type === 'ton' ? 'ton_amount' : 'coins'] + amount).toFixed(3))
      };
      updateUserData(newData);
    }
  }, [safeUserData, updateUserData]);

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

  // Обработчик нажатия на кнопку Spin - ОПРЕДЕЛЯЕМ СИМВОЛЫ ДО СТАВКИ
  const handleSpinClick = useCallback(() => {
    console.log('🔄 Кнопка Spin нажата');
    if (isSpinning || selectedOption === 'gifts') return;
    
    if (selectedOption === 'ton') {
      // Генерируем символы для следующего вращения ДО открытия модального окна
      const symbols = generateNextSpinSymbols();
      console.log('🎯 ПРЕДОПРЕДЕЛЕННЫЕ СИМВОЛЫ:', symbols);
      setNextSpinSymbols(symbols);
      setShowBetModal(true);
    }
  }, [isSpinning, selectedOption, generateNextSpinSymbols]);

  // ПРОСТАЯ АНИМАЦИЯ БЕЗ DOM MANIPULATION
  const spinSlotMachine = useCallback(async () => {
    if (isSpinning || !nextSpinSymbols) return;
    
    console.log('🎮 НАЧАЛО ВРАЩЕНИЯ С ПРЕДОПРЕДЕЛЕННЫМИ СИМВОЛАМИ:', nextSpinSymbols);
    setIsSpinning(true);
    setBetResult('Spinning...');
    setShowConfetti(false);

    // Обновляем bet_amount в базе данных
    const betUpdated = await updateBetAmountInDB(betAmount);
    if (!betUpdated) {
      setBetResult('Error updating bet. Please try again.');
      setIsSpinning(false);
      return;
    }

    if (selectedOption === 'ton') {
      if (betAmount > safeUserData.ton_amount) {
        setBetResult('Not enough TON for this bet!');
        setIsSpinning(false);
        return;
      }
      if (updateUserData) {
        updateUserData({
          ...safeUserData,
          ton_amount: parseFloat((safeUserData.ton_amount - betAmount).toFixed(3))
        });
      }
    }

    // Простая анимация - просто меняем символы несколько раз
    const spinDuration = 2000;
    const symbolChangeInterval = 100;
    let elapsedTime = 0;
    
    // Сохраняем ссылку на анимацию для возможности отмены
    animationRef.current = setInterval(() => {
      elapsedTime += symbolChangeInterval;
      
      // Генерируем случайные символы для анимации
      const randomSymbols = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setCurrentSymbols(randomSymbols);
      
      if (elapsedTime >= spinDuration) {
        // Завершаем анимацию и показываем ПРЕДОПРЕДЕЛЕННЫЕ символы
        clearInterval(animationRef.current);
        setCurrentSymbols(nextSpinSymbols);
        
        console.log('✅ АНИМАЦИЯ ЗАВЕРШЕНА, ПОКАЗЫВАЕМ ПРЕДОПРЕДЕЛЕННЫЕ СИМВОЛЫ:', nextSpinSymbols);
        
        // Проверяем выигрыш для ПРЕДОПРЕДЕЛЕННЫХ символов
        const winCombination = getWinForCombination(nextSpinSymbols);
        
        if (winCombination) {
          if (winCombination.multiplier === 0) {
            setBetResult('BUST! ' + winCombination.name + ' - you lose your bet!');
          } else {
            const winAmount = winCombination.multiplier * betAmount;
            setBetResult(`Win! ${winCombination.name} x${winCombination.multiplier} (${winAmount.toFixed(2)} TON)`);
            
            if (updateUserData) {
              updateUserData({
                ...safeUserData,
                ton_amount: parseFloat((safeUserData.ton_amount + winAmount).toFixed(3))
              });
            }
            startConfetti();
          }
        } else {
          setBetResult('No win this time. Try again!');
        }
        
        // Увеличиваем coins после прокрутки
        updateCoinsInDB(100);
        
        // Сбрасываем предопределенные символы
        setNextSpinSymbols(null);
        setIsSpinning(false);
      }
    }, symbolChangeInterval);
  }, [isSpinning, nextSpinSymbols, selectedOption, betAmount, safeUserData, updateUserData, getRandomSymbol, startConfetti]);

  // Очистка анимации при размонтировании
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Обработчики кнопок
  const handleInstructionsClick = useCallback(() => {
    console.log('📖 Кнопка Instructions нажата');
    setShowInstructions(true);
  }, []);

  const handleCloseBetModal = useCallback(() => {
    setShowBetModal(false);
    // При закрытии модалки сбрасываем предопределенные символы
    setNextSpinSymbols(null);
  }, []);

  const handleBetConfirm = useCallback(() => {
    console.log('✅ Подтверждение ставки с предопределенными символами:', nextSpinSymbols);
    if (betAmount <= 0) {
      setBetResult('Please select a valid bet amount');
      return;
    }
    
    if (betAmount > safeUserData.ton_amount) {
      setBetResult('Not enough TON for this bet!');
      return;
    }
    
    handleCloseBetModal();
    setTimeout(() => {
      spinSlotMachine();
    }, 300);
  }, [betAmount, safeUserData.ton_amount, handleCloseBetModal, spinSlotMachine, nextSpinSymbols]);

  const handleBetButtonClick = useCallback((amount) => {
    console.log('💰 Изменение ставки на:', amount);
    setBetAmount(amount);
  }, []);

  const handleCloseInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  // Effect для блокировки скролла
  useEffect(() => {
    if (showInstructions || showBetModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [showInstructions, showBetModal]);

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

  // Effect для сохранения символов
  useEffect(() => {
    localStorage.setItem('slotMachineSymbols', JSON.stringify(currentSymbols));
  }, [currentSymbols]);

  // Effect для загрузки символов
  useEffect(() => {
    const savedSymbols = localStorage.getItem('slotMachineSymbols');
    if (savedSymbols) {
      try {
        const parsedSymbols = JSON.parse(savedSymbols);
        if (Array.isArray(parsedSymbols) && parsedSymbols.length === 3) {
          setCurrentSymbols(parsedSymbols);
        }
      } catch (error) {
        console.error('Error loading saved symbols:', error);
      }
    }
  }, []);

  return (
    <div className="container">
      {showConfetti && (
        <div style={{
          opacity: confettiOpacity,
          transition: 'opacity 1s ease-out',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
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

      <BalanceSection 
        userData={safeUserData} 
        onAddBalance={addBalance} 
      />

      {/* Слот-машина остается в Home */}
      <div className="slot-machine">
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div key={index} className="reel-container">
              <div className="reel">
                <div className="reel-strip">
                  <div className="symbol">{currentSymbols[index]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="slot-frame">
          <div className="pay-line"></div>
        </div>
        <div className="slot-overlay"></div>
      </div>

      <BetResultAndInstruction betResult={betResult} />

      {/* Кнопки остаются в Home */}
      <button 
        className="instructions-button"
        onClick={handleInstructionsClick}
      >
        📖 Instructions
      </button>

      <div className="choice-buttons">
        <button 
          className={`choice-btn ${selectedOption === 'ton' ? 'active' : ''}`}
          onClick={() => setSelectedOption('ton')}
        >
          Spin on TON
        </button>
        <button 
          className={`choice-btn ${selectedOption === 'gifts' ? 'active' : ''}`}
          onClick={() => setSelectedOption('gifts')}
        >
          Spin on Gifts
        </button>
      </div>

      <button 
        className={`spin-go-button ${isSpinning ? 'spinning' : ''} ${selectedOption === 'gifts' ? 'coming-soon' : ''}`}
        onClick={handleSpinClick}
        disabled={isSpinning || selectedOption === 'gifts'}
      >
        {selectedOption === 'gifts' ? (
          'Coming soon'
        ) : isSpinning ? (
          <>
            <div className="spinner"></div>
            Spinning...
          </>
        ) : (
          'SPIN'
        )}
      </button>

      <InstructionsModal 
        showInstructions={showInstructions} 
        onClose={handleCloseInstructions} 
      />
      
      <BetModal 
        showBetModal={showBetModal}
        betAmount={betAmount}
        userData={safeUserData}
        onClose={handleCloseBetModal}
        onConfirm={handleBetConfirm}
        onBetChange={handleBetButtonClick}
      />
      
      <Menu />
    </div>
  );
}

export default Home;