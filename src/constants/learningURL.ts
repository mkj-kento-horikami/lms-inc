export const LEARNING_URL_MESSAGES = {
  ERRORS: {
    REQUIRED_CATEGORY: 'カテゴリーは必須項目です',
    REQUIRED_MAIN_TITLE: 'メインタイトルは必須項目です',
    REQUIRED_CONTENT_TITLE: 'コンテンツタイトルは必須項目です',
    REQUIRED_CONTENT_URL: 'コンテンツURLは必須項目です',
    INVALID_URL: '有効なURLを入力してください',
    WORKSPACE_NOT_SELECTED: 'ワークスペースが選択されていません',
    FETCH_ERROR: 'データの取得中にエラーが発生しました。再度お試しください',
    UPDATE_ERROR: 'データの更新中にエラーが発生しました。再度お試しください',
    DELETE_ERROR: 'データの削除中にエラーが発生しました',
    CSV_PARSE_ERROR: 'CSVファイルの解析中にエラーが発生しました',
    CSV_UPLOAD_ERROR: 'CSVのアップロード中にエラーが発生しました。再度お試しください'
  },
  LABELS: {
    CATEGORY: 'カテゴリー',
    MAIN_TITLE: 'メインタイトル',
    MAIN_DESCRIPTION: 'メイン説明',
    CONTENT_TITLE: 'コンテンツタイトル',
    CONTENT_DESCRIPTION: 'コンテンツ説明',
    CONTENT_URL: 'コンテンツURL',
    STATUS: 'ステータス'
  },
  BUTTONS: {
    ADD_CONTENT: 'コンテンツを追加',
    ADD_URL: '学習URLを追加',
    UPDATE: '更新',
    CANCEL: 'キャンセル',
    UPLOAD_CSV: 'CSVをアップロード'
  },
  TABLE: {
    CATEGORY: 'カテゴリー',
    MAIN_TITLE: 'メインタイトル',
    MAIN_DESCRIPTION: 'メイン説明',
    CONTENTS: 'コンテンツ',
    ACTIONS: '操作'
  },
  STATUS: {
    COMPLETED: '完了',
    NOT_COMPLETED: '未完了'
  }
} as const;

// フォームの初期状態
const initialFormState = {
  category: '',
  mainTitle: '',
  mainDescription: '',
  contents: [{ title: '', description: '', url: '' }]
};

// テーブルのソート設定
const tableSortDefaults = {
  DEFAULT_ORDER: 'asc' as const,
  DEFAULT_ORDER_BY: 'mainTitle' as const
};

export const LEARNING_URL_DEFAULTS = {
  INITIAL_FORM_STATE: initialFormState,
  TABLE_SORT: tableSortDefaults
};

export type SortOrder = 'asc' | 'desc';
export type SortOrderBy = typeof tableSortDefaults.DEFAULT_ORDER_BY;