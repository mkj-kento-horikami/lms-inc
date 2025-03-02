export interface LearningRecord {
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
  urlId: string;
  urlTitle: string;
  url: string;
  status: 'completed' | 'in progress';
  timestamp: string;
}