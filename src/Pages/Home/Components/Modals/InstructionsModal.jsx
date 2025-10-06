import './Modals.css'

const InstructionsModal = ({ showInstructions, onClose }) => {
  if (!showInstructions) return null;

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

  const allWinningCombinations = [
    { symbols: ['💎', '💎', '💎'], multiplier: 200, name: 'DIAMOND JACKPOT', type: 'jackpot' },
    { symbols: ['👑', '👑', '👑'], multiplier: 100, name: 'CROWN JACKPOT', type: 'jackpot' },
    { symbols: ['⑦', '⑦', '⑦'], multiplier: 50, name: 'TRIPLE SEVEN', type: 'jackpot' },
    { symbols: ['🔶', '🔶', '🔶'], multiplier: 40, name: 'TRIPLE DIAMOND', type: 'jackpot' },
    { symbols: ['🔔', '🔔', '🔔'], multiplier: 30, name: 'TRIPLE BELL', type: 'jackpot' },
    { symbols: ['⭐', '⭐', '⭐'], multiplier: 25, name: 'TRIPLE STAR', type: 'jackpot' },
    { symbols: ['🍇', '🍇', '🍇'], multiplier: 20, name: 'TRIPLE GRAPES', type: 'jackpot' },
    { symbols: ['🍉', '🍉', '🍉'], multiplier: 15, name: 'TRIPLE WATERMELON', type: 'jackpot' },
    { symbols: ['🍊', '🍊', '🍊'], multiplier: 10, name: 'TRIPLE ORANGE', type: 'jackpot' },
    { symbols: ['🍋', '🍋', '🍋'], multiplier: 8, name: 'TRIPLE LEMON', type: 'jackpot' },
    { symbols: ['🍒', '🍒', '🍒'], multiplier: 5, name: 'TRIPLE CHERRY', type: 'jackpot' },
    { symbols: ['🔥', '🔥', '🔥'], multiplier: 75, name: 'FIRE BONUS', type: 'jackpot' },
    { symbols: ['💎', '💎', '⭐'], multiplier: 15, name: 'DIAMOND STAR', type: 'special' },
    { symbols: ['👑', '👑', '⭐'], multiplier: 12, name: 'CROWN STAR', type: 'special' },
    { symbols: ['⑦', '⑦', '⭐'], multiplier: 10, name: 'SEVEN STAR', type: 'special' },
    { symbols: ['🔔', '🔔', '⭐'], multiplier: 8, name: 'BELL STAR', type: 'special' },
    { symbols: ['💎', '💎', '❓'], multiplier: 8, name: 'DOUBLE PREMIUM DIAMOND', type: 'double' },
    { symbols: ['👑', '👑', '❓'], multiplier: 6, name: 'DOUBLE CROWN', type: 'double' },
    { symbols: ['⑦', '⑦', '❓'], multiplier: 4, name: 'DOUBLE SEVEN', type: 'double' },
    { symbols: ['🔥', '🔥', '❓'], multiplier: 5, name: 'DOUBLE FIRE', type: 'double' },
    { symbols: ['🔶', '🔶', '❓'], multiplier: 3, name: 'DOUBLE DIAMOND', type: 'double' },
    { symbols: ['🔔', '🔔', '❓'], multiplier: 2.5, name: 'DOUBLE BELL', type: 'double' },
    { symbols: ['⭐', '⭐', '❓'], multiplier: 2, name: 'DOUBLE STAR', type: 'double' },
    { symbols: ['🍇', '🍇', '❓'], multiplier: 2, name: 'DOUBLE GRAPES', type: 'double' },
    { symbols: ['🍉', '🍉', '❓'], multiplier: 2, name: 'DOUBLE WATERMELON', type: 'double' },
    { symbols: ['🍊', '🍊', '❓'], multiplier: 2, name: 'DOUBLE ORANGE', type: 'double' },
    { symbols: ['🍋', '🍋', '❓'], multiplier: 2, name: 'DOUBLE LEMON', type: 'double' },
    { symbols: ['🍒', '🍒', '❓'], multiplier: 2, name: 'DOUBLE CHERRY', type: 'double' },
    { symbols: ['🍒', '🍋', '🍊'], multiplier: 1.5, name: 'FRUIT MIX', type: 'fruit' },
    { symbols: ['🍒', '🍋', '🍉'], multiplier: 1.5, name: 'FRUIT MIX', type: 'fruit' },
    { symbols: ['🍒', '🍋', '🍇'], multiplier: 1.5, name: 'FRUIT MIX', type: 'fruit' },
    { symbols: ['💀', '💀', '💀'], multiplier: 0, name: 'SKULL BUST', type: 'loss' },
    { symbols: ['💀', '💀', '❓'], multiplier: 0, name: 'DOUBLE SKULL', type: 'loss' }
  ];

  const groupedCombinations = {
    jackpot: allWinningCombinations.filter(c => c.type === 'jackpot'),
    special: allWinningCombinations.filter(c => c.type === 'special'),
    double: allWinningCombinations.filter(c => c.type === 'double'),
    fruit: allWinningCombinations.filter(c => c.type === 'fruit').slice(0, 3),
    loss: allWinningCombinations.filter(c => c.type === 'loss')
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'jackpot': return 'jackpot-item';
      case 'special': return 'special-item';
      case 'double': return 'double-item';
      case 'fruit': return 'fruit-item';
      case 'loss': return 'loss-item';
      default: return '';
    }
  };

  const getPrizeClass = (type) => {
    switch (type) {
      case 'jackpot': return 'jackpot-prize';
      case 'special': return 'special-prize';
      case 'double': return 'double-prize';
      case 'fruit': return 'fruit-prize';
      case 'loss': return 'loss-prize';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay instructions-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎰 Winning Combinations</h2>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="instructions-list">
            <div className="instruction-item">
              <strong>Game Rules:</strong>
              <ul>
                <li><strong>Three identical symbols:</strong> Jackpot win (highest payouts)</li>
                <li><strong>Two identical symbols:</strong> Double win (medium payouts)</li>
                <li><strong>Three different fruits:</strong> Fruit mix win (small payout)</li>
                <li><strong>Special combinations:</strong> Bonus wins with specific patterns</li>
                <li><strong>Skull symbols:</strong> Cause busts - you lose your bet!</li>
                <li><strong>Any other combination:</strong> No win - try again!</li>
              </ul>
            </div>
            
            <div className="instruction-item">
              <strong>Symbol Weights:</strong>
              <p>Some symbols appear more frequently than others:</p>
              <div className="symbol-weights">
                {SYMBOLS_CONFIG.map(symbol => (
                  <div key={symbol.id} className="symbol-weight-item">
                    <span className="weight-symbol">{symbol.symbol}</span>
                    <span className="weight-value">{symbol.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">🎯 JACKPOTS (Three Identical Symbols):</strong>
              <div className="combinations-grid">
                {groupedCombinations.jackpot.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      {combo.multiplier >= 100 ? 'JACKPOT' : `x${combo.multiplier}`}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">⭐ SPECIAL COMBINATIONS:</strong>
              <div className="combinations-grid">
                {groupedCombinations.special.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      x{combo.multiplier}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">🔔 DOUBLE COMBINATIONS (Two Identical + Any):</strong>
              <div className="combinations-grid">
                {groupedCombinations.double.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      {combo.multiplier === 0 ? 'BUST' : `x${combo.multiplier}`}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">🍓 FRUIT MIXES (Any Three Different Fruits):</strong>
              <div className="combinations-grid">
                {groupedCombinations.fruit.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      x{combo.multiplier}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
                <div className="combination-item fruit-item">
                  <span className="combo-symbols">... and 7 more</span>
                  <span className="combo-prize fruit-prize">x1.5</span>
                  <span className="combo-name">FRUIT MIX</span>
                </div>
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">💀 LOSS COMBINATIONS (You Lose Your Bet):</strong>
              <div className="combinations-grid">
                {groupedCombinations.loss.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      BUST
                    </span>
                    <span className="combo-name">{combo.name}</span>
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

export default InstructionsModal;