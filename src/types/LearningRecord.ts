export interface LearningRecord {
  id: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
  urlId: string;
  urlTitle: string;
  url: string;
  category: string; // category プロパティを追加
  status: 'completed' | 'not completed';
  timestamp: string;
  clickCount: number;
}