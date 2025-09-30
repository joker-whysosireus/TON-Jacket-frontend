import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loader.css';

const Loader = ({ userData, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [language, setLanguage] = useState('english');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Получаем username из userData (предполагаем, что это поле существует)
    const username = userData?.username || 'User';

    // Эффект для плавного заполнения прогресс-бара
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsLoading(false);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // Увеличиваем прогресс каждые 50мс (всего 5 секунд до 100%)

        return () => clearInterval(interval);
    }, []);

    // Тексты в зависимости от выбранного языка
    const texts = {
        english: {
            welcome: `Hi, ${username} 👋`,
            instruction: 'While authorization is in progress, please select your preferred language',
            privacyNote: 'By proceeding, you confirm that you have read and agree to our Privacy Policy. All further responsibility lies with the user.',
            goButton: 'Go to slots',
            privacyPolicy: 'Privacy Policy'
        },
        russian: {
            welcome: `Привет, ${username} 👋`,
            instruction: 'Пока идет авторизация, пожалуйста, выберите удобный вам язык',
            privacyNote: 'Продолжая, вы подтверждаете, что прочитали и согласны с нашей Политикой конфиденциальности. Вся дальнейшая ответственность лежит на пользователе.',
            goButton: 'Перейти к слотам',
            privacyPolicy: 'Политика конфиденциальности'
        }
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        // Здесь можно добавить логику для изменения языка во всем приложении
        // Например, сохранение в контекст или локальное хранилище
    };

    const handleGoToSlots = () => {
        if (!isLoading) {
            onComplete();
            navigate('/');
        }
    };

    const handlePrivacyPolicy = () => {
        // Здесь можно добавить логику для открытия политики конфиденциальности
        // Например, открыть модальное окно или перейти на другую страницу
        console.log('Open privacy policy');
    };

    return (
        <div className={`loader-container ${language === 'russian' ? 'russian' : 'english'}`}>
            <div className="loader-content">
                <h1 className="welcome-text">{texts[language].welcome}</h1>
                <p className="instruction-text">{texts[language].instruction}</p>
                
                <div className="progress-container">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div className="progress-text">{progress}%</div>
                </div>
                
                {/* Новый текст о политике конфиденциальности и ответственности */}
                <p className="privacy-note">{texts[language].privacyNote}</p>
                
                <div className="language-section">
                    {/* Кнопка Политика конфиденциальности */}
                    <button 
                        className="privacy-policy-btn"
                        onClick={handlePrivacyPolicy}
                    >
                        {texts[language].privacyPolicy}
                    </button>
                    
                    <div className="language-buttons">
                        <button 
                            className={`language-btn ${language === 'english' ? 'active' : ''}`}
                            onClick={() => handleLanguageChange('english')}
                        >
                            English
                        </button>
                        <button 
                            className={`language-btn ${language === 'russian' ? 'active' : ''}`}
                            onClick={() => handleLanguageChange('russian')}
                        >
                            Русский
                        </button>
                    </div>
                    
                    <button 
                        className={`go-button ${isLoading ? 'disabled' : ''}`}
                        onClick={handleGoToSlots}
                        disabled={isLoading}
                    >
                        {texts[language].goButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Loader;