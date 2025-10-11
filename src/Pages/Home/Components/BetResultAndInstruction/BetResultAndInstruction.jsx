import React from 'react';
import './BetResultAndInstruction.css';
import { translations } from '../../../../Assets/Lang/translation';

const BetResultAndInstruction = ({ betResult, language = 'english' }) => {
  // Получаем переводы для текущего языка
  const t = translations[language]?.betResult || translations.english.betResult;

  return (
    <>
      <div className="bet-result-section">
        <div className="bet-result-text">
          {betResult}
        </div>
      </div>
      <div className="instruction-text">
        {t.instruction}
      </div>
    </>
  );
};

export default BetResultAndInstruction;