export interface Content {
  title: string;
  description: string;
  url: string;
}

export interface LearningURL {
  id: string;
  url: string;
  category: string;
  mainTitle: string;
  mainDescription: string;
  title?: string;
  description?: string;
  contents: Content[];
  createdBy?: string;
  workspaceId?: string;
  createdAt?: string;
}