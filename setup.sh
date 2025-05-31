#!/bin/bash

echo "🚀 Настройка проекта Calorie Tracker SPA..."

# Очистка предыдущей установки
if [ -d "node_modules" ]; then
  echo "📦 Удаление предыдущих зависимостей..."
  rm -rf node_modules package-lock.json
fi

# Установка зависимостей с флагом --legacy-peer-deps
echo "📦 Установка зависимостей..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при установке зависимостей"
  exit 1
fi

echo "✅ Зависимости установлены успешно"

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "Для запуска приложения выполните:"
echo "1. npm run mock-api  (в отдельном терминале)"
echo "2. npm run dev       (в основном терминале)"
echo ""
echo "Приложение будет доступно по адресу: http://localhost:3000"
echo "Mock API будет доступен по адресу: http://localhost:3001"
