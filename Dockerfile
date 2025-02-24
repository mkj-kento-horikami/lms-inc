# ベースイメージとしてNode.jsを使用
FROM node:14

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Babelのバージョンを更新
RUN npm install @babel/core@latest

# アプリケーションをビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "start"]