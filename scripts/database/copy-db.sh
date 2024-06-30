#!/bin/bash

# .env 파일에서 환경 변수 로드
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env 파일을 찾을 수 없습니다."
    exit 1
fi

# 필요한 변수들이 설정되었는지 확인
required_vars="DB_PRODUCTION_HOST DB_PRODUCTION_PORT DB_PRODUCTION_USER DB_PRODUCTION_PASSWORD DB_PRODUCTION_NAME DB_PORT DB_USER DB_PASSWORD DB_NAME"
for var in $required_vars; do
    if [ -z "${!var}" ]; then
        echo "오류: $var 가 설정되지 않았습니다."
        exit 1
    fi
done

mysqldump -h $DB_PRODUCTION_HOST -P $DB_PRODUCTION_PORT -u $DB_PRODUCTION_USER -p$DB_PRODUCTION_PASSWORD $DB_PRODUCTION_NAME | mysql -h localhost -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME