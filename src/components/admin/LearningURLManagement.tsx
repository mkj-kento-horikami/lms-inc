import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { useLearningURLs } from '../../../hooks/useLearningURLs';
import { LearningURL } from '../../../types/LearningURL';
import { LearningURLFormData } from '../../../types/LearningURLForm';
import {
  LEARNING_URL_MESSAGES,
  LEARNING_URL_DEFAULTS,
  SortOrder,
  SortOrderBy
} from '../../../constants/learningURL';
import LearningURLForm from './LearningURLForm';
import LearningURLList from './LearningURLList';
import LearningURLUpload from './LearningURLUpload';

const LearningURLManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedWorkspace } = useWorkspace();
  const [editingLearningUrl, setEditingLearningUrl] = useState<LearningURL | null>(null);
  const [order, setOrder] = useState<SortOrder>(LEARNING_URL_DEFAULTS.TABLE_SORT.DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState<SortOrderBy>(LEARNING_URL_DEFAULTS.TABLE_SORT.DEFAULT_ORDER_BY);

  const {
    learningUrls,
    isLoading,
    error,
    fetchLearningUrls,
    addLearningUrl,
    updateLearningUrl,
    deleteLearningUrl
  } = useLearningURLs({
    workspaceId: selectedWorkspace?.workspaceId,
    userId: currentUser?.uid
  });

  useEffect(() => {
    fetchLearningUrls();
  }, [fetchLearningUrls]);

  const handleRequestSort = (property: keyof LearningURL) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property as SortOrderBy);
  };

  const sortedLearningUrls = React.useMemo(() => {
    return [...learningUrls].sort((a, b) => {
      const aValue = String(a[orderBy] || '');
      const bValue = String(b[orderBy] || '');
      return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
    });
  }, [learningUrls, order, orderBy]);

  const handleAdd = async (data: LearningURLFormData) => {
    await addLearningUrl(data);
  };

  const handleEdit = (learningUrl: LearningURL) => {
    setEditingLearningUrl(learningUrl);
  };

  const handleUpdate = async (data: LearningURLFormData) => {
    if (editingLearningUrl) {
      await updateLearningUrl(editingLearningUrl.id, data);
      setEditingLearningUrl(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLearningUrl(id);
  };

  const handleUpload = async (data: LearningURLFormData[]) => {
    for (const formData of data) {
      await addLearningUrl(formData);
    }
  };

  if (!selectedWorkspace) {
    return (
      <Container>
        <Typography color="error">
          {LEARNING_URL_MESSAGES.ERRORS.WORKSPACE_NOT_SELECTED}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>学習URL管理</Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ my: 2 }}>
          <Typography color="error" variant="body1">{error}</Typography>
        </Box>
      )}

      {!isLoading && !error && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>新規学習URL追加</Typography>
              <LearningURLForm
                onSubmit={handleAdd}
                isLoading={isLoading}
              />
              <Box sx={{ mt: 2 }}>
                <LearningURLUpload
                  onUpload={handleUpload}
                  workspaceId={selectedWorkspace.workspaceId}
                  userId={currentUser?.uid}
                  disabled={isLoading}
                />
              </Box>
            </CardContent>
          </Card>

          <LearningURLList
            learningUrls={sortedLearningUrls}
            onEdit={handleEdit}
            onDelete={handleDelete}
            orderBy={orderBy}
            order={order}
            onRequestSort={handleRequestSort}
          />

          <Dialog
            open={Boolean(editingLearningUrl)}
            onClose={() => setEditingLearningUrl(null)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>学習URLを編集</DialogTitle>
            <DialogContent>
              {editingLearningUrl && (
                <LearningURLForm
                  initialData={{
                    category: editingLearningUrl.category,
                    mainTitle: editingLearningUrl.mainTitle,
                    mainDescription: editingLearningUrl.mainDescription,
                    contents: editingLearningUrl.contents,
                    workspaceId: editingLearningUrl.workspaceId,
                    createdBy: editingLearningUrl.createdBy,
                    createdAt: editingLearningUrl.createdAt
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingLearningUrl(null)}
                  isLoading={isLoading}
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default LearningURLManagement;