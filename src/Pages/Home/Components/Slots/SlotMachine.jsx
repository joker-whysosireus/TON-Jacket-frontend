import React from 'react';
import './SlotMachine.css';

const SlotMachine = ({ currentSymbols }) => {
  return (
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
  );
};

export default SlotMachine;