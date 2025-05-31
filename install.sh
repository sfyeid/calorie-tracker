#!/bin/bash

echo "🚀 Установка Calorie Tracker SPA..."

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js версии 18 или выше."
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) найден"

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены успешно"

# Создание .env файла
if [ ! -f .env.local ]; then
    echo "📝 Создание .env.local файла..."
    cat > .env.local << EOL
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Calorie Tracker

# Development
NODE_ENV=development
EOL
    echo "✅ .env.local файл создан"
fi

echo ""
echo "🎉 Установка завершена!"
echo ""
echo "Для запуска приложения выполните:"
echo "1. npm run mock-api  (в отдельном терминале)"
echo "2. npm run dev       (в основном терминале)"
echo ""
echo "Приложение будет доступно по адресу: http://localhost:3000"
echo "Mock API будет доступен по адресу: http://localhost:3001"
