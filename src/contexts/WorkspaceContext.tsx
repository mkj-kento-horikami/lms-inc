import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface Workspace {
  workspaceId: string;
  name: string;
  role: 'admin' | 'instructor' | 'user';
}

interface WorkspaceContextProps {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  isAdmin: boolean;
}

interface UserData extends DocumentData {
  isAdmin: boolean;
  workspaces: Array<{
    workspaceId: string;
    role: Workspace['role'];
  }>;
}

const WorkspaceContext = createContext<WorkspaceContextProps>({
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
  workspaces: [],
  isAdmin: false
});

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaceData = async (user: User) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }

        const userData = userDoc.data() as UserData;
        if (isMounted) {
          setIsAdmin(userData.isAdmin);
        }

        const userWorkspaces = await Promise.all(
          userData.workspaces.map(async (ws) => {
            const workspaceDoc = await getDoc(doc(db, 'workspaces', ws.workspaceId));
            if (workspaceDoc.exists()) {
              const workspaceData = workspaceDoc.data();
              return {
                workspaceId: ws.workspaceId,
                name: workspaceData.name,
                role: ws.role
              } as Workspace;
            }
            return null;
          })
        );

        if (!isMounted) return;

        const filteredWorkspaces = userWorkspaces.filter((ws): ws is Workspace => ws !== null);

        if (userData.isAdmin) {
          const adminWorkspace: Workspace = {
            workspaceId: 'admin',
            name: 'Login as Admin',
            role: 'admin'
          };
          filteredWorkspaces.push(adminWorkspace);
          if (isMounted) {
            setWorkspaces(filteredWorkspaces);
            setSelectedWorkspace(adminWorkspace);
          }
        } else {
          if (isMounted) {
            setWorkspaces(filteredWorkspaces);
            // 管理者でない場合は、優先順位に従ってワークスペースを選択
            const defaultWorkspace = 
              filteredWorkspaces.find((ws) => ws.role === 'instructor') ||
              filteredWorkspaces.find((ws) => ws.role === 'user') ||
              filteredWorkspaces[0] || null;
            setSelectedWorkspace(defaultWorkspace);
          }
        }
      } catch (error) {
        console.error('Error fetching workspace data:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
          setWorkspaces([]);
          setSelectedWorkspace(null);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        fetchWorkspaceData(user);
      } else if (isMounted) {
        setSelectedWorkspace(null);
        setWorkspaces([]);
        setIsAdmin(false);
        setError(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const value: WorkspaceContextProps = {
    selectedWorkspace,
    setSelectedWorkspace,
    workspaces,
    isAdmin
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  return useContext(WorkspaceContext);
};