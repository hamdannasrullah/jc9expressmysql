## PUSH Semua File ke GitHub
Create folder .gitignore ketik di dalamnya --> /node_modules

## Cara Instal HEROKU

npm install -g heroku-cli

## Versi HEROKU

heroku --version

##  Steps
1. heroku login
2. heroku create jc9expressmysql
3. git add .
4. git commit -m "push heroku"
5. git push origin master
6. git push heroku master
7. klik https://jc9expressmysql.herokuapp.com/

##  Upload ulang kode untuk update:
1. git add .
2. git commit -m "push heroku"
3. git push origin master
4. git push heroku master



## Apabila muncul error di Heroku:

di package.json, tambah di bagian

"scripts": {
    "start": "nodemon src/index.js",

## Lalu:

npm install nodemon
