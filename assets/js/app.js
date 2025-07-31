// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Получаем данные пользователя
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('userId').textContent = user.id;
}

// Переменные для игры
let currentGame = null;
let currentBet = 10;
let userBalance = 1000;

// Символы для слотов
const symbols = ['🍒', '🍊', '🍇', '🍎', '🍓', '🍉'];

// Функция открытия игры
function openGame(gameType) {
    currentGame = gameType;
    const modal = document.getElementById('gameModal');
    const gameTitle = document.getElementById('gameTitle');
    const gameContent = document.getElementById('gameContent');
    
    // Устанавливаем заголовок
    switch(gameType) {
        case 'doghouse':
            gameTitle.textContent = 'The Dog House Megaways';
            setupDogHouseGame(gameContent);
            break;
        case 'slots':
            gameTitle.textContent = 'Классические слоты';
            setupSlotGame(gameContent);
            break;
        case 'blackjack':
            gameTitle.textContent = 'Блэкджек';
            setupBlackjackGame(gameContent);
            break;
        case 'roulette':
            gameTitle.textContent = 'Рулетка';
            setupRouletteGame(gameContent);
            break;
        case 'poker':
            gameTitle.textContent = 'Покер';
            setupPokerGame(gameContent);
            break;
    }
    
    modal.style.display = 'block';
}

// Настройка игры The Dog House Megaways
function setupDogHouseGame(container) {
    container.innerHTML = `
        <div style="text-align: center;">
            <div style="background: #1a1a2e; padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                <h3 style="color: #ffd700; margin-bottom: 1rem;">🎰 The Dog House Megaways</h3>
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; margin: 1rem 0;">
                    ${Array(6).fill().map(() => 
                        `<div style="background: #fff; color: #1a1a2e; padding: 0.5rem; border-radius: 5px; font-size: 1.2rem; font-weight: bold;">🏠</div>`
                    ).join('')}
                </div>
                <div style="color: #ffd700; font-weight: bold; margin: 1rem 0;">
                    Множитель: x2 | Бесплатные спины: 0
                </div>
            </div>
            <div style="display: flex; justify-content: center; gap: 1rem; margin: 1rem 0;">
                <button class="bet-btn" onclick="changeBet(-5)">-5</button>
                <span class="bet-amount">${currentBet}€</span>
                <button class="bet-btn" onclick="changeBet(5)">+5</button>
            </div>
            <button class="spin-btn" onclick="spinDogHouse()">SPIN</button>
        </div>
    `;
}

// Настройка классических слотов
function setupSlotGame(container) {
    container.innerHTML = `
        <div class="slot-machine">
            <div class="slot-window">
                <div class="slot-reel" id="reel1">🍒</div>
                <div class="slot-reel" id="reel2">🍊</div>
                <div class="slot-reel" id="reel3">🍇</div>
            </div>
            <div class="bet-controls">
                <button class="bet-btn" onclick="changeBet(-5)">-5</button>
                <span class="bet-amount">${currentBet}€</span>
                <button class="bet-btn" onclick="changeBet(5)">+5</button>
            </div>
            <button class="spin-btn" onclick="spinSlot()">SPIN</button>
        </div>
    `;
}

// Настройка блэкджека
function setupBlackjackGame(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h3 style="color: #ffd700;">♠️ Блэкджек</h3>
            <p>Игра в разработке</p>
            <p style="color: #ccc; font-size: 0.9rem;">Скоро будет доступна!</p>
        </div>
    `;
}

// Настройка рулетки
function setupRouletteGame(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h3 style="color: #ffd700;">🎲 Рулетка</h3>
            <p>Игра в разработке</p>
            <p style="color: #ccc; font-size: 0.9rem;">Скоро будет доступна!</p>
        </div>
    `;
}

// Настройка покера
function setupPokerGame(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h3 style="color: #ffd700;">♥️ Покер</h3>
            <p>Игра в разработке</p>
            <p style="color: #ccc; font-size: 0.9rem;">Скоро будет доступна!</p>
        </div>
    `;
}

// Изменение ставки
function changeBet(amount) {
    currentBet = Math.max(5, Math.min(100, currentBet + amount));
    const betAmount = document.querySelector('.bet-amount');
    if (betAmount) {
        betAmount.textContent = currentBet + '€';
    }
}

// Спин для The Dog House
function spinDogHouse() {
    if (userBalance < currentBet) {
        showNotification('Недостаточно средств!', 'error');
        return;
    }
    
    userBalance -= currentBet;
    updateBalance();
    
    // Анимация спинов
    const reels = document.querySelectorAll('[style*="background: #fff"]');
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });
    
    setTimeout(() => {
        reels.forEach(reel => {
            reel.classList.remove('spinning');
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
        
        // Проверка выигрыша
        const winAmount = Math.random() > 0.7 ? currentBet * 2 : 0;
        if (winAmount > 0) {
            userBalance += winAmount;
            showNotification(`Поздравляем! Выигрыш: ${winAmount}€`, 'success');
        }
        
        updateBalance();
        sendDataToBot({
            game: 'doghouse',
            bet: currentBet,
            win: winAmount,
            balance: userBalance
        });
    }, 1000);
}

// Спин для классических слотов
function spinSlot() {
    if (userBalance < currentBet) {
        showNotification('Недостаточно средств!', 'error');
        return;
    }
    
    userBalance -= currentBet;
    updateBalance();
    
    const reels = document.querySelectorAll('.slot-reel');
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });
    
    setTimeout(() => {
        reels.forEach(reel => {
            reel.classList.remove('spinning');
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
        
        // Проверка выигрыша
        const reel1 = reels[0].textContent;
        const reel2 = reels[1].textContent;
        const reel3 = reels[2].textContent;
        
        let winAmount = 0;
        if (reel1 === reel2 && reel2 === reel3) {
            winAmount = currentBet * 3;
            showNotification(`Джекпот! Выигрыш: ${winAmount}€`, 'success');
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            winAmount = currentBet * 1.5;
            showNotification(`Выигрыш: ${winAmount}€`, 'success');
        }
        
        if (winAmount > 0) {
            userBalance += winAmount;
        }
        
        updateBalance();
        sendDataToBot({
            game: 'slots',
            bet: currentBet,
            win: winAmount,
            balance: userBalance
        });
    }, 1000);
}

// Обновление баланса
function updateBalance() {
    document.getElementById('userBalance').textContent = userBalance + '€';
}

// Показать профиль
function showProfile() {
    tg.showAlert(`
👤 Профиль пользователя

ID: ${user?.id || 'Неизвестно'}
Баланс: ${userBalance}€
Игр сыграно: ${Math.floor(Math.random() * 50) + 1}
Общий выигрыш: ${Math.floor(Math.random() * 1000) + 100}€

🎰 Статистика игр:
• The Dog House: ${Math.floor(Math.random() * 20) + 1} игр
• Классические слоты: ${Math.floor(Math.random() * 30) + 1} игр
• Блэкджек: 0 игр
• Рулетка: 0 игр
• Покер: 0 игр
    `);
}

// Показать бонусы
function showBonuses() {
    tg.showAlert(`
🎁 Доступные бонусы

🎯 Приветственный бонус
• 200% до 1000€ на первый депозит
• Минимальный депозит: 10€

💰 Бездепозитный бонус
• 50€ бесплатно для новых игроков
• Вейджер: x35

⭐ Программа лояльности
• До 15% кэшбэк каждую неделю
• Эксклюзивные турниры
• Персональный менеджер

🎪 Еженедельные турниры
• Призовой фонд: 10,000€
• Участие бесплатно
• Рейтинговая система

Для активации бонусов обратитесь в поддержку!
    `);
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Отправить данные в бота
function sendDataToBot(data) {
    if (tg.isVersionAtLeast('6.1')) {
        tg.sendData(JSON.stringify(data));
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeModal();
    }
} 