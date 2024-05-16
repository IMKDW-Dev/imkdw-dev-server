#!/bin/bash

# .env 파일에서 환경 변수 불러오기
export $(grep -v '^#' .env | xargs)

# 환경 변수 값을 사용하여 MySQL 명령 실행
mysql -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "DROP DATABASE $DB_NAME; CREATE DATABASE $DB_NAME;"

# Prisma 명령 실행
npx prisma db push 
npx prisma db seed