import { Content } from './LearningURL';

export interface LearningURLFormData {
  category: string;
  mainTitle: string;
  mainDescription: string;
  contents: Content[];
  workspaceId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ContentFormError {
  title?: string;
  description?: string;
  url?: string;
}

export interface LearningURLFormErrors {
  category?: string;
  mainTitle?: string;
  mainDescription?: string;
  contents?: ContentFormError[];
}

export interface LearningURLFormProps {
  initialData?: LearningURLFormData;
  onSubmit: (data: LearningURLFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ContentFormProps {
  content: Content;
  index: number;
  onUpdate: (index: number, field: keyof Content, value: string) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
}