import { useState, useCallback } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { LearningURL } from '../types/LearningURL';
import { LearningURLFormData } from '../types/LearningURLForm';
import { LEARNING_URL_MESSAGES } from '../constants/learningURL';
import { formDataToLearningURL } from '../utils/learningURLTransform';

interface UseLearningURLsProps {
  workspaceId?: string;
  userId?: string;
}

interface UseLearningURLsReturn {
  learningUrls: LearningURL[];
  isLoading: boolean;
  error: string | null;
  fetchLearningUrls: () => Promise<void>;
  addLearningUrl: (data: LearningURLFormData) => Promise<void>;
  updateLearningUrl: (id: string, data: LearningURLFormData) => Promise<void>;
  deleteLearningUrl: (id: string) => Promise<void>;
}

export const useLearningURLs = ({ workspaceId, userId }: UseLearningURLsProps): UseLearningURLsReturn => {
  const [learningUrls, setLearningUrls] = useState<LearningURL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLearningUrls = useCallback(async () => {
    if (!workspaceId) {
      setError(LEARNING_URL_MESSAGES.ERRORS.WORKSPACE_NOT_SELECTED);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const q = query(
        collection(db, 'learningUrls'),
        where('workspaceId', '==', workspaceId)
      );
      
      const querySnapshot = await getDocs(q);
      const learningUrlsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LearningURL));

      setLearningUrls(learningUrlsData);
    } catch (err) {
      console.error('Error fetching learning URLs:', err);
      setError(LEARNING_URL_MESSAGES.ERRORS.FETCH_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  const addLearningUrl = useCallback(async (data: LearningURLFormData) => {
    if (!workspaceId) {
      setError(LEARNING_URL_MESSAGES.ERRORS.WORKSPACE_NOT_SELECTED);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newLearningUrl = formDataToLearningURL(data, undefined, workspaceId, userId);
      const docRef = await addDoc(collection(db, 'learningUrls'), newLearningUrl);
      
      const addedUrl = {
        ...newLearningUrl,
        id: docRef.id
      };

      setLearningUrls(prev => [...prev, addedUrl]);
    } catch (err) {
      console.error('Error adding learning URL:', err);
      setError(LEARNING_URL_MESSAGES.ERRORS.UPDATE_ERROR);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, userId]);

  const updateLearningUrl = useCallback(async (id: string, data: LearningURLFormData) => {
    if (!workspaceId) {
      setError(LEARNING_URL_MESSAGES.ERRORS.WORKSPACE_NOT_SELECTED);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const updatedUrl = formDataToLearningURL(data, id, workspaceId, userId);
      const { id: urlId, ...updateData } = updatedUrl;
      
      await updateDoc(doc(db, 'learningUrls', id), {
        ...updateData,
        updatedAt: new Date().toISOString()
      });

      setLearningUrls(prev =>
        prev.map(url => (url.id === id ? { ...updatedUrl, updatedAt: new Date().toISOString() } : url))
      );
    } catch (err) {
      console.error('Error updating learning URL:', err);
      setError(LEARNING_URL_MESSAGES.ERRORS.UPDATE_ERROR);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, userId]);

  const deleteLearningUrl = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteDoc(doc(db, 'learningUrls', id));
      setLearningUrls(prev => prev.filter(url => url.id !== id));
    } catch (err) {
      console.error('Error deleting learning URL:', err);
      setError(LEARNING_URL_MESSAGES.ERRORS.DELETE_ERROR);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    learningUrls,
    isLoading,
    error,
    fetchLearningUrls,
    addLearningUrl,
    updateLearningUrl,
    deleteLearningUrl
  };
};