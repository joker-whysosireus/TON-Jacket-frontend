import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loader.css';

const Loader = ({ userData, onComplete, currentLanguage, onLanguageChange }) => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const navigate = useNavigate();

    const username = userData?.username || 'User';

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
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Тексты в зависимости от выбранного языка
    const texts = {
        english: {
            welcome: `Hi, ${username} 👋`,
            instruction: 'While authorization is in progress, please select your preferred language',
            privacyNote: 'By proceeding, you confirm that you have read and agree to our Privacy Policy. All further responsibility lies with the user.',
            goButton: 'Go to slots',
            privacyPolicy: 'Privacy Policy',
            privacyTitle: 'Privacy Policy',
            lastUpdated: 'Last updated: September 2025',
            close: 'Close'
        },
        russian: {
            welcome: `Привет, ${username} 👋`,
            instruction: 'Пока идет авторизация, пожалуйста, выберите удобный вам язык',
            privacyNote: 'Продолжая, вы подтверждаете, что прочитали и согласны с нашей Политикой конфиденциальности. Вся дальнейшая ответственность лежит на пользователе.',
            goButton: 'Перейти к слотам',
            privacyPolicy: 'Политика конфиденциальности',
            privacyTitle: 'Политика конфиденциальности',
            lastUpdated: 'Последнее обновление: Сентябрь 2025',
            close: 'Закрыть'
        }
    };

    const handleLanguageChange = (lang) => {
        onLanguageChange(lang);
    };

    const handleGoToSlots = () => {
        if (!isLoading) {
            onComplete();
            navigate('/');
        }
    };

    const handlePrivacyPolicy = () => {
        setShowPrivacyModal(true);
    };

    const closePrivacyModal = () => {
        setShowPrivacyModal(false);
    };

    // Обновленное содержимое политики конфиденциальности
    const privacyPolicyContent = {
        english: [
            { 
                title: "1. General Provisions", 
                content: "This Privacy Policy governs the processing of personal data of users of the TON Mania application, where users can play slot machines using TON (The Open Network) cryptocurrency to increase their TON balance or purchase Telegram gifts." 
            },
            { 
                title: "2. Information We Collect", 
                content: "We collect only basic data provided by Telegram: your Telegram user ID, public username, profile name, profile photo, client language, Telegram Premium subscription status, and your app's color theme parameters. We do not store users' IP addresses." 
            },
            { 
                title: "3. Use of Information", 
                content: "Your information is used to: process game transactions, ensure platform security, provide customer support, improve user experience, and comply with legal obligations." 
            },
            { 
                title: "4. TON Blockchain Specifics", 
                content: "Due to the nature of blockchain technology, your TON wallet address and transaction history are publicly visible on the blockchain and cannot be modified or deleted." 
            },
            { 
                title: "5. Data Security", 
                content: "We implement industry-standard security measures to protect your data. However, we cannot guarantee absolute security of information transmitted over the internet." 
            },
            { 
                title: "6. Third-Party Services", 
                content: "We integrate with TON blockchain and Telegram Mini Apps platform. These third parties have their own privacy policies governing data use." 
            },
            { 
                title: "7. User Rights (Telegram Mini Apps)", 
                content: "According to Telegram's documentation for Mini Apps, you have the right to: access your personal data, request correction of inaccuracies, withdraw consent for processing, and request deletion of your account data. You can exercise these rights by contacting us through our Telegram bot." 
            },
            { 
                title: "8. Risk Disclaimer", 
                content: "The TON Mania team does not promise or guarantee big winnings. The application is entertainment, and losing is always possible. By using TON Mania, you acknowledge that cryptocurrency transactions and gaming involve high risks, and you accept full responsibility for any possible financial losses." 
            },
            { 
                title: "9. Policy Changes", 
                content: "We may update this policy. Continued use of TON Mania after changes constitutes acceptance of the revised policy." 
            },
            { 
                title: "10. Contact Information", 
                content: "For privacy-related questions, contact us via Telegram: @tonmania_support" 
            }
        ],
        russian: [
            { 
                title: "1. Общие положения", 
                content: "Настоящая Политика конфиденциальности регулирует обработку персональных данных пользователей приложения TON Mania, где пользователи могут играть в игровые автоматы с использованием криптовалюты TON (The Open Network) для увеличения баланса TON или покупки подарков Telegram." 
            },
            { 
                title: "2. Собираемая информация", 
                content: "Мы собираем только базовые данные, предоставляемые Telegram: ваш Telegram user ID, публичное имя пользователя, имя профиля, фотографию профиля, язык клиента, статус подписки Telegram Premium, а также параметры цветовой темы вашего приложения. Мы не храним IP-адреса пользователей." 
            },
            { 
                title: "3. Использование информации", 
                content: "Ваша информация используется для: обработки игровых транзакций, обеспечения безопасности платформы, предоставления поддержки пользователям, улучшения пользовательского опыта и выполнения юридических обязательств." 
            },
            { 
                title: "4. Особенности блокчейна TON", 
                content: "В связи с природой блокчейн-технологии, ваш TON-адрес кошелька и история транзакций являются публично видимыми в блокчейне и не могут быть изменены или удалены." 
            },
            { 
                title: "5. Безопасность данных", 
                content: "Мы применяем соответствующие стандартам индустрии меры безопасности для защиты ваших данных. Однако мы не можем гарантировать абсолютную безопасность информации, передаваемой через интернет." 
            },
            { 
                title: "6. Сторонние сервисы", 
                content: "Мы интегрируемся с блокчейном TON и платформой Telegram Mini Apps. Эти третьи стороны имеют собственные политики конфиденциальности, регулирующие использование данных." 
            },
            { 
                title: "7. Права пользователя (Telegram Mini Apps)", 
                content: "Согласно документации Telegram для Mini Apps, вы имеете право: на доступ к вашим персональным данным, запрос на исправление неточностей, отзыв согласия на обработку и запрос на удаление данных вашего аккаунта. Вы можете осуществить эти права, связавшись с нами через нашего бота в Telegram." 
            },
            { 
                title: "8. Отказ от ответственности", 
                content: "Команда TON Mania не обещает и не гарантирует больших выигрышей. Приложение является игровым развлечением, и проигрыш всегда возможен. Используя TON Mania, вы осознаёте, что криптовалютные операции и азартные игры связаны с высокими рисками, и вы принимаете на себя полную ответственность за все возможные финансовые потери." 
            },
            { 
                title: "9. Изменения политики", 
                content: "Мы можем обновлять данную политику. Продолжение использования TON Mania после изменений означает принятие обновленной политики." 
            },
            { 
                title: "10. Контактная информация", 
                content: "По вопросам, связанным с конфиденциальностью, свяжитесь с нами через Telegram: @tonmania_support" 
            }
        ]
    };

    return (
        <div className={`loader-container ${currentLanguage === 'russian' ? 'russian' : 'english'}`}>
            <div className="loader-content">
                <h1 className="welcome-text">{texts[currentLanguage].welcome}</h1>
                <p className="instruction-text">{texts[currentLanguage].instruction}</p>
                
                <div className="progress-container">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progress}%` }}
                    ></div>
                    <div className="progress-text">{progress}%</div>
                </div>
                
                <p className="privacy-note">{texts[currentLanguage].privacyNote}</p>
                
                <div className="language-section">
                    <button 
                        className="privacy-policy-btn"
                        onClick={handlePrivacyPolicy}
                    >
                        {texts[currentLanguage].privacyPolicy}
                    </button>
                    
                    <div className="language-buttons">
                        <button 
                            className={`language-btn ${currentLanguage === 'english' ? 'active' : ''}`}
                            onClick={() => handleLanguageChange('english')}
                        >
                            English
                        </button>
                        <button 
                            className={`language-btn ${currentLanguage === 'russian' ? 'active' : ''}`}
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
                        {texts[currentLanguage].goButton}
                    </button>
                </div>
            </div>

            {/* Модальное окно политики конфиденциальности */}
            {showPrivacyModal && (
                <div className="modal-overlay" onClick={closePrivacyModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{texts[currentLanguage].privacyTitle}</h2>
                            <span className="modal-close" onClick={closePrivacyModal}>×</span>
                        </div>
                        <div className="modal-body">
                            <p className="modal-update-date">{texts[currentLanguage].lastUpdated}</p>
                            <div className="privacy-content">
                                {privacyPolicyContent[currentLanguage].map((section, index) => (
                                    <div key={index} className="privacy-section">
                                        <h3>{section.title}</h3>
                                        <p>{section.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loader;