# 1. Base Image
FROM node:23.3.0-alphine

# 2. 작업 디렉토리 설정
WORKDIR /src/app

# 3. 패키지 파일을 복사하고 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. application 코드 복사
COPY . .

# 5. 빌드 실행
RUN pnpm run build

# 6. 포트 노출
EXPOSE 3000

# 7. 애플리케이션 시작
CMD ["pnpm", "start"]