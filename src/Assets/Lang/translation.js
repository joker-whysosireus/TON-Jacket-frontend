// translations.js
export const translations = {
  english: {
    // Profile Page
    profile: {
      headerDescription: "Withdraw TON to your wallet, convert coins to TON, or top up your balance in TON",
      connectWallet: "Connect Wallet",
      notConnected: "Not connected",
      withdrawal: "Withdrawal",
      withdrawalDescription: "Withdraw TON to your wallet",
      conversion: "Conversion",
      conversionDescription: "Convert coins to TON", 
      topup: "Top-up",
      topupDescription: "Add TON to your balance",
      disconnectConfirm: "Are you sure you want to disconnect your wallet?",
    },

    // Profile Modals
    profileModals: {
      convert: {
        title: "💰 Convert Coins to TON",
        availableForConversion: "Available for conversion",
        conversionRate: "🏅1000 coins = 0.01 TON",
        minimumConversion: "Minimum conversion: 1000 coins",
        youWillReceive: "You will receive",
        convertButton: "CONVERT TO TON",
        success: "Success!",
        converting: "Converting..."
      },
      deposit: {
        title: "💰 Deposit TON",
        selectAmount: "Select amount to deposit",
        depositButton: "Deposit {amount} TON",
        success: "Success!",
        depositing: "Depositing...",
        bonusText: "Get {total} TON with 1.5x bonus!",
        bonusTitle: "SPECIAL OFFER!",
        bonusSubtitle: "1.5x Deposit Bonus - 2 weeks only!",
        bonusBadge: "+50% BONUS",
        promoNotice: "Limited Time: Get 1.5x on all deposits! Offer ends in 2 weeks.",
        youWillReceive: "You will receive",
        bonusAmount: "+{amount} TON bonus"
      },
      withdraw: {
        title: "💰 Withdraw TON",
        availableForWithdrawal: "Available for withdrawal",
        walletPlaceholder: "Wallet address (EQ...)",
        amountPlaceholder: "Amount (TON)",
        maxButton: "MAX",
        notice1: "⚠️ Withdrawal may take up to 21 days to process.",
        notice2: "The bot will send you a notification when your TON transfer is completed.",
        withdrawButton: "WITHDRAW TON",
        success: "Success!",
        processing: "Processing..."
      }
    },
    
    // Gifts Page
    gifts: {
      title: "Coming Soon: Exclusive Telegram Gifts",
      description: "The TON Mania team is working on Telegram Stars integration so you can receive unique gifts that you can purchase or win directly in our slot machine! Soon, you'll be able to earn amazing Telegram gifts using Stars and showcase them on your profile. Details will be published on our Telegram channel.",
      channelButton: "📢 Check Our Channel Post"
    },
    
    // Friends Page  
    friends: {
      inviteFriends: "Invite Friends",
      referralCode: "Your Referral Code",
      copy: "Copy",
      copied: "Copied!",
      shareMessage: "Join me in TON Mania and get bonus coins! Use my code:",
      friendsList: "Your Friends",
      noFriends: "No friends invited yet",
      invited: "invited",
      coinsFromInvites: "Coins from Invites",
      friendsInvited: "Friends Invited"
    },
    
    // Tasks Page
    tasks: {
      titleLine1: "Get rewards for completing partners,",
      titleLine2: "daily and main tasks",
      watch: "Watch",
      subscribe: "Subscribe", 
      get: "Get",
      done: "Done!",
      unavailable: "Unavailable",
      loading: "Loading...",
      tasks: [
        { title: "Watch a short video" },
        { title: "Subscribe to our channel" },
        { title: "Invite 5 friends" },
        { title: "Invite 10 friends" },
        { title: "Invite 25 friends" },
        { title: "Invite 50 friends" },
        { title: "Make a bet of 5 TON" },
        { title: "Make a bet of 25 TON" },
        { title: "Make a bet of 50 TON" }
      ]
    },
    
    // Home Page
    home: {
      spinButton: "SPIN",
      autoSpin: "AUTO SPIN",
      stopAutoSpin: "STOP AUTO SPIN",
      welcomeMessage: "Welcome! Place your bet and spin!",
      spinning: "Spinning...",
      notEnoughTON: "Not enough TON for this bet!",
      bustMessage: "BUST! {name} - you lose your bet!",
      winMessage: "Win! {name} x{multiplier} ({amount} TON)",
      noWinMessage: "No win this time. Try again!",
      errorProcessing: "Error processing result: {error}",
      errorDuringSpin: "Error during spin: {error}",
      pleaseSelectValidBet: "Please select a valid bet amount",
      comingSoon: "Coming soon"
    },
    
    // Balance Section
    balance: {
      coins: "Coins",
      ton: "TON",
      yourBalance: "Your Balance",
      addTON: "Add TON",
      addCoins: "Add Coins"
    },
    
    // Bet Modal
    betModal: {
      title: "🚀 Place Your Bet",
      yourBetAmount: "Your Bet Amount",
      availableBalance: "Available Balance:",
      quickBetAmounts: "Quick Bet Amounts:",
      confirmBetSpin: "Confirm Bet & Spin"
    },
    
    // Instructions Modal
    instructionsModal: {
      title: "🎰 Winning Combinations",
      gameRules: "Game Rules:",
      rulesList: [
        "Three identical symbols: Jackpot win (highest payouts)",
        "Two identical symbols: Double win (medium payouts)", 
        "Three different fruits: Fruit mix win (small payout)",
        "Special combinations: Bonus wins with specific patterns",
        "Skull symbols: Cause busts - you lose your bet!",
        "Any other combination: No win - try again!"
      ],
      symbolWeights: "Symbol Weights:",
      symbolWeightsDescription: "Some symbols appear more frequently than others:",
      jackpotsTitle: "🎯 JACKPOTS (Three Identical Symbols):",
      specialCombinationsTitle: "⭐ SPECIAL COMBINATIONS:",
      doubleCombinationsTitle: "🔔 DOUBLE COMBINATIONS (Two Identical + Any):",
      fruitMixesTitle: "🍓 FRUIT MIXES (Any Three Different Fruits):",
      lossCombinationsTitle: "💀 LOSS COMBINATIONS (You Lose Your Bet):",
      andMore: "... and 7 more",
      bust: "BUST"
    },
    
    // Bet Result and Instruction
    betResult: {
      instruction: "Choose what you will play for. Click \"Instructions\" to learn how to play and see winning combinations!"
    },
    
    // Common
    common: {
      instructions: "📖 Instructions",
      spinOnTON: "Spin on TON",
      spinOnGifts: "Spin on Gifts",
      cancel: "Cancel",
      confirm: "Confirm",
      close: "Close",
      loading: "Loading..."
    }
  },
  
  russian: {
    // Profile Page
    profile: {
      headerDescription: "Выводите TON в свой кошелек, конвертируйте монеты в TON или пополняйте баланс в TON",
      connectWallet: "Подключить кошелек",
      notConnected: "Не подключен", 
      withdrawal: "Вывод",
      withdrawalDescription: "Вывести TON в свой кошелек",
      conversion: "Конвертация",
      conversionDescription: "Конвертировать монеты в TON",
      topup: "Пополнение",
      topupDescription: "Добавить TON на баланс",
      disconnectConfirm: "Вы уверены, что хотите отключить свой кошелек?",
    },

    // Profile Modals
    profileModals: {
      convert: {
        title: "💰 Конвертировать монеты в TON",
        availableForConversion: "Доступно для конвертации",
        conversionRate: "🏅1000 монет = 0.01 TON",
        minimumConversion: "Минимум для конвертации: 1000 монет",
        youWillReceive: "Вы получите",
        convertButton: "КОНВЕРТИРОВАТЬ В TON",
        success: "Успех!",
        converting: "Конвертация..."
      },
      deposit: {
        title: "💰 Пополнить TON",
        selectAmount: "Выберите сумму для пополнения",
        depositButton: "Пополнить {amount} TON",
        success: "Успех!",
        depositing: "Пополнение...",
        bonusText: "Получите {total} TON с бонусом 1.5x!",
        bonusTitle: "СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ!",
        bonusSubtitle: "Бонус 1.5x на пополнение - только 2 недели!",
        bonusBadge: "+50% БОНУС",
        promoNotice: "Ограниченное время: Получайте 1.5x на все пополнения! Предложение действует 2 недели.",
        youWillReceive: "Вы получите",
        bonusAmount: "+{amount} TON бонус"
      },
      withdraw: {
        title: "💰 Вывести TON",
        availableForWithdrawal: "Доступно для вывода",
        walletPlaceholder: "Адрес кошелька (EQ...)",
        amountPlaceholder: "Сумма (TON)",
        maxButton: "МАКС",
        notice1: "⚠️ Вывод может занять до 21 дня.",
        notice2: "Бот отправит вам уведомление, когда перевод TON будет завершен.",
        withdrawButton: "ВЫВЕСТИ TON",
        success: "Успех!",
        processing: "Обработка..."
      }
    },
    
    // Gifts Page
    gifts: {
      title: "Скоро: Эксклюзивные Подарки Telegram",
      description: "Команда TON Mania работает над интеграцией с Telegram Stars, чтобы предложить вам уникальные подарки, которые можно купить или выиграть прямо в нашем игровом автомате! Скоро вы сможете крутить слоты за Stars и получать крутые подарки для вашего профиля.",
      channelButton: "📢 Посмотреть пост в канале"
    },
    
    // Friends Page
    friends: {
      inviteFriends: "Пригласить друзей",
      referralCode: "Ваш реферальный код",
      copy: "Копировать",
      copied: "Скопировано!",
      shareMessage: "Присоединяйся к TON Mania и получи бонусные монеты! Используй мой код:",
      friendsList: "Ваши друзья",
      noFriends: "Пока нет приглашенных друзей",
      invited: "приглашен(а)",
      coinsFromInvites: "Монет за приглашения",
      friendsInvited: "Приглашено друзей"
    },
    
    // Tasks Page
    tasks: {
      titleLine1: "Получайте награды за выполнение",
      titleLine2: "партнерских, ежедневных и основных заданий",
      watch: "Смотреть",
      subscribe: "Подписаться",
      get: "Получить", 
      done: "Готово!",
      unavailable: "Недоступно",
      loading: "Загрузка...",
      tasks: [
        { title: "Посмотрите короткое видео" },
        { title: "Подпишитесь на наш канал" },
        { title: "Пригласите 5 друзей" },
        { title: "Пригласите 10 друзей" },
        { title: "Пригласите 25 друзей" },
        { title: "Пригласите 50 друзей" },
        { title: "Сделайте ставку на 5 TON" },
        { title: "Сделайте ставку на 25 TON" },
        { title: "Сделайте ставку на 50 TON" }
      ]
    },
    
    // Home Page
    home: {
      spinButton: "КРУТИТЬ",
      autoSpin: "АВТОСПИН",
      stopAutoSpin: "ОСТАНОВИТЬ АВТОСПИН",
      welcomeMessage: "Добро пожаловать! Время сделать ставку!",
      spinning: "Вращается...",
      notEnoughTON: "Недостаточно TON для этой ставки!",
      bustMessage: "ПРОИГРЫШ! {name} - вы теряете свою ставку!",
      winMessage: "Выигрыш! {name} x{multiplier} ({amount} TON)",
      noWinMessage: "В этот раз не повезло. Попробуйте еще раз!",
      errorProcessing: "Ошибка обработки результата: {error}",
      errorDuringSpin: "Ошибка во время вращения: {error}",
      pleaseSelectValidBet: "Пожалуйста, выберите корректную сумму ставки",
      comingSoon: "Скоро"
    },
    
    // Balance Section
    balance: {
      coins: "Монеты",
      ton: "TON",
      yourBalance: "Ваш баланс",
      addTON: "Добавить TON",
      addCoins: "Добавить монеты"
    },
    
    // Bet Modal
    betModal: {
      title: "🚀 Сделайте ставку",
      yourBetAmount: "Ваша сумма ставки",
      availableBalance: "Доступный баланс:",
      quickBetAmounts: "Быстрые ставки:",
      confirmBetSpin: "Подтвердить ставку и крутить"
    },
    
    // Instructions Modal
    instructionsModal: {
      title: "🎰 Выигрышные комбинации",
      gameRules: "Правила игры:",
      rulesList: [
        "Три одинаковых символа: Джекпот (максимальные выплаты)",
        "Два одинаковых символа: Двойной выигрыш (средние выплаты)",
        "Три разных фрукта: Фруктовый микс (небольшая выплата)",
        "Специальные комбинации: Бонусные выигрыши с определенными паттернами",
        "Символы черепа: Приносят проигрыш - вы теряете ставку!",
        "Любая другая комбинация: Без выигрыша - попробуйте еще раз!"
      ],
      symbolWeights: "Вероятности символов:",
      symbolWeightsDescription: "Некоторые символы появляются чаще других:",
      jackpotsTitle: "🎯 ДЖЕКПОТЫ (Три одинаковых символа):",
      specialCombinationsTitle: "⭐ СПЕЦИАЛЬНЫЕ КОМБИНАЦИИ:",
      doubleCombinationsTitle: "🔔 ДВОЙНЫЕ КОМБИНАЦИИ (Два одинаковых + любой):",
      fruitMixesTitle: "🍓 ФРУКТОВЫЕ МИКСЫ (Любые три разных фрукта):",
      lossCombinationsTitle: "💀 ПРОИГРЫШНЫЕ КОМБИНАЦИИ (Вы теряете ставку):",
      andMore: "... и еще 7",
      bust: "ПРОИГРЫШ"
    },
    
    // Bet Result and Instruction
    betResult: {
      instruction: "Выберите, на что будете играть. Нажмите \"Инструкции\", чтобы узнать правила игры и увидеть выигрышные комбинации!"
    },
    
    // Common
    common: {
      instructions: "📖 Инструкции",
      spinOnTON: "Крутить на TON",
      spinOnGifts: "Крутить на подарки",
      cancel: "Отмена",
      confirm: "Подтвердить",
      close: "Закрыть",
      loading: "Загрузка..."
    }
  }
};

// Вспомогательная функция для форматирования строк с параметрами
export const formatString = (str, params = {}) => {
  return str.replace(/{(\w+)}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};