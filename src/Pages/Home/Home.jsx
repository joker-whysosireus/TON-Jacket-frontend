import { useState, useRef, useEffect } from 'react';
import Menu from '../../Assets/Menus/Menu/Menu';
import './Home.css';

// Конфигурация символов и выплат
const SYMBOLS_CONFIG = [
  { symbol: '🍒', name: 'Cherry', weight: 40 },
  { symbol: '🍋', name: 'Lemon', weight: 30 },
  { symbol: '🍊', name: 'Orange', weight: 20 },
  { symbol: '🔔', name: 'Bell', weight: 15 },
  { symbol: '⭐', name: 'Star', weight: 10 },
  { symbol: '⑦', name: 'Seven', weight: 5 },
  { symbol: 'BAR', name: 'BAR', weight: 3 },
  { symbol: '💎', name: 'Diamond', weight: 1 }
];

const PAYTABLE = {
  '💎,💎,💎': { multiplier: 50, name: 'DIAMOND JACKPOT' },
  '⑦,⑦,⑦': { multiplier: 25, name: 'TRIPLE SEVEN' },
  'BAR,BAR,BAR': { multiplier: 15, name: 'TRIPLE BAR' },
  '🔔,🔔,🔔': { multiplier: 10, name: 'TRIPLE BELL' },
  '⭐,⭐,⭐': { multiplier: 8, name: 'TRIPLE STAR' },
  '🍊,🍊,🍊': { multiplier: 5, name: 'TRIPLE ORANGE' },
  '🍋,🍋,🍋': { multiplier: 3, name: 'TRIPLE LEMON' },
  '🍒,🍒,🍒': { multiplier: 2, name: 'TRIPLE CHERRY' },
  '🍒,🍒': { multiplier: 1, name: 'DOUBLE CHERRY' }
};

const GIFTS_TABLE = {
  '💎,💎,💎': { gift: 'Premium Smartphone', value: '💰 High Value' },
  '⑦,⑦,⑦': { gift: 'Gaming Console', value: '💰 High Value' },
  'BAR,BAR,BAR': { gift: 'Wireless Headphones', value: '💰 Medium Value' },
  '🔔,🔔,🔔': { gift: 'Smart Watch', value: '💰 Medium Value' },
  '⭐,⭐,⭐': { gift: 'Bluetooth Speaker', value: '💰 Medium Value' },
  '🍊,🍊,🍊': { gift: 'Gift Card $50', value: '💰 Low Value' },
  '🍋,🍋,🍋': { gift: 'Branded T-Shirt', value: '💰 Low Value' },
  '🍒,🍒,🍒': { gift: 'Coffee Mug', value: '💰 Low Value' },
  '🍒,🍒': { gift: 'Sticker Pack', value: '💰 Small Value' }
};

function Home() {
  const [selectedOption, setSelectedOption] = useState('ton');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [betResult, setBetResult] = useState('Waiting for bet result...');
  
  const reelsRef = [useRef(null), useRef(null), useRef(null)];
  const symbolsPool = [];

  // Создаем пул символов с учетом весов
  SYMBOLS_CONFIG.forEach(symbolConfig => {
    for (let i = 0; i < symbolConfig.weight; i++) {
      symbolsPool.push(symbolConfig.symbol);
    }
  });

  const getRandomSymbol = () => {
    const randomIndex = Math.floor(Math.random() * symbolsPool.length);
    return symbolsPool[randomIndex];
  };

  const checkWinningCombinations = (results) => {
    const resultString = results.join(',');
    let winAmount = 0;
    let winName = '';
    let gift = null;
    
    if (selectedOption === 'ton' && PAYTABLE[resultString]) {
      winAmount = PAYTABLE[resultString].multiplier;
      winName = PAYTABLE[resultString].name;
    } else if (selectedOption === 'gifts' && GIFTS_TABLE[resultString]) {
      gift = GIFTS_TABLE[resultString];
      winName = gift.gift;
    }
    
    if (results[0] === '🍒' && results[1] === '🍒') {
      if (selectedOption === 'ton') {
        const twoCherryWin = PAYTABLE['🍒,🍒'];
        if (twoCherryWin && twoCherryWin.multiplier > winAmount) {
          winAmount = twoCherryWin.multiplier;
          winName = twoCherryWin.name;
        }
      } else if (selectedOption === 'gifts') {
        const twoCherryGift = GIFTS_TABLE['🍒,🍒'];
        if (twoCherryGift) {
          gift = twoCherryGift;
          winName = gift.gift;
        }
      }
    }

    if (winAmount > 0 || gift) {
      setLastWin({ 
        amount: winAmount, 
        name: winName, 
        gift: gift,
        type: selectedOption 
      });
      setBetResult(selectedOption === 'ton' ? `Won: ${winName} (x${winAmount})` : `Won: ${gift.gift}`);
      return winAmount;
    }
    
    setLastWin(null);
    setBetResult('No win this time. Try again!');
    return 0;
  };

  const spinSlotMachine = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);
    setBetResult('Spinning...');

    const finalResults = [];
    const spinDurations = [2000, 2200, 2400];

    reelsRef.forEach((reel, index) => {
      const reelElement = reel.current;
      if (!reelElement) return;

      const finalSymbol = getRandomSymbol();
      finalResults[index] = finalSymbol;

      // Сбрасываем анимацию
      reelElement.style.animation = 'none';
      reelElement.offsetHeight;

      // Запускаем улучшенную анимацию вращения
      setTimeout(() => {
        reelElement.style.animation = `smoothReelSpin ${spinDurations[index]}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      }, 50);

      setTimeout(() => {
        reelElement.style.animation = 'none';
        reelElement.textContent = finalSymbol;
        reelElement.classList.add('symbol-land');
        setTimeout(() => {
          reelElement.classList.remove('symbol-land');
        }, 500);

        if (index === reelsRef.length - 1) {
          setTimeout(() => {
            const winAmount = checkWinningCombinations(finalResults);
            setIsSpinning(false);
            
            if (winAmount > 0) {
              reelsRef.forEach((reelRef) => {
                if (reelRef.current) {
                  reelRef.current.classList.add('win-animation');
                  setTimeout(() => {
                    if (reelRef.current) reelRef.current.classList.remove('win-animation');
                  }, 1000);
                }
              });
            }
          }, 600);
        }
      }, spinDurations[index]);
    });
  };

  const InstructionsModal = () => {
    if (!showInstructions) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowInstructions(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🎰 How to Play</h2>
            <span className="modal-close" onClick={() => setShowInstructions(false)}>×</span>
          </div>
          <div className="modal-body">
            <div className="instructions-list">
              <div className="instruction-item">
                <strong>1. Choose your game mode:</strong>
                <ul>
                  <li><strong>Spin on TON:</strong> Play with TON cryptocurrency</li>
                  <li><strong>Spin on Gifts:</strong> Play for gifts and prizes</li>
                </ul>
              </div>
              <div className="instruction-item">
                <strong>2. Click SPIN to start:</strong>
                <p>The reels will spin and stop automatically after a few seconds</p>
              </div>
              <div className="instruction-item">
                <strong>3. Winning combinations:</strong>
                <div className="combinations-grid">
                  {Object.entries(selectedOption === 'ton' ? PAYTABLE : GIFTS_TABLE).map(([combo, data]) => (
                    <div key={combo} className="combination-item">
                      <span className="combo-symbols">{combo}</span>
                      <span className="combo-prize">
                        {selectedOption === 'ton' ? `x${data.multiplier} bet` : data.gift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              className="close-instructions"
              onClick={() => setShowInstructions(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* Слот-машина */}
      <div className="slot-machine">
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div key={index} className="reel-container">
              <div 
                ref={reelsRef[index]}
                className="reel"
                data-reel={index}
              >
                {SYMBOLS_CONFIG[0].symbol}
              </div>
            </div>
          ))}
        </div>
        <div className="slot-frame">
          <div className="pay-line"></div>
        </div>
        <div className="slot-overlay"></div>
      </div>

      {/* Секция выигрыша */}
      <div className="bet-result-section">
        <div className="bet-result-text">
          {betResult}
        </div>
      </div>


      {/* Текст над кнопками */}
      <div className="instruction-text">
        Choose what you will play for. Click "Instructions" to learn how to play and see winning combinations!
      </div>

      <button 
        className="instructions-button"
        onClick={() => setShowInstructions(true)}
      >
        📖 Instructions
      </button>

      {/* Кнопки выбора */}
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

      {/* Кнопка Spin */}
      <button 
        className={`spin-go-button ${isSpinning ? 'spinning' : ''}`}
        onClick={spinSlotMachine}
        disabled={isSpinning}
      >
        {isSpinning ? (
          <>
            <div className="spinner"></div>
            Spinning...
          </>
        ) : (
          'SPIN'
        )}
      </button>

      <InstructionsModal />
      <Menu />
    </div>
  );
}

export default Home;