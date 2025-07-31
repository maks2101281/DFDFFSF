// The Dog House Megaways Game Logic
class DogHouseMegaways {
    constructor() {
        this.reels = 6;
        this.maxSymbols = 7;
        this.symbols = [
            '🐕', '🐩', '🦮', '🐕‍🦺', '🦴', '🏠', '🎾', '🥩', '💎', '7️⃣'
        ];
        this.symbolValues = {
            '🐕': 50,    // Wild Dog
            '🐩': 25,    // Poodle
            '🦮': 20,    // Retriever
            '🐕‍🦺': 15,  // Service Dog
            '🦴': 10,    // Bone
            '🏠': 8,     // House
            '🎾': 6,     // Ball
            '🥩': 5,     // Meat
            '💎': 100,   // Diamond
            '7️⃣': 200    // Lucky 7
        };
        this.currentReelStates = [];
        this.betAmount = 10;
        this.totalWinnings = 0;
        this.freeSpins = 0;
        this.multiplier = 1;
        this.isFreeSpinMode = false;
        
        this.initializeReels();
    }

    // Initialize reels with random symbols
    initializeReels() {
        this.currentReelStates = [];
        for (let i = 0; i < this.reels; i++) {
            const reelSymbols = [];
            const symbolCount = Math.floor(Math.random() * 3) + 5; // 5-7 symbols per reel
            
            for (let j = 0; j < symbolCount; j++) {
                const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                reelSymbols.push(randomSymbol);
            }
            this.currentReelStates.push(reelSymbols);
        }
    }

    // Spin the reels
    spin() {
        this.totalWinnings = 0;
        this.initializeReels();
        
        // Simulate spinning animation
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = this.evaluateSpin();
                resolve(result);
            }, 2000);
        });
    }

    // Evaluate the spin result
    evaluateSpin() {
        const result = {
            reels: this.currentReelStates,
            winnings: 0,
            freeSpins: 0,
            multiplier: this.multiplier,
            winningLines: []
        };

        // Check for winning combinations
        const winningCombos = this.findWinningCombinations();
        
        if (winningCombos.length > 0) {
            result.winningLines = winningCombos;
            result.winnings = this.calculateWinnings(winningCombos);
            this.totalWinnings = result.winnings;
        }

        // Check for scatter symbols (free spins)
        const scatterCount = this.countScatters();
        if (scatterCount >= 3) {
            result.freeSpins = this.calculateFreeSpins(scatterCount);
            this.freeSpins += result.freeSpins;
        }

        return result;
    }

    // Find winning combinations
    findWinningCombinations() {
        const winningLines = [];
        
        // Check horizontal lines (left to right)
        for (let row = 0; row < this.maxSymbols; row++) {
            let consecutiveCount = 1;
            let currentSymbol = null;
            
            for (let reel = 0; reel < this.reels; reel++) {
                const symbol = this.currentReelStates[reel][row] || this.currentReelStates[reel][0];
                
                if (symbol === currentSymbol || currentSymbol === null) {
                    if (symbol === currentSymbol) {
                        consecutiveCount++;
                    } else {
                        currentSymbol = symbol;
                        consecutiveCount = 1;
                    }
                } else {
                    // Check if we have a winning combination
                    if (consecutiveCount >= 3) {
                        winningLines.push({
                            type: 'horizontal',
                            symbol: currentSymbol,
                            count: consecutiveCount,
                            startReel: reel - consecutiveCount,
                            row: row
                        });
                    }
                    currentSymbol = symbol;
                    consecutiveCount = 1;
                }
            }
            
            // Check final combination
            if (consecutiveCount >= 3) {
                winningLines.push({
                    type: 'horizontal',
                    symbol: currentSymbol,
                    count: consecutiveCount,
                    startReel: this.reels - consecutiveCount,
                    row: row
                });
            }
        }

        return winningLines;
    }

    // Count scatter symbols
    countScatters() {
        let scatterCount = 0;
        for (let reel = 0; reel < this.reels; reel++) {
            for (let row = 0; row < this.currentReelStates[reel].length; row++) {
                if (this.currentReelStates[reel][row] === '🏠') {
                    scatterCount++;
                }
            }
        }
        return scatterCount;
    }

    // Calculate winnings
    calculateWinnings(winningLines) {
        let totalWinnings = 0;
        
        winningLines.forEach(line => {
            const symbolValue = this.symbolValues[line.symbol] || 1;
            const multiplier = this.getMultiplier(line.count);
            const lineWinnings = symbolValue * multiplier * this.betAmount * this.multiplier;
            totalWinnings += lineWinnings;
        });
        
        return Math.floor(totalWinnings);
    }

    // Get multiplier based on consecutive symbols
    getMultiplier(count) {
        const multipliers = {
            3: 1,
            4: 2,
            5: 5,
            6: 10,
            7: 25
        };
        return multipliers[count] || 1;
    }

    // Calculate free spins based on scatter count
    calculateFreeSpins(scatterCount) {
        const freeSpinsMap = {
            3: 15,
            4: 25,
            5: 50,
            6: 100
        };
        return freeSpinsMap[scatterCount] || 0;
    }

    // Start free spins mode
    startFreeSpins() {
        this.isFreeSpinMode = true;
        this.multiplier = 3; // 3x multiplier during free spins
        return this.freeSpins;
    }

    // End free spins mode
    endFreeSpins() {
        this.isFreeSpinMode = false;
        this.multiplier = 1;
        this.freeSpins = 0;
    }

    // Get current reel display
    getReelDisplay() {
        return this.currentReelStates.map(reel => {
            return reel.join(' ');
        });
    }

    // Set bet amount
    setBetAmount(amount) {
        this.betAmount = amount;
    }

    // Get game statistics
    getStats() {
        return {
            totalWinnings: this.totalWinnings,
            freeSpins: this.freeSpins,
            multiplier: this.multiplier,
            isFreeSpinMode: this.isFreeSpinMode
        };
    }
}

// Game UI Controller
class DogHouseUI {
    constructor(gameContainer) {
        this.game = new DogHouseMegaways();
        this.container = gameContainer;
        this.isSpinning = false;
        this.setupUI();
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="dog-house-game">
                <div class="game-header">
                    <h2>The Dog House Megaways</h2>
                    <div class="game-info">
                        <span class="balance">Баланс: <span id="gameBalance">1000€</span></span>
                        <span class="bet">Ставка: <span id="currentBet">10€</span></span>
                        <span class="winnings">Выигрыш: <span id="currentWinnings">0€</span></span>
                    </div>
                </div>
                
                <div class="reels-container">
                    <div class="reels" id="reelsDisplay"></div>
                </div>
                
                <div class="game-controls">
                    <div class="bet-controls">
                        <button class="btn btn-secondary" id="decreaseBet">-</button>
                        <span id="betAmount">10€</span>
                        <button class="btn btn-secondary" id="increaseBet">+</button>
                    </div>
                    <button class="btn btn-primary btn-large" id="spinBtn">SPIN</button>
                    <button class="btn btn-secondary" id="autoSpinBtn">AUTO</button>
                </div>
                
                <div class="game-features">
                    <div class="feature">
                        <span class="feature-label">Free Spins:</span>
                        <span class="feature-value" id="freeSpinsCount">0</span>
                    </div>
                    <div class="feature">
                        <span class="feature-label">Multiplier:</span>
                        <span class="feature-value" id="multiplierValue">1x</span>
                    </div>
                </div>
                
                <div class="winning-lines" id="winningLines"></div>
            </div>
        `;

        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        const spinBtn = this.container.querySelector('#spinBtn');
        const autoSpinBtn = this.container.querySelector('#autoSpinBtn');
        const decreaseBet = this.container.querySelector('#decreaseBet');
        const increaseBet = this.container.querySelector('#increaseBet');

        spinBtn.addEventListener('click', () => this.spin());
        autoSpinBtn.addEventListener('click', () => this.toggleAutoSpin());
        decreaseBet.addEventListener('click', () => this.changeBet(-5));
        increaseBet.addEventListener('click', () => this.changeBet(5));
    }

    async spin() {
        if (this.isSpinning) return;

        const user = window.userDB.getCurrentUser();
        if (!user) {
            showNotification('🔐 Необходимо войти в систему', 'error');
            return;
        }

        if (user.balance < this.game.betAmount) {
            showNotification('💰 Недостаточно средств', 'error');
            return;
        }

        this.isSpinning = true;
        const spinBtn = this.container.querySelector('#spinBtn');
        spinBtn.textContent = 'SPINNING...';
        spinBtn.disabled = true;

        // Deduct bet amount
        window.userDB.updateBalance(user.id, -this.game.betAmount);

        // Animate reels
        this.animateReels();

        // Get spin result
        const result = await this.game.spin();
        
        // Update display
        this.updateReelsDisplay(result.reels);
        
        // Show winnings
        if (result.winnings > 0) {
            this.showWinningLines(result.winningLines);
            window.userDB.updateBalance(user.id, result.winnings);
            window.userDB.updateGameStats(user.id, result.winnings);
            showNotification(`🎉 Выигрыш: ${result.winnings}€!`, 'success');
        }

        // Handle free spins
        if (result.freeSpins > 0) {
            this.game.startFreeSpins();
            showNotification(`🎁 ${result.freeSpins} Free Spins!`, 'success');
        }

        // Update UI
        this.updateDisplay();
        
        this.isSpinning = false;
        spinBtn.textContent = 'SPIN';
        spinBtn.disabled = false;
    }

    animateReels() {
        const reelsDisplay = this.container.querySelector('#reelsDisplay');
        reelsDisplay.style.animation = 'spin 0.5s ease-in-out';
        
        setTimeout(() => {
            reelsDisplay.style.animation = '';
        }, 500);
    }

    updateReelsDisplay(reels) {
        const reelsDisplay = this.container.querySelector('#reelsDisplay');
        reelsDisplay.innerHTML = '';
        
        reels.forEach((reel, reelIndex) => {
            const reelElement = document.createElement('div');
            reelElement.className = 'reel';
            
            reel.forEach((symbol, symbolIndex) => {
                const symbolElement = document.createElement('div');
                symbolElement.className = 'symbol';
                symbolElement.textContent = symbol;
                reelElement.appendChild(symbolElement);
            });
            
            reelsDisplay.appendChild(reelElement);
        });
    }

    showWinningLines(winningLines) {
        const winningLinesContainer = this.container.querySelector('#winningLines');
        winningLinesContainer.innerHTML = '';
        
        winningLines.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.className = 'winning-line';
            lineElement.textContent = `${line.count}x ${line.symbol} - ${this.game.symbolValues[line.symbol] * line.count * this.game.betAmount}€`;
            winningLinesContainer.appendChild(lineElement);
        });
    }

    changeBet(amount) {
        const newBet = this.game.betAmount + amount;
        if (newBet >= 1 && newBet <= 1000) {
            this.game.setBetAmount(newBet);
            this.updateDisplay();
        }
    }

    toggleAutoSpin() {
        // Auto spin functionality
        showNotification('🎮 Автоспин в разработке', 'info');
    }

    updateDisplay() {
        const user = window.userDB.getCurrentUser();
        if (user) {
            this.container.querySelector('#gameBalance').textContent = `${user.balance}€`;
        }
        
        this.container.querySelector('#currentBet').textContent = `${this.game.betAmount}€`;
        this.container.querySelector('#currentWinnings').textContent = `${this.game.totalWinnings}€`;
        this.container.querySelector('#betAmount').textContent = `${this.game.betAmount}€`;
        this.container.querySelector('#freeSpinsCount').textContent = this.game.freeSpins;
        this.container.querySelector('#multiplierValue').textContent = `${this.game.multiplier}x`;
    }
}

// Export for use in main script
window.DogHouseMegaways = DogHouseMegaways;
window.DogHouseUI = DogHouseUI; 