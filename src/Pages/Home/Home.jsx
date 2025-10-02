import { useState, useRef, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Menu from '../../Assets/Menus/Menu/Menu';
import TonLogo from './TonLogo.png';
import gold from './gold.png';
import './Home.css';

const SYMBOLS_CONFIG = [
  { symbol: '🍒', name: 'Cherry', weight: 35 },
  { symbol: '🍋', name: 'Lemon', weight: 30 },
  { symbol: '🍊', name: 'Orange', weight: 25 },
  { symbol: '🍉', name: 'Watermelon', weight: 20 },
  { symbol: '🔔', name: 'Bell', weight: 18 },
  { symbol: '⭐', name: 'Star', weight: 15 },
  { symbol: '🍇', name: 'Grapes', weight: 12 },
  { symbol: '🔶', name: 'Diamond', weight: 10 },
  { symbol: '⑦', name: 'Seven', weight: 8 },
  { symbol: '💎', name: 'Diamond', weight: 6 },
  { symbol: '👑', name: 'Crown', weight: 4 },
  { symbol: '💀', name: 'Skull', weight: 2 },
  { symbol: '🔥', name: 'Fire', weight: 1 }
];

const PAYTABLE = {
  '💎,💎,💎': { multiplier: 200, name: 'DIAMOND JACKPOT' },
  '👑,👑,👑': { multiplier: 100, name: 'CROWN JACKPOT' },
  '🔥,🔥,🔥': { multiplier: 75, name: 'FIRE BONUS' },
  '⑦,⑦,⑦': { multiplier: 50, name: 'TRIPLE SEVEN' },
  '🔶,🔶,🔶': { multiplier: 40, name: 'TRIPLE DIAMOND' },
  '🔔,🔔,🔔': { multiplier: 30, name: 'TRIPLE BELL' },
  '⭐,⭐,⭐': { multiplier: 25, name: 'TRIPLE STAR' },
  '🍇,🍇,🍇': { multiplier: 20, name: 'TRIPLE GRAPES' },
  '🍉,🍉,🍉': { multiplier: 15, name: 'TRIPLE WATERMELON' },
  '🍊,🍊,🍊': { multiplier: 10, name: 'TRIPLE ORANGE' },
  '🍋,🍋,🍋': { multiplier: 8, name: 'TRIPLE LEMON' },
  '🍒,🍒,🍒': { multiplier: 5, name: 'TRIPLE CHERRY' },
  '💀,💀,💀': { multiplier: 0, name: 'SKULL BUST' },
  '💎,💎,⭐': { multiplier: 15, name: 'DIAMOND BONUS' },
  '👑,👑,⭐': { multiplier: 12, name: 'CROWN BONUS' },
  '⑦,⑦,⭐': { multiplier: 10, name: 'SEVEN BONUS' },
  '🔔,🔔,⭐': { multiplier: 8, name: 'BELL BONUS' },
  '💎,⭐,⭐': { multiplier: 6, name: 'STAR DIAMOND' },
  '👑,⭐,⭐': { multiplier: 5, name: 'STAR CROWN' },
  '⑦,⭐,⭐': { multiplier: 4, name: 'STAR SEVEN' },
  '🍒,🍒,🍋': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍒,🍒,🍊': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍒,🍒,🍉': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍒,🍒,🔔': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍒,🍒,⭐': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍒,🍒,🍇': { multiplier: 3, name: 'DOUBLE CHERRY' },
  '🍋,🍋,🍊': { multiplier: 2.5, name: 'LEMON ORANGE' },
  '🍊,🍊,🍋': { multiplier: 2.5, name: 'ORANGE LEMON' },
  '🍉,🍉,🍇': { multiplier: 2.5, name: 'WATERMELON GRAPES' },
  '🔔,🔔,⭐': { multiplier: 4, name: 'BELL STAR' },
  '⭐,⭐,🔔': { multiplier: 4, name: 'STAR BELL' },
  '🍒,🍋,🍊': { multiplier: 1.5, name: 'FRUIT MIX' },
  '🍋,🍊,🍒': { multiplier: 1.5, name: 'FRUIT MIX' },
  '🍊,🍒,🍋': { multiplier: 1.5, name: 'FRUIT MIX' },
  '🍒,🍉,🍇': { multiplier: 1.5, name: 'FRUIT MIX' },
  '🍇,🍒,🍉': { multiplier: 1.5, name: 'FRUIT MIX' },
  '🍒,🍒': { multiplier: 2, name: 'DOUBLE CHERRY' },
  '💎,💎': { multiplier: 8, name: 'DIAMOND PAIR' },
  '👑,👑': { multiplier: 6, name: 'CROWN PAIR' },
  '⑦,⑦': { multiplier: 4, name: 'SEVEN PAIR' },
  '🔶,🔶': { multiplier: 3, name: 'DIAMOND PAIR' },
  '🔔,🔔': { multiplier: 2.5, name: 'BELL PAIR' },
  '⭐,⭐': { multiplier: 2, name: 'STAR PAIR' },
  '🍒,⭐': { multiplier: 1.2, name: 'CHERRY STAR' },
  '🍒,🔔': { multiplier: 1.2, name: 'CHERRY BELL' },
  '🍒,🍇': { multiplier: 1.1, name: 'CHERRY GRAPES' },
  '🍒,🍉': { multiplier: 1.1, name: 'CHERRY WATERMELON' }
};

const GIFTS_TABLE = {
  '💎,💎,💎': { gift: 'Premium Smartphone', value: '💰 High Value' },
  '👑,👑,👑': { gift: 'Gaming Console', value: '💰 High Value' },
  '🔥,🔥,🔥': { gift: 'Smart TV', value: '💰 High Value' },
  '⑦,⑦,⑦': { gift: 'Wireless Headphones', value: '💰 Medium Value' },
  '🔶,🔶,🔶': { gift: 'Smart Watch', value: '💰 Medium Value' },
  '🔔,🔔,🔔': { gift: 'Tablet', value: '💰 Medium Value' },
  '⭐,⭐,⭐': { gift: 'Bluetooth Speaker', value: '💰 Medium Value' },
  '🍇,🍇,🍇': { gift: 'Fitness Tracker', value: '💰 Medium Value' },
  '🍉,🍉,🍉': { gift: 'Gift Card $100', value: '💰 Medium Value' },
  '🍊,🍊,🍊': { gift: 'Gift Card $50', value: '💰 Low Value' },
  '🍋,🍋,🍋': { gift: 'Branded T-Shirt', value: '💰 Low Value' },
  '🍒,🍒,🍒': { gift: 'Coffee Mug', value: '💰 Low Value' },
  '💎,💎,⭐': { gift: 'Power Bank', value: '💰 Medium Value' },
  '👑,👑,⭐': { gift: 'Phone Case', value: '💰 Low Value' },
  '🍒,🍒,⭐': { gift: 'Sticker Pack', value: '💰 Small Value' },
  '🍒,🍒': { gift: 'Keychain', value: '💰 Small Value' },
  '💎,💎': { gift: 'Wireless Earbuds', value: '💰 Medium Value' },
  '👑,👑': { gift: 'Backpack', value: '💰 Medium Value' }
};

function TonLogoIcon({ size = 20, className = "" }) {
  return (
    <img 
      src={TonLogo} 
      alt="TON" 
      className={`ton-logo ${className}`}
      style={{ 
        width: size, 
        height: size,
      }} 
    />
  );
}

function GoldIcon({ size = 20, className = "" }) {
  return (
    <img 
      src={GoldIcon} 
      alt="Gold" 
      className={`gold-icon ${className}`}
      style={{ 
        width: size, 
        height: size,
      }} 
    />
  );
}

// Separate BetModal component to prevent re-renders
const BetModal = ({ 
  showBetModal, 
  betAmount, 
  balance, 
  onClose, 
  onConfirm, 
  onBetChange 
}) => {
  if (!showBetModal) return null;

  const isConfirmDisabled = betAmount <= 0 || betAmount > balance.ton;
  const quickBetAmounts = [0.1, 0.5, 1, 2, 5, 10];

  const handleButtonClick = (amount, e) => {
    e.stopPropagation();
    onBetChange(amount);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚀 Place Your Bet</h2>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="bet-amount-display">
            <div className="bet-amount-label">Your Bet Amount</div>
            <div className="bet-amount-value">
              <TonLogoIcon size={50} className="ton-logo-modal" />
              {betAmount.toFixed(2)}
            </div>
            <div className="balance-info">
              <div className="balance-label">Available Balance:</div>
              <div className="balance-amount">
                <TonLogoIcon size={20} />
                {balance.ton.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="quick-bet-buttons">
            <div className="quick-bet-label">Quick Bet Amounts:</div>
            <div className="quick-bet-grid">
              {quickBetAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`quick-bet-btn ${betAmount === amount ? 'active' : ''}`}
                  onClick={(e) => handleButtonClick(amount, e)}
                >
                  {amount} TON
                </button>
              ))}
            </div>
          </div>

          <div className="bet-modal-actions">
            <button 
              className="bet-confirm-btn"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              Confirm Bet & Spin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate InstructionsModal component
const InstructionsModal = ({ showInstructions, onClose }) => {
  if (!showInstructions) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎰 How to Play</h2>
          <span className="modal-close" onClick={onClose}>×</span>
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
              <strong>2. Place your bet:</strong>
              <p>Select your bet amount and click SPIN to start the reels</p>
            </div>
            <div className="instruction-item">
              <strong>3. Winning combinations (TON Mode):</strong>
              <div className="combinations-grid">
                {Object.entries(PAYTABLE).map(([combo, data]) => (
                  <div key={combo} className="combination-item">
                    <span className="combo-symbols">{combo}</span>
                    <span className="combo-prize">
                      {data.multiplier === 0 ? 'BUST' : 
                       data.multiplier === 200 ? 'JACKPOT' : 
                       `x${data.multiplier}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [selectedOption, setSelectedOption] = useState('ton');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betResult, setBetResult] = useState('Welcome! Place your bet and spin!');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [balance, setBalance] = useState({ ton: 100, coins: 500 });
  const [betAmount, setBetAmount] = useState(0.1);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  const [currentSymbols, setCurrentSymbols] = useState(['🍒', '🍒', '🍒']);
  
  const reelsRef = [useRef(null), useRef(null), useRef(null)];
  const reelStripsRef = [useRef(null), useRef(null), useRef(null)];

  // Load symbols from localStorage
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

  // Save symbols to localStorage
  useEffect(() => {
    localStorage.setItem('slotMachineSymbols', JSON.stringify(currentSymbols));
  }, [currentSymbols]);

  // Update window dimensions
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

  // Block scroll when modals are open
  useEffect(() => {
    if (showInstructions || showBetModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showInstructions, showBetModal]);

  // Create symbols pool with weights
  const symbolsPool = [];
  SYMBOLS_CONFIG.forEach(symbolConfig => {
    for (let i = 0; i < symbolConfig.weight; i++) {
      symbolsPool.push(symbolConfig.symbol);
    }
  });

  const getRandomSymbol = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * symbolsPool.length);
    return symbolsPool[randomIndex];
  }, [symbolsPool]);

  // Balance management
  const addBalance = useCallback((type, amount) => {
    setBalance(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  }, []);

  // Create reel strip
  const createReelStrip = useCallback((finalSymbol = null) => {
    const strip = [];
    for (let i = 0; i < 15; i++) {
      if (i === 7 && finalSymbol) {
        strip.push(finalSymbol);
      } else {
        strip.push(getRandomSymbol());
      }
    }
    return strip;
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

  // Check winning combinations
  const checkWinningCombinations = useCallback((results) => {
    const resultString = results.join(',');
    let winAmount = 0;
    let winName = '';
    let gift = null;
    
    // Check for three skulls first (bust)
    if (results[0] === '💀' && results[1] === '💀' && results[2] === '💀') {
      setBetResult('BUST! Three skulls - you lose your bet!');
      return 0;
    }
    
    if (selectedOption === 'ton' && PAYTABLE[resultString]) {
      winAmount = PAYTABLE[resultString].multiplier * betAmount;
      winName = PAYTABLE[resultString].name;
    } else if (selectedOption === 'gifts' && GIFTS_TABLE[resultString]) {
      gift = GIFTS_TABLE[resultString];
      winName = gift.gift;
    }
    
    // Check for two symbols in first two positions
    if (results[0] === results[1] && PAYTABLE[`${results[0]},${results[1]}`]) {
      const twoSymbolWin = PAYTABLE[`${results[0]},${results[1]}`];
      if (twoSymbolWin.multiplier > winAmount) {
        winAmount = twoSymbolWin.multiplier * betAmount;
        winName = twoSymbolWin.name;
      }
    }

    // Check for single symbol combinations
    if (results[0] === results[1] && results[1] === results[2] && PAYTABLE[`${results[0]},${results[1]}`]) {
      const threeSymbolWin = PAYTABLE[`${results[0]},${results[1]},${results[2]}`];
      if (threeSymbolWin && threeSymbolWin.multiplier > winAmount) {
        winAmount = threeSymbolWin.multiplier * betAmount;
        winName = threeSymbolWin.name;
      }
    }

    if (winAmount > 0 || gift) {
      if (selectedOption === 'ton') {
        setBetResult(`WIN! ${winName} (${winAmount.toFixed(2)} TON)`);
        setBalance(prev => ({ ...prev, ton: prev.ton + winAmount }));
      } else {
        setBetResult(`WIN! ${gift.gift}`);
      }
      
      if (winAmount > 0) {
        startConfetti();
      }
      return winAmount;
    }
    
    setBetResult('No win this time. Try again!');
    return 0;
  }, [selectedOption, betAmount, startConfetti]);

  // Spin slot machine
  const spinSlotMachine = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setBetResult('Spinning...');
    setShowConfetti(false);

    if (selectedOption === 'ton') {
      if (betAmount > balance.ton) {
        setBetResult('Not enough TON for this bet!');
        setIsSpinning(false);
        return;
      }
      setBalance(prev => ({ ...prev, ton: prev.ton - betAmount }));
    }

    const finalResults = [];
    const spinDurations = [2000, 2200, 2400];

    reelsRef.forEach((reel, index) => {
      const reelElement = reel.current;
      const stripElement = reelStripsRef[index].current;
      if (!reelElement || !stripElement) return;

      const finalSymbol = getRandomSymbol();
      finalResults[index] = finalSymbol;

      const strip = createReelStrip(finalSymbol);
      
      stripElement.innerHTML = strip.map(symbol => 
        `<div class="symbol">${symbol}</div>`
      ).join('');

      stripElement.style.transition = 'none';
      stripElement.style.transform = 'translateY(0)';

      setTimeout(() => {
        stripElement.style.transition = `transform ${spinDurations[index]}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
        stripElement.style.transform = `translateY(-700px)`;
      }, 50);

      setTimeout(() => {
        stripElement.style.transition = 'transform 0.5s ease-out';
        stripElement.style.transform = `translateY(-700px)`;

        if (index === reelsRef.length - 1) {
          setTimeout(() => {
            checkWinningCombinations(finalResults);
            setCurrentSymbols(finalResults);
            setIsSpinning(false);
          }, 600);
        }
      }, spinDurations[index]);
    });
  }, [isSpinning, selectedOption, betAmount, balance.ton, getRandomSymbol, createReelStrip, checkWinningCombinations]);

  // Spin button handler
  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;
    
    if (selectedOption === 'ton') {
      setShowBetModal(true);
    } else {
      spinSlotMachine();
    }
  }, [isSpinning, selectedOption, spinSlotMachine]);

  // Bet modal handlers
  const handleCloseBetModal = useCallback(() => {
    setShowBetModal(false);
  }, []);

  const handleBetConfirm = useCallback(() => {
    if (betAmount <= 0) {
      setBetResult('Please select a valid bet amount');
      return;
    }
    
    if (betAmount > balance.ton) {
      setBetResult('Not enough TON for this bet!');
      return;
    }
    
    handleCloseBetModal();
    setTimeout(() => {
      spinSlotMachine();
    }, 300);
  }, [betAmount, balance.ton, handleCloseBetModal, spinSlotMachine]);

  const handleBetButtonClick = useCallback((amount) => {
    setBetAmount(amount);
  }, []);

  const handleCloseInstructions = useCallback(() => {
    setShowInstructions(false);
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

      {/* Balance Section */}
      <div className="balance-section">
        <div className="balance-item">
          <div className="balance-content">
            <TonLogoIcon size={22} className="ton-logo-balance" />
            <div className="balance-text-container">
              <span className="balance-value">{balance.ton.toFixed(2)}</span>
              <span className="balance-label">TON</span>
            </div>
          </div>
          <button 
            className="balance-add-btn"
            onClick={() => addBalance('ton', 10)}
            title="Add TON"
          >
            +
          </button>
        </div>
        
        <div className="balance-item">
          <div className="balance-content">
            <img src={gold} alt="Gold" className="gold-icon" style={{ width: 22, height: 22 }} />
            <div className="balance-text-container">
              <span className="balance-value">{balance.coins}</span>
              <span className="balance-label">Coins</span>
            </div>
          </div>
          <button 
            className="balance-add-btn"
            onClick={() => addBalance('coins', 100)}
            title="Add Coins"
          >
            +
          </button>
        </div>
      </div>

      {/* Slot Machine */}
      <div className="slot-machine">
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div key={index} className="reel-container">
              <div 
                ref={reelsRef[index]}
                className="reel"
                data-reel={index}
              >
                <div 
                  ref={reelStripsRef[index]}
                  className="reel-strip"
                >
                  {createReelStrip(currentSymbols[index]).map((symbol, i) => (
                    <div key={i} className="symbol">{symbol}</div>
                  ))}
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

      {/* Bet Result Section */}
      <div className="bet-result-section">
        <div className="bet-result-text">
          {betResult}
        </div>
      </div>

      {/* Instruction Text */}
      <div className="instruction-text">
        Choose what you will play for. Click "Instructions" to learn how to play and see winning combinations!
      </div>

      {/* Instructions Button */}
      <button 
        className="instructions-button"
        onClick={() => setShowInstructions(true)}
      >
        📖 Instructions
      </button>

      {/* Choice Buttons */}
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

      {/* Spin Button */}
      <button 
        className={`spin-go-button ${isSpinning ? 'spinning' : ''}`}
        onClick={handleSpinClick}
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

      {/* Modals */}
      <InstructionsModal 
        showInstructions={showInstructions} 
        onClose={handleCloseInstructions} 
      />
      
      <BetModal 
        showBetModal={showBetModal}
        betAmount={betAmount}
        balance={balance}
        onClose={handleCloseBetModal}
        onConfirm={handleBetConfirm}
        onBetChange={handleBetButtonClick}
      />
      
      <Menu />
    </div>
  );
}

export default Home;