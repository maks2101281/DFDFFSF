// DOM Elements
const modal = document.getElementById('authModal');
const profileModal = document.getElementById('profileModal');
const gameModal = document.getElementById('gameModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const spinBtn = document.getElementById('spinBtn');
const slotReels = document.querySelectorAll('.slot-reel');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const gameCards = document.querySelectorAll('.game-card');
const bonusCards = document.querySelectorAll('.bonus-card');

// Auth elements
const authButtons = document.getElementById('authButtons');
const userPanel = document.getElementById('userPanel');
const userName = document.getElementById('userName');
const userBalance = document.getElementById('userBalance');
const profileBtn = document.getElementById('profileBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Form elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Profile elements
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileBalance = document.getElementById('profileBalance');
const profileGamesPlayed = document.getElementById('profileGamesPlayed');
const profileTotalWinnings = document.getElementById('profileTotalWinnings');

// Game elements
const gameTitle = document.getElementById('gameTitle');
const gameBalance = document.getElementById('gameBalance');
const betAmount = document.getElementById('betAmount');
const decreaseBet = document.getElementById('decreaseBet');
const increaseBet = document.getElementById('increaseBet');
const gameArea = document.getElementById('gameArea');
const playGameBtn = document.getElementById('playGameBtn');
const closeGameBtn = document.getElementById('closeGameBtn');

// Slot machine symbols
const symbols = ['🍒', '🍊', '🍇', '🍓', '🍎', '🍋', '💎', '7️⃣'];

// Current game state
let currentGame = null;
let currentBet = 10;
let dogHouseGame = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize application
function initializeApp() {
    // Check if userDB is available
    if (typeof window.userDB === 'undefined') {
        console.error('Database not loaded');
        return;
    }
    
    // Update UI based on authentication status
    updateAuthUI();
}

// Setup all event listeners
function setupEventListeners() {
    // Modal events
    loginBtn.addEventListener('click', openModal);
    registerBtn.addEventListener('click', () => {
        openModal();
        switchTab('register');
    });
    
    // Close modal events
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', closeAllModals);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // User panel events
    profileBtn.addEventListener('click', openProfileModal);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Game events
    gameCards.forEach(card => {
        card.addEventListener('click', handleGameCardClick);
    });
    
    bonusCards.forEach(card => {
        card.addEventListener('click', handleBonusCardClick);
    });
    
    // Slot machine
    spinBtn.addEventListener('click', spinSlot);
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Mobile menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Hero buttons
    const playNowBtn = document.getElementById('playNowBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (playNowBtn) {
        playNowBtn.addEventListener('click', () => {
            if (!userDB.isAuthenticated()) {
                showNotification('🔐 Необходимо войти в систему для игры', 'error');
                openModal();
            } else {
                showNotification('🎮 Перенаправление в игровой зал...', 'info');
            }
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Game modal events
    if (decreaseBet) decreaseBet.addEventListener('click', () => changeBet(-5));
    if (increaseBet) increaseBet.addEventListener('click', () => changeBet(5));
    if (playGameBtn) playGameBtn.addEventListener('click', playGame);
    if (closeGameBtn) closeGameBtn.addEventListener('click', closeGameModal);
    
    // Scroll events
    window.addEventListener('scroll', () => {
        parallaxEffect();
        animateOnScroll();
    });
    
    // Initial animation trigger
    animateOnScroll();
}

// Check authentication status
function checkAuthStatus() {
    if (userDB.isAuthenticated()) {
        updateAuthUI();
        updateUserInfo();
    }
}

// Update authentication UI
function updateAuthUI() {
    const isAuthenticated = userDB.isAuthenticated();
    
    if (isAuthenticated) {
        authButtons.style.display = 'none';
        userPanel.style.display = 'flex';
        updateUserInfo();
    } else {
        authButtons.style.display = 'flex';
        userPanel.style.display = 'none';
    }
}

// Update user information display
function updateUserInfo() {
    const user = userDB.getCurrentUser();
    if (user) {
        userName.textContent = user.name;
        userBalance.textContent = `${user.balance}€`;
        
        // Update profile modal if open
        if (profileModal.style.display === 'block') {
            updateProfileInfo();
        }
        
        // Update game modal if open
        if (gameModal.style.display === 'block') {
            gameBalance.textContent = `${user.balance}€`;
        }
    }
}

// Update profile information
function updateProfileInfo() {
    const user = userDB.getCurrentUser();
    if (user) {
        profileName.textContent = user.name;
        profileEmail.textContent = user.email;
        profileBalance.textContent = `${user.balance}€`;
        profileGamesPlayed.textContent = user.gamesPlayed;
        profileTotalWinnings.textContent = `${user.totalWinnings}€`;
    }
}

// Modal functionality
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    modal.style.display = 'none';
    profileModal.style.display = 'none';
    gameModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tab switching
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
            content.classList.add('active');
        }
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate inputs
    if (!email || !password) {
        showFormError('loginEmail', 'Все поля обязательны для заполнения');
        return;
    }
    
    const result = userDB.login(email, password);
    
    if (result.success) {
        showNotification(result.message, 'success');
        closeAllModals();
        updateAuthUI();
        loginForm.reset();
    } else {
        showNotification(result.message, 'error');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showFormError('registerName', 'Все поля обязательны для заполнения');
        return;
    }
    
    if (password.length < 6) {
        showFormError('registerPassword', 'Пароль должен содержать минимум 6 символов');
        return;
    }
    
    if (password !== confirmPassword) {
        showFormError('registerConfirmPassword', 'Пароли не совпадают');
        return;
    }
    
    const userData = { name, email, password };
    const result = userDB.register(userData);
    
    if (result.success) {
        showNotification(result.message, 'success');
        switchTab('login');
        registerForm.reset();
    } else {
        showNotification(result.message, 'error');
    }
}

// Handle logout
function handleLogout() {
    const result = userDB.logout();
    showNotification(result.message, 'success');
    updateAuthUI();
    closeAllModals();
}

// Open profile modal
function openProfileModal() {
    updateProfileInfo();
    profileModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show form error
function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #f44336; font-size: 0.8rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorDiv);
    }
}

// Clear form errors
function clearFormErrors() {
    document.querySelectorAll('.auth-form input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

// Slot machine functionality
function spinSlot() {
    if (!userDB.isAuthenticated()) {
        showNotification('🔐 Необходимо войти в систему для игры', 'error');
        openModal();
        return;
    }
    
    if (spinBtn.disabled) return;
    
    const user = userDB.getCurrentUser();
    if (user.balance < 10) {
        showNotification('💰 Недостаточно средств для игры', 'error');
        return;
    }
    
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    
    // Deduct bet amount
    userDB.updateBalance(user.id, -10);
    updateUserInfo();
    
    // Animate each reel
    slotReels.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.add('spinning');
            
            // Generate random symbols
            const randomSymbols = [];
            for (let i = 0; i < 3; i++) {
                randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
            
            setTimeout(() => {
                reel.textContent = randomSymbols.join(' ');
                reel.classList.remove('spinning');
                
                // Check for win on last reel
                if (index === slotReels.length - 1) {
                    checkWin(randomSymbols);
                }
            }, 500);
        }, index * 200);
    });
    
    setTimeout(() => {
        spinBtn.disabled = false;
        spinBtn.textContent = 'SPIN';
    }, 2000);
}

// Check for winning combination
function checkWin(symbols) {
    let winnings = 0;
    let message = '';
    
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        winnings = 100; // Jackpot
        message = '🎉 ДЖЕКПОТ! Вы выиграли 100€!';
    } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        winnings = 20; // Small win
        message = '🎊 Маленький выигрыш! Вы выиграли 20€!';
    } else {
        message = '😔 Попробуйте еще раз!';
    }
    
    if (winnings > 0) {
        const user = userDB.getCurrentUser();
        userDB.updateBalance(user.id, winnings);
        userDB.updateGameStats(user.id, winnings);
        updateUserInfo();
    } else {
        const user = userDB.getCurrentUser();
        userDB.updateGameStats(user.id, 0);
    }
    
    showNotification(message, winnings > 0 ? 'success' : 'info');
}

// Game card interactions
function handleGameCardClick() {
    if (!userDB.isAuthenticated()) {
        showNotification('🔐 Необходимо войти в систему для игры', 'error');
        openModal();
        return;
    }
    
    const gameType = this.dataset.game;
    const gameName = this.querySelector('h3').textContent;
    
    openGameModal(gameType, gameName);
}

// Bonus card interactions
function handleBonusCardClick() {
    if (!userDB.isAuthenticated()) {
        showNotification('🔐 Необходимо войти в систему для получения бонусов', 'error');
        openModal();
        return;
    }
    
    const bonusName = this.querySelector('h3').textContent;
    showNotification(`🎁 Активация бонуса: ${bonusName}`, 'success');
}

// Open game modal
function openGameModal(gameType, gameName) {
    currentGame = gameType;
    gameTitle.textContent = gameName;
    
    const user = userDB.getCurrentUser();
    gameBalance.textContent = `${user.balance}€`;
    betAmount.value = currentBet;
    
    // Setup game area based on game type
    setupGameArea(gameType);
    
    gameModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Setup game area
function setupGameArea(gameType) {
    gameArea.innerHTML = '';
    
    switch (gameType) {
        case 'slots':
            setupSlotGame();
            break;
        case 'blackjack':
            setupBlackjackGame();
            break;
        case 'roulette':
            setupRouletteGame();
            break;
        case 'poker':
            setupPokerGame();
            break;
        default:
            gameArea.innerHTML = '<p style="color: #ccc;">Игра в разработке</p>';
    }
}

// Setup slot game
function setupSlotGame() {
    gameArea.innerHTML = `
        <div class="slot-game">
            <div class="slot-window">
                <div class="slot-reel">🍒 🍊 🍇</div>
                <div class="slot-reel">🍒 🍊 🍇</div>
                <div class="slot-reel">🍒 🍊 🍇</div>
            </div>
            <button class="btn btn-primary" id="spinGameBtn">SPIN</button>
        </div>
    `;
    
    document.getElementById('spinGameBtn').addEventListener('click', () => {
        playSlotGame();
    });
}

// Setup The Dog House Megaways game
function setupDogHouseGame() {
    if (!dogHouseGame) {
        dogHouseGame = new DogHouseUI(gameArea);
    } else {
        dogHouseGame.updateDisplay();
    }
}

// Setup blackjack game
function setupBlackjackGame() {
    gameArea.innerHTML = `
        <div class="blackjack-game">
            <div class="dealer-cards">
                <h3>Дилер</h3>
                <div class="cards" id="dealerCards"></div>
            </div>
            <div class="player-cards">
                <h3>Игрок</h3>
                <div class="cards" id="playerCards"></div>
            </div>
            <div class="game-actions">
                <button class="btn btn-primary" id="hitBtn">Взять карту</button>
                <button class="btn btn-secondary" id="standBtn">Хватит</button>
            </div>
        </div>
    `;
}

// Setup roulette game
function setupRouletteGame() {
    gameArea.innerHTML = `
        <div class="roulette-game">
            <div class="roulette-wheel">
                <div class="wheel-number">0</div>
                <div class="wheel-number">32</div>
                <div class="wheel-number">15</div>
                <div class="wheel-number">19</div>
                <div class="wheel-number">4</div>
                <div class="wheel-number">21</div>
                <div class="wheel-number">2</div>
                <div class="wheel-number">25</div>
            </div>
            <div class="betting-area">
                <p>Выберите число для ставки</p>
                <input type="number" min="0" max="36" placeholder="0-36" id="rouletteBet">
            </div>
        </div>
    `;
}

// Setup poker game
function setupPokerGame() {
    gameArea.innerHTML = `
        <div class="poker-game">
            <div class="poker-table">
                <div class="community-cards">
                    <h3>Общие карты</h3>
                    <div class="cards" id="communityCards"></div>
                </div>
                <div class="player-hand">
                    <h3>Ваши карты</h3>
                    <div class="cards" id="playerHand"></div>
                </div>
            </div>
        </div>
    `;
}

// Play slot game
function playSlotGame() {
    const user = userDB.getCurrentUser();
    const bet = parseInt(betAmount.value);
    
    if (user.balance < bet) {
        showNotification('💰 Недостаточно средств', 'error');
        return;
    }
    
    userDB.updateBalance(user.id, -bet);
    updateUserInfo();
    
    // Simulate slot game
    const reels = gameArea.querySelectorAll('.slot-reel');
    let winnings = 0;
    
    reels.forEach((reel, index) => {
        setTimeout(() => {
            const symbols = ['🍒', '🍊', '🍇', '🍓', '🍎', '🍋', '💎', '7️⃣'];
            const randomSymbols = [];
            
            for (let i = 0; i < 3; i++) {
                randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
            
            reel.textContent = randomSymbols.join(' ');
            
            if (index === reels.length - 1) {
                // Check for win
                if (randomSymbols[0] === randomSymbols[1] && randomSymbols[1] === randomSymbols[2]) {
                    winnings = bet * 10;
                } else if (randomSymbols[0] === randomSymbols[1] || randomSymbols[1] === randomSymbols[2]) {
                    winnings = bet * 2;
                }
                
                if (winnings > 0) {
                    userDB.updateBalance(user.id, winnings);
                    userDB.updateGameStats(user.id, winnings);
                    showNotification(`🎉 Выигрыш: ${winnings}€!`, 'success');
                } else {
                    userDB.updateGameStats(user.id, 0);
                    showNotification('😔 Попробуйте еще раз!', 'info');
                }
                
                updateUserInfo();
            }
        }, index * 500);
    });
}

// Change bet amount
function changeBet(amount) {
    const newBet = parseInt(betAmount.value) + amount;
    if (newBet >= 1 && newBet <= 1000) {
        betAmount.value = newBet;
        currentBet = newBet;
    }
}

// Play game
function playGame() {
    if (currentGame === 'slots') {
        playSlotGame();
    } else if (currentGame === 'doghouse') {
        // The Dog House Megaways is handled by its own UI
        showNotification('🎮 Игра The Dog House Megaways активна', 'info');
    } else {
        showNotification('🎮 Игра в разработке', 'info');
    }
}

// Close game modal
function closeGameModal() {
    gameModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentGame = null;
    dogHouseGame = null;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Parallax effect for hero section
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.game-card, .bonus-card, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .game-card, .bonus-card, .stat {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .game-card.animate, .bonus-card.animate, .stat.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .slot-game {
        text-align: center;
    }
    
    .slot-game .slot-window {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 2rem;
        background: #1a1a2e;
        padding: 1rem;
        border-radius: 10px;
        border: 3px solid #ffd700;
    }
    
    .slot-game .slot-reel {
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        color: #1a1a2e;
    }
    
    .blackjack-game, .roulette-game, .poker-game {
        text-align: center;
        color: #fff;
    }
    
    .cards {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 1rem 0;
    }
    
    .game-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .roulette-wheel {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin: 2rem 0;
    }
    
    .wheel-number {
        width: 50px;
        height: 50px;
        background: #ffd700;
        color: #1a1a2e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .wheel-number:hover {
        transform: scale(1.1);
    }
    
    .betting-area {
        margin-top: 2rem;
    }
    
    .betting-area input {
        padding: 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        text-align: center;
        width: 100px;
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // Space to spin slot machine (only if not in input fields)
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (userDB.isAuthenticated() && !spinBtn.disabled) {
            spinSlot();
        }
    }
});

// Performance optimization
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        // Throttled scroll handling
    }, 16);
});

// Export functions for potential external use
window.CasinoApp = {
    spinSlot,
    showNotification,
    openModal,
    closeAllModals,
    userDB: window.userDB
}; 