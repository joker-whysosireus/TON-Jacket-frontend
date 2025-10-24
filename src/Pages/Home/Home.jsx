import { useState, useRef, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import BalanceSection from './Components/Balance/BalanceSection';
import BetResultAndInstruction from './Components/BetResultAndInstruction/BetResultAndInstruction';
import BetModal from './Components/Modals/BetModal';
import InstructionsModal from './Components/Modals/InstructionsModal';
import { translations, formatString } from '../../Assets/Lang/translation';
import './Home.css';

// ОБНОВЛЕННЫЕ КОНСТАНТЫ С УВЕЛИЧЕННЫМИ ШАНСАМИ ВЫИГРЫША
const SYMBOLS_CONFIG = [
  { id: 1, symbol: '🍒', name: 'Cherry', weight: 70, type: 'fruit' },
  { id: 2, symbol: '🍋', name: 'Lemon', weight: 65, type: 'fruit' },
  { id: 3, symbol: '🍊', name: 'Orange', weight: 60, type: 'fruit' },
  { id: 4, symbol: '🍉', name: 'Watermelon', weight: 55, type: 'fruit' },
  { id: 5, symbol: '🔔', name: 'Bell', weight: 40, type: 'bell' },
  { id: 6, symbol: '⭐', name: 'Star', weight: 35, type: 'star' },
  { id: 7, symbol: '🍇', name: 'Grapes', weight: 50, type: 'fruit' },
  { id: 8, symbol: '🔶', name: 'Diamond', weight: 25, type: 'diamond' },
  { id: 9, symbol: '⑦', name: 'Seven', weight: 15, type: 'seven' },
  { id: 10, symbol: '💎', name: 'Premium Diamond', weight: 8, type: 'premium' },
  { id: 11, symbol: '👑', name: 'Crown', weight: 6, type: 'premium' },
  { id: 12, symbol: '💀', name: 'Skull', weight: 10, type: 'skull' },
  { id: 13, symbol: '🔥', name: 'Fire', weight: 5, type: 'special' }
];

const getWinForCombination = (symbols) => {
  const [a, b, c] = symbols;
  
  console.log('🎰 Проверка выигрыша для комбинации:', symbols.join(' '));
  
  // 1. ТРОЙНЫЕ КОМБИНАЦИИ (увеличены шансы)
  if (a === b && b === c) {
    const tripleWins = {
      '🍒': { multiplier: 2, name: 'TRIPLE CHERRY' },
      '🍋': { multiplier: 3, name: 'TRIPLE LEMON' },
      '🍊': { multiplier: 3, name: 'TRIPLE ORANGE' },
      '🍉': { multiplier: 4, name: 'TRIPLE WATERMELON' },
      '🔔': { multiplier: 5, name: 'TRIPLE BELL' },
      '⭐': { multiplier: 4, name: 'TRIPLE STAR' },
      '🍇': { multiplier: 3, name: 'TRIPLE GRAPES' },
      '🔶': { multiplier: 6, name: 'TRIPLE DIAMOND' },
      '⑦': { multiplier: 8, name: 'TRIPLE SEVEN' },
      '💎': { multiplier: 25, name: 'DIAMOND JACKPOT' },
      '👑': { multiplier: 15, name: 'CROWN JACKPOT' },
      '💀': { multiplier: 0, name: 'SKULL BUST' },
      '🔥': { multiplier: 10, name: 'FIRE BONUS' }
    };
    return tripleWins[a] || null;
  }
  
  // 2. СПЕЦИАЛЬНЫЕ КОМБИНАЦИИ (добавлены новые комбинации)
  if (a === '💎' && b === '💎' && c === '⭐') return { multiplier: 5, name: 'DIAMOND STAR' };
  if (a === '👑' && b === '👑' && c === '⭐') return { multiplier: 4, name: 'CROWN STAR' };
  if (a === '⑦' && b === '⑦' && c === '⭐') return { multiplier: 3, name: 'SEVEN STAR' };
  if (a === '🔔' && b === '🔔' && c === '⭐') return { multiplier: 2.5, name: 'BELL STAR' };
  if (a === '🍉' && b === '🍉' && c === '⭐') return { multiplier: 2, name: 'WATERMELON STAR' };
  if (a === '🍇' && b === '🍇' && c === '⭐') return { multiplier: 2, name: 'GRAPES STAR' };
  if (a === '🔶' && b === '🔶' && c === '⭐') return { multiplier: 3, name: 'DIAMOND STAR' };
  
  // 3. ДВОЙНЫЕ КОМБИНАЦИИ (расширены условия)
  if (a === b || a === c || b === c) {
    let doubleSymbol;
    if (a === b) doubleSymbol = a;
    else if (a === c) doubleSymbol = a;
    else doubleSymbol = b;
    
    // УСЛОВИЕ: для некоторых символов двойные комбинации не считаются выигрышными
    if (doubleSymbol === '🍒' || doubleSymbol === '🍋' || doubleSymbol === '🍊') {
      return null;
    }
    
    const doubleWins = {
      '🍉': { multiplier: 0.8, name: 'DOUBLE WATERMELON' },
      '🔔': { multiplier: 1.2, name: 'DOUBLE BELL' },
      '⭐': { multiplier: 0.8, name: 'DOUBLE STAR' },
      '🍇': { multiplier: 0.8, name: 'DOUBLE GRAPES' },
      '🔶': { multiplier: 1.5, name: 'DOUBLE DIAMOND' },
      '⑦': { multiplier: 2, name: 'DOUBLE SEVEN' },
      '💎': { multiplier: 3, name: 'DOUBLE PREMIUM DIAMOND' },
      '👑': { multiplier: 2, name: 'DOUBLE CROWN' },
      '💀': { multiplier: 0, name: 'DOUBLE SKULL' },
      '🔥': { multiplier: 1.5, name: 'DOUBLE FIRE' }
    };
    
    return doubleWins[doubleSymbol] || null;
  }
  
  // 4. ФРУКТОВЫЕ МИКСЫ (увеличен множитель)
  const fruits = ['🍒', '🍋', '🍊', '🍉', '🍇'];
  const isAllFruits = fruits.includes(a) && fruits.includes(b) && fruits.includes(c);
  const uniqueFruits = new Set([a, b, c]);
  
  // Только если все три фрукта РАЗНЫЕ
  if (isAllFruits && uniqueFruits.size === 3) {
    return { multiplier: 1.2, name: 'FRUIT MIX' };
  }
  
  // 5. ЛЮБАЯ КОМБИНАЦИЯ С ОГНЕМ (новая категория выигрышей)
  if (a === '🔥' || b === '🔥' || c === '🔥') {
    const fireCount = [a, b, c].filter(symbol => symbol === '🔥').length;
    if (fireCount === 1) {
      return { multiplier: 0.5, name: 'FIRE BONUS' };
    }
  }
  
  return null;
};

// Остальной код без изменений...
function Home({ userData, updateUserData, isActive, language = 'english' }) {
  const [selectedOption, setSelectedOption] = useState('ton');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  
  // Получаем переводы для текущего языка
  const t = (translations[language] && translations[language].home) ? translations[language].home : translations.english.home;
  const commonT = (translations[language] && translations[language].common) ? translations[language].common : translations.english.common;
  
  const [betResult, setBetResult] = useState(t.welcomeMessage || 'Welcome! Place your bet and spin!');
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
    ton_amount: 0.000,
    coins: 0.000,
    telegram_user_id: null,
    first_name: 'User',
    username: 'user'
  };

  // Функция для обновления статистики
  const updateStatisticsInDB = useCallback(async (betAmount, winAmount, isWin) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('❌ No telegram user ID found');
        return { success: false, error: 'No telegram user ID found' };
      }

      console.log('📊 Updating statistics:', { betAmount, winAmount, isWin });

      const UPDATE_STATISTICS_URL = 'https://ton-jacket-backend.netlify.app/.netlify/functions/update-statistics';
      
      const response = await fetch(UPDATE_STATISTICS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          betAmount: parseFloat(betAmount),
          winAmount: parseFloat(winAmount),
          isWin: isWin
        }),
      });

      console.log('📥 Statistics response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Statistics response data:', data);
      
      if (data.success) {
        console.log('✅ Statistics updated successfully');
        return { success: true };
      } else {
        console.error('❌ Error from update-statistics function:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error updating statistics:', error);
      return { success: false, error: error.message };
    }
  }, [safeUserData]);

  // Функция для увеличения bet_amount в базе данных
  const updateBetAmountInDB = useCallback(async (amount) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('❌ No telegram user ID found');
        return { success: false, error: 'No telegram user ID found' };
      }

      console.log('📤 Sending bet update request:', {
        telegramUserId,
        betAmount: amount
      });

      const UPDATE_BET_URL = 'https://ton-jacket-backend.netlify.app/.netlify/functions/update-bet';
      
      const response = await fetch(UPDATE_BET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          betAmount: parseFloat(amount.toFixed(3))
        }),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        console.log('✅ Bet amount updated successfully');
        return { success: true };
      } else {
        console.error('❌ Error from update-bet function:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error updating bet amount:', error);
      return { success: false, error: error.message };
    }
  }, [safeUserData]);

  // Функция для увеличения coins в базе данных
  const updateCoinsInDB = useCallback(async (coinsToAdd = 50) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('❌ No telegram user ID found');
        return { success: false, error: 'No telegram user ID found' };
      }

      console.log('📤 Sending coins update request:', {
        telegramUserId,
        coinsToAdd
      });

      const UPDATE_COINS_URL = 'https://ton-jacket-backend.netlify.app/.netlify/functions/update-coins';
      
      const response = await fetch(UPDATE_COINS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramUserId: telegramUserId,
          coinsToAdd: coinsToAdd
        }),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        console.log('✅ Coins updated successfully');
        return { success: true };
      } else {
        console.error('❌ Error from update-coins function:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error updating coins:', error);
      return { success: false, error: error.message };
    }
  }, [safeUserData]);

  // Функция для обновления TON баланса в базе данных
  const updateTonAmountInDB = useCallback(async (tonChange) => {
    try {
      const telegramUserId = safeUserData?.telegram_user_id;
      
      if (!telegramUserId) {
        console.error('❌ No telegram user ID found');
        return { success: false, error: 'No telegram user ID found' };
      }

      console.log('📤 Sending TON update request:', {
        telegramUserId,
        tonChange
      });

      const UPDATE_TON_URL = 'https://ton-jacket-backend.netlify.app/.netlify/functions/update-ton';
      
      const response = await fetch(UPDATE_TON_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: telegramUserId,
          tonAmount: tonChange
        }),
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        console.log('✅ TON amount updated successfully');
        return { success: true };
      } else {
        console.error('❌ Error from update-ton function:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error updating TON amount:', error);
      return { success: false, error: error.message };
    }
  }, [safeUserData]);

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

  // Обработчик нажатия на кнопку Spin
  const handleSpinClick = useCallback(() => {
    console.log('🔄 Кнопка Spin нажата');
    if (isSpinning || selectedOption === 'gifts') return;
    
    if (selectedOption === 'ton') {
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
    setBetResult(t.spinning || 'Spinning...');
    setShowConfetti(false);

    // Проверяем баланс перед ставкой
    if (selectedOption === 'ton') {
      if (betAmount > safeUserData.ton_amount) {
        setBetResult(t.notEnoughTON || 'Not enough TON for this bet!');
        setIsSpinning(false);
        return;
      }
    }

    try {
      // 1. Обновляем bet_amount в базе данных (увеличиваем на сумму ставки)
      const betResult = await updateBetAmountInDB(betAmount);
      if (!betResult.success) {
        setBetResult('Error updating bet: ' + betResult.error);
        setIsSpinning(false);
        return;
      }

      // Простая анимация - просто меняем символы несколько раз
      const spinDuration = 2000;
      const symbolChangeInterval = 100;
      let elapsedTime = 0;
      
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
          
          const processResult = async () => {
            try {
              let winAmount = 0;
              let isWin = false;
              let netWin = 0;

              if (winCombination) {
                if (winCombination.multiplier === 0) {
                  // ПРОИГРЫШ - уменьшаем TON баланс на сумму ставки
                  const bustMessage = formatString(t.bustMessage || 'BUST! {name} - you lose your bet!', { name: winCombination.name });
                  setBetResult(bustMessage);
                  await updateTonAmountInDB(-betAmount);
                  // Обновляем статистику - проигрыш
                  await updateStatisticsInDB(betAmount, 0, false);
                } else {
                  // ВЫИГРЫШ - увеличиваем TON баланс на чистый выигрыш
                  winAmount = winCombination.multiplier * betAmount;
                  netWin = winAmount - betAmount; // Чистый выигрыш
                  const winMessage = formatString(t.winMessage || 'Win! {name} x{multiplier} ({amount} TON)', { 
                    name: winCombination.name, 
                    multiplier: winCombination.multiplier, 
                    amount: winAmount.toFixed(2) 
                  });
                  setBetResult(winMessage);
                  
                  await updateTonAmountInDB(netWin);
                  // Обновляем статистику - выигрыш
                  await updateStatisticsInDB(betAmount, winAmount, true);
                  startConfetti();
                  isWin = true;
                }
              } else {
                // ПРОИГРЫШ - уменьшаем TON баланс на сумму ставки
                setBetResult(t.noWinMessage || 'No win this time. Try again!');
                await updateTonAmountInDB(-betAmount);
                // Обновляем статистику - проигрыш
                await updateStatisticsInDB(betAmount, 0, false);
              }
              
              // 3. Увеличиваем coins на 50 после прокрутки
              await updateCoinsInDB(50);
              
              // Обновляем данные пользователя
              if (updateUserData) {
                await updateUserData();
              }
              
              // Сбрасываем предопределенные символы
              setNextSpinSymbols(null);
              setIsSpinning(false);
            } catch (error) {
              console.error('❌ Error processing result:', error);
              const errorMessage = formatString(t.errorProcessing || 'Error processing result: {error}', { error: error.message });
              setBetResult(errorMessage);
              setIsSpinning(false);
            }
          };

          processResult();
        }
      }, symbolChangeInterval);
    } catch (error) {
      console.error('❌ Error during spin process:', error);
      const errorMessage = formatString(t.errorDuringSpin || 'Error during spin: {error}', { error: error.message });
      setBetResult(errorMessage);
      setIsSpinning(false);
    }
  }, [
    isSpinning, 
    nextSpinSymbols, 
    selectedOption, 
    betAmount, 
    safeUserData, 
    updateUserData, 
    getRandomSymbol, 
    startConfetti,
    updateBetAmountInDB,
    updateTonAmountInDB,
    updateCoinsInDB,
    updateStatisticsInDB,
    t
  ]);

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
    setNextSpinSymbols(null);
  }, []);

  const handleBetConfirm = useCallback(() => {
    console.log('✅ Подтверждение ставки с предопределенными символами:', nextSpinSymbols);
    if (betAmount <= 0) {
      setBetResult(t.pleaseSelectValidBet || 'Please select a valid bet amount');
      return;
    }
    
    if (betAmount > safeUserData.ton_amount) {
      setBetResult(t.notEnoughTON || 'Not enough TON for this bet!');
      return;
    }
    
    handleCloseBetModal();
    setTimeout(() => {
      spinSlotMachine();
    }, 300);
  }, [betAmount, safeUserData.ton_amount, handleCloseBetModal, spinSlotMachine, nextSpinSymbols, t]);

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

  if (!t) {
    console.error('Translation not found for language:', language);
    return <div>Error loading translations</div>;
  }

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
        language={language}
      />

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

      <BetResultAndInstruction 
        betResult={betResult} 
        language={language}
      />

      <button 
        className="instructions-button"
        onClick={handleInstructionsClick}
      >
        {commonT.instructions}
      </button>

      <div className="choice-buttons">
        <button 
          className={`choice-btn ${selectedOption === 'ton' ? 'active' : ''}`}
          onClick={() => setSelectedOption('ton')}
        >
          {commonT.spinOnTON}
        </button>
        <button 
          className={`choice-btn ${selectedOption === 'gifts' ? 'active' : ''}`}
          onClick={() => setSelectedOption('gifts')}
        >
          {commonT.spinOnGifts}
        </button>
      </div>

      <button 
        className={`spin-go-button ${isSpinning ? 'spinning' : ''} ${selectedOption === 'gifts' ? 'coming-soon' : ''}`}
        onClick={handleSpinClick}
        disabled={isSpinning || selectedOption === 'gifts'}
      >
        {selectedOption === 'gifts' ? (
          t.comingSoon
        ) : isSpinning ? (
          <>
            <div className="spinner"></div>
            {t.spinning}
          </>
        ) : (
          t.spinButton
        )}
      </button>

      <InstructionsModal 
        showInstructions={showInstructions} 
        onClose={handleCloseInstructions}
        language={language}
      />
      
      <BetModal 
        showBetModal={showBetModal}
        betAmount={betAmount}
        userData={safeUserData}
        onClose={handleCloseBetModal}
        onConfirm={handleBetConfirm}
        onBetChange={handleBetButtonClick}
        language={language}
      />
      
      <Menu language={language} />
    </div>
  );
}

export default Home;