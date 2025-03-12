export interface Content {
  title: string;
  description: string;
  url: string;
}

export interface LearningURL {
  id: string;
  category: string;
  mainTitle: string;
  mainDescription: string;
  contents: Content[];
  createdBy?: string;
  title?: string;
  url: string;
}