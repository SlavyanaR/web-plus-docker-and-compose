### _КупиПодариДай_

## Описание проекта

Бекэнд для готового [фронтенда](https://github.com/yandex-praktikum/kupipodariday-frontend/).

## Функционал:

- Создание профиля пользователя;
- Создание "списка желаний";
- Добавление/удаление желаний;
- Возможность скинуться на желание других пользователей.

## Стек технологий:

- TypeScript
- NestJS
- PostgreSQL
- TypeORM
- Passport.js

## Database (PostgreSQL)

Создать пользователя student:

    CREATE USER student WITH PASSWORD 'student';

Создать бд:

    CREATE DATABASE kupipodariday;

Дать привелегии student:

    GRANT ALL PRIVILEGES ON DATABASE kupipodariday TO student;

## Установка и запуск проекта:

Клонировать репозиторий:

    git clone https://github.com/MrStnr21/front-cloud-camp.git

Установить зависимостей:

    npm install

Собрать проект:

    npm run build

Запустить проект:

    npm run start:dev
