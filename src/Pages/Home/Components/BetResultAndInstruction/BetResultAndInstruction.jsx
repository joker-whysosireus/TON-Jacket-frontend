import React from 'react';
import './BetResultAndInstruction.css';

const BetResultAndInstruction = ({ betResult }) => {
  return (
    <>
      <div className="bet-result-section">
        <div className="bet-result-text">
          {betResult}
        </div>
      </div>
      <div className="instruction-text">
        Choose what you will play for. Click "Instructions" to learn how to play and see winning combinations!
      </div>
    </>
  );
};

export default BetResultAndInstruction;