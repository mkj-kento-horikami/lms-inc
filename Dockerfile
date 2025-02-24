# ベースイメージを最新のLTSバージョンに変更
FROM node:18-alpine

# 作業ディレクトリを作成
WORKDIR /app

# 依存関係をインストール
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps

# アプリケーションのソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# アプリケーションを公開するポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]