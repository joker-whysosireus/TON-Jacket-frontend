import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './Pages/Home/Home.jsx';
import Friends from './Pages/Friends/Friends.jsx';
import Tasks from './Pages/Tasks/Tasks.jsx';
import Loader from './Assets/Loader/Loader.jsx';
import Profile from './Pages/Profile/Profile.jsx'

const AUTH_FUNCTION_URL = 'https://giftsblocksbackend.store/.netlify/functions/auth';

const App = () => {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);
    const [userData, setUserData] = useState(null);
    const [authCheckLoading, setAuthCheckLoading] = useState(true);
    const [telegramReady, setTelegramReady] = useState(false);
    const [loaderCompleted, setLoaderCompleted] = useState(false);
    const adIntervalRef = useRef(null);

    // Оригинальный useEffect для Telegram WebApp
    useEffect(() => {
        console.log("App.jsx: useEffect triggered");

        const isTelegramWebApp = () => {
            try {
                return window.Telegram && window.Telegram.WebApp;
            } catch (e) {
                return false;
            }
        };

        if (isTelegramWebApp()) {
            try {
                const webApp = window.Telegram.WebApp;
                console.log("Telegram WebApp detected, initializing...");
                
                // Fullscreen mode логика из другого файла
                webApp.expand();
                webApp.requestFullscreen();
                webApp.isVerticalSwipesEnabled = false;
                
                if (webApp.disableSwipeToClose) {
                    webApp.disableSwipeToClose();
                }
                
                if (webApp.enableClosingConfirmation) {
                    webApp.enableClosingConfirmation();
                }
                
                console.log("Telegram WebApp initialized successfully");
                setTelegramReady(true);
            } catch (error) {
                console.error("Error initializing Telegram WebApp:", error);
                setTelegramReady(true);
            }
        } else {
            console.warn("Not in Telegram WebApp environment, running in standalone mode");
            setTelegramReady(true);
        }

        return () => {
            if (isTelegramWebApp() && window.Telegram.WebApp.disableClosingConfirmation) {
                window.Telegram.WebApp.disableClosingConfirmation();
            }
        };
    }, []);

    useEffect(() => {
        if (['/', '/friends'].includes(location.pathname)) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [location.pathname]);

    useEffect(() => {
        if (telegramReady) {
            console.log("App.jsx: Starting authentication check");
            
            const getInitData = () => {
                try {
                    return window.Telegram?.WebApp?.initData || '';
                } catch (e) {
                    return '';
                }
            };

            const initData = getInitData();
            console.log("App.jsx: initData available:", !!initData);

            if (initData) {
                console.log("App.jsx: Sending authentication request");
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Authentication timeout")), 10000)
                );
                
                const authPromise = fetch(AUTH_FUNCTION_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                });

                Promise.race([authPromise, timeoutPromise])
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("App.jsx: Authentication response received");
                        if (data.isValid) {
                            console.log("App.jsx: Authentication successful");
                            setUserData(data.userData);
                        } else {
                            console.error("App.jsx: Authentication failed");
                            setUserData(null);
                        }
                    })
                    .catch(error => {
                        console.error("App.jsx: Authentication error:", error);
                        setUserData(null);
                    })
                    .finally(() => {
                        console.log("App.jsx: Authentication process completed");
                        setAuthCheckLoading(false);
                    });
            } else {
                console.warn("App.jsx: No initData available");
                setAuthCheckLoading(false);
            }
        }
    }, [telegramReady]);

    const updateUserData = async () => {
        try {
            const initData = window.Telegram?.WebApp?.initData || '';
            const response = await axios.post(AUTH_FUNCTION_URL, { initData });
            setUserData(response.data.userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleLoaderComplete = () => {
        setLoaderCompleted(true);
    };

    // Показываем Loader до тех пор, пока не завершится загрузка и пользователь не нажмет кнопку
    if (!loaderCompleted || authCheckLoading) {
        return <Loader userData={userData} onComplete={handleLoaderComplete} />;
    }

    return (
        <Routes location={location}>
            <Route path="/" element={<Home isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
            <Route path="/friends" element={<Friends isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
            <Route path="/tasks" element={<Tasks isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
            <Route path="/profile" element={<Profile isActive={isActive} userData={userData} updateUserData={updateUserData} />} />
        </Routes>
    );
};

const Main = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default Main;