import React from 'react';
import './Modals.css';
import { translations } from '../../../../Assets/Lang/translation';

const InstructionsModal = ({ showInstructions, onClose, language = 'english' }) => {
  if (!showInstructions) return null;

  // Получаем переводы для текущего языка
  const t = translations[language]?.instructionsModal || translations.english.instructionsModal;
  const commonT = translations[language]?.common || translations.english.common;

  const SYMBOLS_CONFIG = [
    { id: 1, symbol: '🍒', name: 'Cherry', weight: 60, type: 'fruit' },
    { id: 2, symbol: '🍋', name: 'Lemon', weight: 55, type: 'fruit' },
    { id: 3, symbol: '🍊', name: 'Orange', weight: 50, type: 'fruit' },
    { id: 4, symbol: '🍉', name: 'Watermelon', weight: 45, type: 'fruit' },
    { id: 5, symbol: '🔔', name: 'Bell', weight: 25, type: 'bell' },
    { id: 6, symbol: '⭐', name: 'Star', weight: 20, type: 'star' },
    { id: 7, symbol: '🍇', name: 'Grapes', weight: 35, type: 'fruit' },
    { id: 8, symbol: '🔶', name: 'Diamond', weight: 10, type: 'diamond' },
    { id: 9, symbol: '⑦', name: 'Seven', weight: 6, type: 'seven' },
    { id: 10, symbol: '💎', name: 'Premium Diamond', weight: 3, type: 'premium' },
    { id: 11, symbol: '👑', name: 'Crown', weight: 2, type: 'premium' },
    { id: 12, symbol: '💀', name: 'Skull', weight: 20, type: 'skull' },
    { id: 13, symbol: '🔥', name: 'Fire', weight: 2, type: 'special' }
  ];

  const allWinningCombinations = [
    { symbols: ['💎', '💎', '💎'], multiplier: 25, name: 'DIAMOND JACKPOT', type: 'jackpot' },
    { symbols: ['👑', '👑', '👑'], multiplier: 15, name: 'CROWN JACKPOT', type: 'jackpot' },
    { symbols: ['⑦', '⑦', '⑦'], multiplier: 8, name: 'TRIPLE SEVEN', type: 'jackpot' },
    { symbols: ['🔶', '🔶', '🔶'], multiplier: 6, name: 'TRIPLE DIAMOND', type: 'jackpot' },
    { symbols: ['🔔', '🔔', '🔔'], multiplier: 5, name: 'TRIPLE BELL', type: 'jackpot' },
    { symbols: ['⭐', '⭐', '⭐'], multiplier: 4, name: 'TRIPLE STAR', type: 'jackpot' },
    { symbols: ['🍇', '🍇', '🍇'], multiplier: 3, name: 'TRIPLE GRAPES', type: 'jackpot' },
    { symbols: ['🍉', '🍉', '🍉'], multiplier: 4, name: 'TRIPLE WATERMELON', type: 'jackpot' },
    { symbols: ['🍊', '🍊', '🍊'], multiplier: 3, name: 'TRIPLE ORANGE', type: 'jackpot' },
    { symbols: ['🍋', '🍋', '🍋'], multiplier: 3, name: 'TRIPLE LEMON', type: 'jackpot' },
    { symbols: ['🍒', '🍒', '🍒'], multiplier: 2, name: 'TRIPLE CHERRY', type: 'jackpot' },
    { symbols: ['🔥', '🔥', '🔥'], multiplier: 10, name: 'FIRE BONUS', type: 'jackpot' },
    { symbols: ['💎', '💎', '⭐'], multiplier: 5, name: 'DIAMOND STAR', type: 'special' },
    { symbols: ['👑', '👑', '⭐'], multiplier: 4, name: 'CROWN STAR', type: 'special' },
    { symbols: ['⑦', '⑦', '⭐'], multiplier: 3, name: 'SEVEN STAR', type: 'special' },
    { symbols: ['🔔', '🔔', '⭐'], multiplier: 2.5, name: 'BELL STAR', type: 'special' },
    { symbols: ['💎', '💎', '❓'], multiplier: 2, name: 'DOUBLE PREMIUM DIAMOND', type: 'double' },
    { symbols: ['👑', '👑', '❓'], multiplier: 1.5, name: 'DOUBLE CROWN', type: 'double' },
    { symbols: ['⑦', '⑦', '❓'], multiplier: 1.5, name: 'DOUBLE SEVEN', type: 'double' },
    { symbols: ['🔥', '🔥', '❓'], multiplier: 1, name: 'DOUBLE FIRE', type: 'double' },
    { symbols: ['🔶', '🔶', '❓'], multiplier: 1, name: 'DOUBLE DIAMOND', type: 'double' },
    { symbols: ['🔔', '🔔', '❓'], multiplier: 1, name: 'DOUBLE BELL', type: 'double' },
    { symbols: ['⭐', '⭐', '❓'], multiplier: 0.5, name: 'DOUBLE STAR', type: 'double' },
    { symbols: ['🍇', '🍇', '❓'], multiplier: 0.5, name: 'DOUBLE GRAPES', type: 'double' },
    { symbols: ['🍉', '🍉', '❓'], multiplier: 0.5, name: 'DOUBLE WATERMELON', type: 'double' },
    { symbols: ['🍊', '🍊', '❓'], multiplier: 0, name: 'DOUBLE ORANGE', type: 'double' },
    { symbols: ['🍋', '🍋', '❓'], multiplier: 0, name: 'DOUBLE LEMON', type: 'double' },
    { symbols: ['🍒', '🍒', '❓'], multiplier: 0, name: 'DOUBLE CHERRY', type: 'double' },
    { symbols: ['🍒', '🍋', '🍊'], multiplier: 0.8, name: 'FRUIT MIX', type: 'fruit' },
    { symbols: ['🍒', '🍋', '🍉'], multiplier: 0.8, name: 'FRUIT MIX', type: 'fruit' },
    { symbols: ['🍒', '🍋', '🍇'], multiplier: 0.8, name: 'FRUIT MIX', type: 'fruit' },
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
          <h2>{t.title}</h2>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">
          <div className="instructions-list">
            <div className="instruction-item">
              <strong>{t.gameRules}</strong>
              <ul>
                {t.rulesList.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            
            <div className="instruction-item">
              <strong>{t.symbolWeights}</strong>
              <p>{t.symbolWeightsDescription}</p>
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
              <strong className="combo-type-header">{t.jackpotsTitle}</strong>
              <div className="combinations-grid">
                {groupedCombinations.jackpot.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      {combo.multiplier >= 15 ? 'JACKPOT' : `x${combo.multiplier}`}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">{t.specialCombinationsTitle}</strong>
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
              <strong className="combo-type-header">{t.doubleCombinationsTitle}</strong>
              <div className="combinations-grid">
                {groupedCombinations.double.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      {combo.multiplier === 0 ? t.bust : `x${combo.multiplier}`}
                    </span>
                    <span className="combo-name">{combo.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">{t.fruitMixesTitle}</strong>
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
                  <span className="combo-symbols">{t.andMore}</span>
                  <span className="combo-prize fruit-prize">x0.8</span>
                  <span className="combo-name">FRUIT MIX</span>
                </div>
              </div>
            </div>

            <div className="instruction-item">
              <strong className="combo-type-header">{t.lossCombinationsTitle}</strong>
              <div className="combinations-grid">
                {groupedCombinations.loss.map((combo, index) => (
                  <div key={index} className={`combination-item ${getTypeClass(combo.type)}`}>
                    <span className="combo-symbols">
                      {combo.symbols.join(' ')}
                    </span>
                    <span className={`combo-prize ${getPrizeClass(combo.type)}`}>
                      {t.bust}
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