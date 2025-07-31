import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import os
from dotenv import load_dotenv
from telegram.ext import MessageHandler, filters

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Получаем токен бота из переменных окружения
BOT_TOKEN = '8401693031:AAGvXrdi31EaVCY-re3z3KHfOSSjmYb3248'
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-domain.com/telegram_webapp.html')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /start"""
    user = update.effective_user
    
    # Создаем кнопку с мини-приложением
    keyboard = [
        [InlineKeyboardButton(
            "🎰 Открыть казино", 
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_html(
        f"Привет, {user.mention_html()}! 👋\n\n"
        "Добро пожаловать в <b>Lucky Casino Bot</b>! 🎰\n\n"
        "Нажмите кнопку ниже, чтобы открыть казино и начать играть:",
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /help"""
    help_text = """
🎰 <b>Lucky Casino Bot</b>

<b>Доступные команды:</b>
/start - Запустить бота и открыть казино
/help - Показать эту справку
/balance - Проверить баланс
/profile - Ваш профиль

<b>Игры в казино:</b>
• The Dog House Megaways
• Классические слоты
• Блэкджек
• Рулетка
• Покер

<b>Бонусы:</b>
• Приветственный бонус 200%
• Бездепозитный бонус 50€
• Программа лояльности

<b>Поддержка:</b>
По всем вопросам обращайтесь к @support
    """
    
    await update.message.reply_html(help_text)

async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /balance"""
    user_id = update.effective_user.id
    
    # Здесь должна быть логика получения баланса из базы данных
    # Пока используем заглушку
    balance_amount = 1000  # Получить из БД
    
    await update.message.reply_html(
        f"💰 <b>Ваш баланс:</b> {balance_amount}€\n\n"
        "Нажмите кнопку ниже, чтобы пополнить баланс или начать играть:",
        reply_markup=InlineKeyboardMarkup([[
            InlineKeyboardButton("🎰 Открыть казино", web_app=WebAppInfo(url=WEBAPP_URL))
        ]])
    )

async def profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /profile"""
    user = update.effective_user
    
    # Здесь должна быть логика получения профиля из базы данных
    # Пока используем заглушку
    profile_data = {
        'balance': 1000,
        'games_played': 15,
        'total_winnings': 2500,
        'registration_date': '2024-01-15'
    }
    
    profile_text = f"""
👤 <b>Профиль игрока</b>

<b>Имя:</b> {user.first_name}
<b>ID:</b> {user.id}
<b>Баланс:</b> {profile_data['balance']}€
<b>Игр сыграно:</b> {profile_data['games_played']}
<b>Общий выигрыш:</b> {profile_data['total_winnings']}€
<b>Дата регистрации:</b> {profile_data['registration_date']}

Нажмите кнопку ниже, чтобы открыть казино:
    """
    
    await update.message.reply_html(
        profile_text,
        reply_markup=InlineKeyboardMarkup([[
            InlineKeyboardButton("🎰 Открыть казино", web_app=WebAppInfo(url=WEBAPP_URL))
        ]])
    )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик нажатий на кнопки"""
    query = update.callback_query
    await query.answer()
    
    if query.data == "open_casino":
        await query.edit_message_text(
            "🎰 Открываю казино...\n\n"
            "Если мини-приложение не открылось автоматически, "
            "нажмите кнопку еще раз.",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🎰 Открыть казино", web_app=WebAppInfo(url=WEBAPP_URL))
            ]])
        )

async def webapp_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик данных от веб-приложения"""
    data = update.effective_message.web_app_data.data
    user_id = update.effective_user.id
    
    # Здесь можно обработать данные от веб-приложения
    # Например, обновить баланс, сохранить статистику и т.д.
    logger.info(f"Получены данные от веб-приложения от пользователя {user_id}: {data}")
    
    await update.message.reply_text(
        "✅ Данные от казино получены!\n\n"
        "Ваш игровой прогресс сохранен.",
        reply_markup=InlineKeyboardMarkup([[
            InlineKeyboardButton("🎰 Играть еще", web_app=WebAppInfo(url=WEBAPP_URL))
        ]])
    )

def main() -> None:
    """Запуск бота"""
    if not BOT_TOKEN:
        logger.error("BOT_TOKEN не найден в переменных окружения!")
        return
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики команд
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("balance", balance))
    application.add_handler(CommandHandler("profile", profile))
    
    # Добавляем обработчики кнопок
    application.add_handler(CallbackQueryHandler(button_callback))
    
    # Добавляем обработчик данных от веб-приложения
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, webapp_data))
    
    # Запускаем бота
    logger.info("Бот запущен...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main() 