# Calorie Tracker SPA

Современное SPA-приложение для учета калорий, планирования рациона и отслеживания нутриентов.

## Технический стек

- **Frontend**: Next.js 14, React 18, TypeScript 5
- **State Management**: Redux Toolkit + RTK Query
- **UI**: Material UI v5
- **Forms**: React Hook Form + Yup
- **Charts**: Recharts 2
- **Routing**: React Router 7
- **Styling**: Emotion + MUI Theme
- **Linting**: ESLint + Prettier (Airbnb config)

## Быстрый старт

### 1. Установка зависимостей

\`\`\`bash
npm install
\`\`\`

### 2. Запуск mock API сервера

\`\`\`bash
npm run mock-api
\`\`\`

Mock API будет доступен по адресу: http://localhost:3001

### 3. Запуск приложения в режиме разработки

\`\`\`bash
npm run dev
\`\`\`

Приложение будет доступно по адресу: http://localhost:3000

### 4. Сборка для продакшена

\`\`\`bash
npm run build
npm start
\`\`\`

## Доступные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшена
- `npm run start` - запуск продакшен версии
- `npm run lint` - проверка кода линтером
- `npm run type-check` - проверка типов TypeScript
- `npm run mock-api` - запуск mock API сервера

## Структура проекта

\`\`\`
├── app/                    # Next.js App Router
│   ├── auth/              # Страницы аутентификации
│   ├── dashboard/         # Дашборд пользователя
│   └── diary/             # Дневник питания
├── components/            # Переиспользуемые компоненты
│   ├── ui/               # UI компоненты
│   └── dashboard/        # Компоненты дашборда
├── features/             # Feature-слайсы (FSD)
│   ├── auth/            # Аутентификация
│   ├── user/            # Пользователь
│   └── diary/           # Дневник питания
├── lib/                 # Утилиты и конфигурация
├── types/               # TypeScript типы
└── db.json             # Mock данные для json-server
\`\`\`

## Тестовые данные

Для входа в систему используйте:
- **Email**: user@example.com
- **Password**: password123

## Функционал MVP

✅ **Реализовано:**
- Система аутентификации
- Дашборд с основными метриками
- Базовый дневник питания
- Адаптивный дизайн
- Темная/светлая тема

🚧 **В разработке:**
- Расширенная база продуктов
- Конструктор рецептов
- Детальная аналитика
- Календарь планирования
- Экспорт данных
- Чат с диетологом

## API Endpoints

Mock API предоставляет следующие endpoints:

- `GET /users` - список пользователей
- `GET /foods` - база продуктов
- `GET /diary` - записи дневника питания
- `POST /auth/login` - аутентификация
- `POST /auth/register` - регистрация

## Разработка

Проект следует принципам Feature-Sliced Design (FSD) для масштабируемой архитектуры.

### Добавление новой фичи

1. Создайте папку в `features/`
2. Добавьте slice для состояния
3. Создайте API endpoints
4. Добавьте компоненты в `components/`
5. Обновите роутинг в `app/`

### Стилизация

Используется Material UI с кастомной темой. Настройки темы находятся в `lib/theme.ts`.

## Производительность

- Ленивая загрузка компонентов
- Мемоизация с React.memo
- Оптимизация re-renders с useCallback
- Code splitting по роутам

## Доступность

- Keyboard navigation
- ARIA attributes
- Screen reader support
- High contrast support
