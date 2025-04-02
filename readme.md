
# System Monitor

> **⚠️ Внимание:** Проект находится в стадии разработки. Функциональность может быть изменена.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" />
</p>

## Описание

**System Monitor** — это приложение для мониторинга системных ресурсов компьютера в реальном времени. Оно предоставляет информацию о загрузке процессора, использовании оперативной памяти, состоянии дисков и других параметрах.

## Текущий статус

- [x] Инициализация проекта
- [ ] Реализация отображения загрузки процессора
- [ ] Добавление графиков использования памяти
- [ ] Интеграция с системными уведомлениями

## Технологии

Проект разработан с использованием следующих технологий:

- **Node.js**: серверная часть приложения.
- **Electron**: создание кроссплатформенного десктопного приложения.
- **JavaScript**, **HTML**, **CSS**: фронтенд-разработка интерфейса пользователя.

## Установка и запуск

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/aket0r/system-monitor.git
   ```

2. **Перейдите в директорию проекта:**

   ```bash
   cd system-monitor
   ```

3. **Установите зависимости:**

   ```bash
   npm install
   ```

   Или запустите скрипт `required.bat` для автоматической установки зависимостей.

4. **Запустите приложение:**

   ```bash
   npm start
   ```

   Либо используйте скрипт `start.bat`.

## Планы по развитию

- Добавление возможности мониторинга сетевой активности.
- Реализация настройки оповещений при превышении заданных порогов нагрузки.
- Поддержка нескольких языков интерфейса.

## Лицензия

Этот проект лицензирован под лицензией [Apache-2.0](LICENSE).
