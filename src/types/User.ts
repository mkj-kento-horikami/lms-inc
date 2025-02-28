export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: string; // 追加
  workspaces: { workspaceId: string; role: string }[];
}