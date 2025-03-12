import { LearningURL } from '../types/LearningURL';
import { LearningURLFormData } from '../types/LearningURLForm';

export const formDataToLearningURL = (
  formData: LearningURLFormData,
  id?: string,
  workspaceId?: string,
  userId?: string
): LearningURL => {
  return {
    id: id || '',
    category: formData.category,
    mainTitle: formData.mainTitle,
    mainDescription: formData.mainDescription,
    contents: formData.contents,
    workspaceId: workspaceId || formData.workspaceId || '',
    createdBy: userId || formData.createdBy || '',
    createdAt: formData.createdAt || new Date().toISOString(),
    url: formData.contents[0]?.url || '' // 後方互換性のために最初のURLを保持
  };
};

export const learningURLToFormData = (learningURL: LearningURL): LearningURLFormData => {
  return {
    category: learningURL.category,
    mainTitle: learningURL.mainTitle,
    mainDescription: learningURL.mainDescription,
    contents: learningURL.contents,
    workspaceId: learningURL.workspaceId,
    createdBy: learningURL.createdBy,
    createdAt: learningURL.createdAt
  };
};

export const csvRowToFormData = (row: Record<string, string>): Partial<LearningURLFormData> => {
  return {
    category: row.category || '',
    mainTitle: row.mainTitle || '',
    mainDescription: row.mainDescription || '',
    contents: [
      {
        title: row.contentTitle || '',
        description: row.contentDescription || '',
        url: row.contentUrl || ''
      }
    ]
  };
};

export const groupCsvDataByMainTitle = (
  csvData: Record<string, string>[],
  workspaceId?: string,
  userId?: string
): LearningURLFormData[] => {
  const groupedData = new Map<string, LearningURLFormData>();

  csvData.forEach(row => {
    if (!row.category || !row.mainTitle) return;

    const key = `${row.category}-${row.mainTitle}`;
    if (!groupedData.has(key)) {
      groupedData.set(key, {
        category: row.category,
        mainTitle: row.mainTitle,
        mainDescription: row.mainDescription || '',
        contents: [],
        workspaceId,
        createdBy: userId,
        createdAt: new Date().toISOString()
      });
    }

    if (row.contentTitle && row.contentUrl) {
      const data = groupedData.get(key)!;
      data.contents.push({
        title: row.contentTitle,
        description: row.contentDescription || '',
        url: row.contentUrl
      });
    }
  });

  return Array.from(groupedData.values());
};