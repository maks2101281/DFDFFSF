// Простая база данных пользователей (в реальном проекте использовался бы сервер)
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('casino_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('casino_current_user')) || null;
    }

    // Регистрация нового пользователя
    register(userData) {
        // Проверка, существует ли пользователь
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password), // В реальном проекте использовалось бы bcrypt
            balance: 1000, // Начальный баланс
            registrationDate: new Date().toISOString(),
            gamesPlayed: 0,
            totalWinnings: 0,
            isActive: true
        };

        this.users.push(newUser);
        this.saveToStorage();
        
        return { success: true, message: 'Регистрация успешна!', user: newUser };
    }

    // Вход пользователя
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.isActive);
        
        if (!user) {
            return { success: false, message: 'Пользователь не найден' };
        }

        if (this.hashPassword(password) !== user.password) {
            return { success: false, message: 'Неверный пароль' };
        }

        this.currentUser = user;
        localStorage.setItem('casino_current_user', JSON.stringify(user));
        
        return { success: true, message: 'Вход выполнен успешно!', user: user };
    }

    // Выход пользователя
    logout() {
        this.currentUser = null;
        localStorage.removeItem('casino_current_user');
        return { success: true, message: 'Выход выполнен успешно!' };
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Обновление баланса пользователя
    updateBalance(userId, amount) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].balance += amount;
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser.balance += amount;
                localStorage.setItem('casino_current_user', JSON.stringify(this.currentUser));
            }
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Обновление статистики игр
    updateGameStats(userId, winnings = 0) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].gamesPlayed += 1;
            this.users[userIndex].totalWinnings += winnings;
            
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser.gamesPlayed += 1;
                this.currentUser.totalWinnings += winnings;
                localStorage.setItem('casino_current_user', JSON.stringify(this.currentUser));
            }
            
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Простое хеширование пароля (в реальном проекте использовался бы bcrypt)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    // Сохранение в localStorage
    saveToStorage() {
        localStorage.setItem('casino_users', JSON.stringify(this.users));
    }

    // Получение всех пользователей (для админа)
    getAllUsers() {
        return this.users.filter(user => user.isActive);
    }

    // Удаление пользователя
    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].isActive = false;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Проверка авторизации
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Получение топ игроков
    getTopPlayers(limit = 10) {
        return this.users
            .filter(user => user.isActive)
            .sort((a, b) => b.totalWinnings - a.totalWinnings)
            .slice(0, limit);
    }
}

// Создание глобального экземпляра базы данных
window.userDB = new UserDatabase(); 