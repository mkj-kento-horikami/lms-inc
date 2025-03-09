# inc-lms プロジェクト

## 概要
inc-lmsプロジェクトは、TypeScriptとReactを使用して構築されたウェブアプリケーションです。教育コンテンツとユーザーインタラクションを管理するための使いやすいインターフェースを提供する学習管理システム（LMS）として機能します。

## プロジェクト構造
プロジェクトは以下のディレクトリとファイルで構成されています：

- **src/**: アプリケーションのソースコードを格納します。
  - **components/**: Reactコンポーネントを格納します。
    - **App.tsx**: アプリケーションのレイアウトとルーティングを管理するメインコンポーネント。
    - **admin/**: 管理者向け機能のコンポーネント（ダッシュボード、ユーザー管理など）。
    - **instructor/**: 講師向け機能のコンポーネント（学習記録管理、URL管理など）。
    - **user/**: 一般ユーザー向け機能のコンポーネント（学習記録閲覧、URL一覧など）。
    - **common/**: 共通で使用されるコンポーネント（進捗バー、テーブルなど）。
  - **contexts/**: Reactコンテキストを格納します。
    - **AuthContext.tsx**: 認証状態の管理と共有。
    - **WorkspaceContext.tsx**: ワークスペース情報の管理と共有。
  - **hooks/**: 再利用可能なカスタムフックを格納します。
    - **useAuth.ts**: 認証関連のロジック。
    - **useLearningLogs.ts**: 学習記録の取得と管理。
    - **useLogout.ts**: ログアウト処理のロジック。
  - **styles/**: アプリケーションのスタイリングのためのCSSファイルを格納します。
    - **App.css**: メインアプリケーションのスタイル。
    - **global.css**: グローバルに適用されるスタイル。
  - **types/**: TypeScriptの型定義を格納します。
    - **LearningRecord.ts**: 学習記録の型定義。
    - **LearningURL.ts**: 学習URLの型定義。
    - **User.ts**: ユーザー情報の型定義。
    - **Workspace.ts**: ワークスペース情報の型定義。
  - **firebaseConfig.ts**: Firebase設定とセットアップ。
  - **index.tsx**: アプリケーションのエントリーポイント。
  - **setupTests.ts**: テスト環境のセットアップ設定。

- **public/**: 公開アセットとHTMLテンプレートを格納します。
  - **index.html**: アプリケーションのHTMLテンプレート。
  - **manifest.json**: メタデータとアイコンを定義するウェブアプリマニフェスト。

- **Docker関連**:
  - **Dockerfile**: アプリケーションのコンテナ化設定。
  - **docker-compose.yml**: 開発環境のコンテナ構成定義。

- **設定ファイル**:
  - **package.json**: 依存関係とスクリプトを記載したnpm設定ファイル。
  - **tsconfig.json**: TypeScriptコンパイラオプションの設定。
  - **jest.config.js**: Jestテストフレームワークの設定。
  - **firebase.json**: Firebase設定ファイル。
  - **firestore.rules**: Firestoreセキュリティルール。
  - **firestore.indexes.json**: Firestoreインデックス定義。

## セットアップ手順
1. リポジトリをクローンします：
   ```
   git clone <repository-url>
   ```

2. プロジェクトディレクトリに移動します：
   ```
   cd inc-lms
   ```

3. 依存関係をインストールします：
   ```
   npm install
   ```

4. 開発サーバーを起動します：
   ```
   npm start
   ```

### Dockerを使用する場合：
1. Dockerコンテナをビルドして起動：
   ```
   docker-compose up --build
   ```
   アプリケーションは http://localhost:3000 でアクセス可能になります。

## テスト
Jestを使用してユニットテストを実行します：
```
npm test
```

## 使用方法
開発サーバーが起動したら、ウェブブラウザで`http://localhost:3000`にアクセスできます。学習管理システムの機能を探索し、様々なコンポーネントと対話することができます。

## 学習管理システム（LMS）概要
このLMSは、NoSQLデータベースとしてFirebase Firestoreを使用して構築されています。管理者、講師、ユーザーの3つのユーザーロールをサポートし、ロールベースのアクセス制御（RBAC）を実装しています。システムは、学習教材のワークスペースベースの管理とユーザーの進捗状況の追跡を可能にします。

## 要件

### 1. ユーザーロールと権限

#### ロール：管理者
- ワークスペースの作成と初期講師の招待
- すべてのワークスペースとそのユーザーの管理
- ワークスペース内のユーザーロールの変更
- 他の管理者ユーザーの招待
- 学習URL（作成、更新、削除）の管理
- すべてのワークスペースの学習記録の閲覧

#### ロール：講師
- 自身のワークスペースへのユーザーメンバーの招待と削除
- 自身のワークスペース内のユーザーロールの変更
- 自身のワークスペース内のすべての学習記録の閲覧
- 学習URLへのアクセス
- 自身の学習記録の閲覧

#### ロール：ユーザー
- 学習URLへのアクセス
- 自身の学習記録の閲覧

### 2. 主要機能

#### 管理者機能
- ワークスペースの作成と管理
- ワークスペースへの講師の招待
- すべてのユーザーとそのロールの管理
- ワークスペースがアクセスできる学習URLの管理
- すべてのワークスペースのユーザーと学習進捗データの閲覧
- 追加の管理者ユーザーの招待

#### 講師機能
- 自身のワークスペース内のユーザー管理（ユーザーの招待/削除、ロール変更）
- ワークスペースユーザーの学習記録の閲覧
- 学習URLへのアクセスと自身の進捗の追跡

#### ユーザー機能
- 割り当てられた学習URLへのアクセス
- 自身の学習進捗の閲覧

## データ構造（Firestore）

Firestoreはコレクション-ドキュメント構造を使用します。主なコレクションは以下の通りです：

### 1. ユーザーコレクション
パス: `/users/{userId}`
```json
{
  "id": "user123",
  "name": "山田太郎",
  "email": "taro@example.com",
  "isAdmin": true,
  "workspaces": [
    { "workspaceId": "workspaceA", "role": "instructor" },
    { "workspaceId": "workspaceB", "role": "user" }
  ]
}
```
ユーザー情報を保存します。
isAdmin: ユーザーが管理者かどうかを示すブール値フラグ。
workspaces: ユーザーが所属するワークスペースのリストと、各ワークスペースでのロール。

### 2. ワークスペースコレクション
パス: `/workspaces/{workspaceId}`
```json
{
  "id": "workspaceA",
  "name": "AIブートキャンプ",
  "createdBy": "admin123"
}
```
ワークスペース情報を保存します。
createdBy: ワークスペースを作成した管理者。

### 3. 学習URLコレクション
パス: `/learningUrls/{workspaceId}_{urlId}`
```json
{
  "id": "url456",
  "category": "AI",
  "title": "AIブートキャンプ",
  "description": "AIの基礎を学ぶ",
  "url": "https://example.com/learning-course",
  "createdBy": "admin123"
}
```
各ワークスペースの学習URLを保存します。

### 4. 学習記録コレクション
パス: `/learningRecords/{userId}_{urlId}`
```json
{
  "userId": "user123",
  "workspaceId": "workspaceA",
  "urlId": "url456",
  "status": "completed" | "in progress",
  "timestamp": "2025-02-27T12:00:00Z"
}
```
各ユーザーの学習進捗を追跡します。

## Firestoreセキュリティルール
これらのルールは、ユーザーロールに基づいてアクセス制御を実施します。

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ユーザーデータ
    match /users/{userId} {
      allow read, update: if request.auth.uid == userId;
    }

    // ワークスペース管理
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.isAdmin == true;
    }

    // 学習URL
    match /learningUrls/{workspaceId}_{urlId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.isAdmin == true;
    }

    // 学習記録
    match /learningRecords/{userId}_{urlId} {
      allow read, write: if request.auth.uid == userId || 
                            request.auth.token.workspaces[workspaceId].role == "instructor";
    }
  }
}
```

## デプロイメント注意事項
- ユーザー認証のためにFirebase Authenticationを有効にしてください。
- 最適化されたクエリのためにFirestoreインデックスを使用してください。
- フロントエンドの提供にFirebase Hostingを設定してください。
- Dockerを使用する場合は、環境変数を適切に設定してください。

## 開発ガイドライン
- コンポーネントは機能ごとにディレクトリを分けて管理します（admin/, instructor/, user/）。
- 共通のコンポーネントはcommon/ディレクトリに配置します。
- カスタムフックを活用して、ロジックの再利用を促進します。
- テストカバレッジを維持するため、新機能の追加時にはテストも追加してください。

## 貢献
貢献を歓迎します！提案や改善のためのプルリクエストの提出やイシューのオープンをお気軽にどうぞ。

## ライセンス
このプロジェクトはMITライセンスの下でライセンスされています。詳細については、LICENSEファイルを参照してください。
