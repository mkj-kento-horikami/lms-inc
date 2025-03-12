import { useState, useCallback } from 'react';
import { Content } from '../types/LearningURL';
import { LearningURLFormData, LearningURLFormErrors } from '../types/LearningURLForm';
import { LEARNING_URL_DEFAULTS } from '../constants/learningURL';
import { validateLearningURLForm } from '../utils/learningURLValidation';

interface UseLearningURLFormProps {
  initialData?: LearningURLFormData;
  onSubmit: (data: LearningURLFormData) => Promise<void>;
}

interface UseLearningURLFormReturn {
  formData: LearningURLFormData;
  errors: LearningURLFormErrors;
  isSubmitting: boolean;
  setFieldValue: (field: keyof LearningURLFormData, value: string) => void;
  setContentValue: (index: number, field: keyof Content, value: string) => void;
  addContent: () => void;
  removeContent: (index: number) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

export const useLearningURLForm = ({
  initialData = LEARNING_URL_DEFAULTS.INITIAL_FORM_STATE,
  onSubmit
}: UseLearningURLFormProps): UseLearningURLFormReturn => {
  const [formData, setFormData] = useState<LearningURLFormData>(initialData);
  const [errors, setErrors] = useState<LearningURLFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: keyof LearningURLFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // フィールドが変更されたら、そのフィールドのエラーをクリア
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }, []);

  const setContentValue = useCallback((index: number, field: keyof Content, value: string) => {
    setFormData(prev => ({
      ...prev,
      contents: prev.contents.map((content, i) =>
        i === index ? { ...content, [field]: value } : content
      )
    }));
    // コンテンツが変更されたら、そのコンテンツのエラーをクリア
    setErrors(prev => {
      if (!prev.contents) return prev;
      const newContents = [...prev.contents];
      newContents[index] = { ...newContents[index], [field]: undefined };
      return { ...prev, contents: newContents };
    });
  }, []);

  const addContent = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      contents: [...prev.contents, { title: '', description: '', url: '' }]
    }));
  }, []);

  const removeContent = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index)
    }));
    // 削除されたコンテンツのエラーを削除
    setErrors(prev => {
      if (!prev.contents) return prev;
      return {
        ...prev,
        contents: prev.contents.filter((_, i) => i !== index)
      };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateLearningURLForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await onSubmit(formData);
        // 送信成功後、フォームをリセット
        setFormData(LEARNING_URL_DEFAULTS.INITIAL_FORM_STATE);
        setErrors({});
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, onSubmit]);

  const resetForm = useCallback(() => {
    setFormData(LEARNING_URL_DEFAULTS.INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setFieldValue,
    setContentValue,
    addContent,
    removeContent,
    handleSubmit,
    resetForm
  };
};