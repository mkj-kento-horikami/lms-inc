export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: string;
  workspaces: { workspaceId: string; role: string }[];
}