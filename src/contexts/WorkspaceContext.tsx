import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface Workspace {
  workspaceId: string;
  name: string;
  role: string;
}

interface WorkspaceContextProps {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  isAdmin: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextProps>({
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
  workspaces: [],
  isAdmin: false,
});

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userWorkspaces = await Promise.all(
            userData.workspaces.map(async (ws: any) => {
              const workspaceDoc = await getDoc(doc(db, 'workspaces', ws.workspaceId));
              if (workspaceDoc.exists()) {
                const workspaceData = workspaceDoc.data();
                return {
                  workspaceId: ws.workspaceId,
                  name: workspaceData.name,
                  role: ws.role,
                };
              }
              return null;
            })
          );
          const validWorkspaces = userWorkspaces.filter((ws: Workspace | null): ws is Workspace => ws !== null);
          console.log('Fetched workspaces:', validWorkspaces); // デバッグ用ログ
          setWorkspaces(validWorkspaces);
          setIsAdmin(userData.isAdmin || false);
        }
      } else {
        setSelectedWorkspace(null);
        setWorkspaces([]);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace, workspaces, isAdmin }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);