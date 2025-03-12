import { LearningURLFormData, LearningURLFormErrors, ContentFormError } from '../types/LearningURLForm';
import { LEARNING_URL_MESSAGES } from '../constants/learningURL';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateLearningURLForm = (data: LearningURLFormData): LearningURLFormErrors => {
  const errors: LearningURLFormErrors = {};

  // カテゴリーのバリデーション
  if (!data.category.trim()) {
    errors.category = LEARNING_URL_MESSAGES.ERRORS.REQUIRED_CATEGORY;
  }

  // メインタイトルのバリデーション
  if (!data.mainTitle.trim()) {
    errors.mainTitle = LEARNING_URL_MESSAGES.ERRORS.REQUIRED_MAIN_TITLE;
  }

  // コンテンツのバリデーション
  if (data.contents.length > 0) {
    const contentErrors: ContentFormError[] = data.contents.map(content => {
      const contentError: ContentFormError = {};

      if (!content.title.trim()) {
        contentError.title = LEARNING_URL_MESSAGES.ERRORS.REQUIRED_CONTENT_TITLE;
      }

      if (!content.url.trim()) {
        contentError.url = LEARNING_URL_MESSAGES.ERRORS.REQUIRED_CONTENT_URL;
      } else if (!isValidUrl(content.url)) {
        contentError.url = LEARNING_URL_MESSAGES.ERRORS.INVALID_URL;
      }

      return contentError;
    });

    // エラーが存在する場合のみcontentsを設定
    if (contentErrors.some(error => Object.keys(error).length > 0)) {
      errors.contents = contentErrors;
    }
  }

  return errors;
};

export const hasErrors = (errors: LearningURLFormErrors): boolean => {
  if (Object.keys(errors).length === 0) {
    return false;
  }

  if (errors.contents) {
    return errors.contents.some(contentError => Object.keys(contentError).length > 0);
  }

  return true;
};