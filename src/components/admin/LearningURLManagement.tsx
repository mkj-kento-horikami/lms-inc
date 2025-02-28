import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableSortLabel,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles.css';

const LearningURLManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [learningUrls, setLearningUrls] = useState<any[]>([]);
  const [newLearningUrl, setNewLearningUrl] = useState({ category: '', title: '', description: '', url: '' });
  const [editingLearningUrl, setEditingLearningUrl] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('title');

  useEffect(() => {
    const fetchLearningUrls = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningUrls'));
      const learningUrlsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLearningUrls(learningUrlsData);
    };

    fetchLearningUrls();
  }, []);

  const handleAddLearningUrl = async () => {
    const docRef = await addDoc(collection(db, 'learningUrls'), {
      ...newLearningUrl,
      createdBy: currentUser?.uid
    });
    setLearningUrls([...learningUrls, { id: docRef.id, ...newLearningUrl, createdBy: currentUser?.uid }]);
    setNewLearningUrl({ category: '', title: '', description: '', url: '' });
  };

  const handleEditLearningUrl = (learningUrl: any) => {
    setEditingLearningUrl(learningUrl);
    setOpen(true);
  };

  const handleUpdateLearningUrl = async () => {
    if (editingLearningUrl) {
      const learningUrlRef = doc(db, 'learningUrls', editingLearningUrl.id);
      const { id, ...updatedLearningUrl } = editingLearningUrl; // id を除いたオブジェクトを作成
      await updateDoc(learningUrlRef, updatedLearningUrl);
      setLearningUrls(learningUrls.map(lu => (lu.id === editingLearningUrl.id ? editingLearningUrl : lu)));
      setEditingLearningUrl(null);
      setOpen(false);
    }
  };

  const handleDeleteLearningUrl = async (learningUrlId: string) => {
    await deleteDoc(doc(db, 'learningUrls', learningUrlId));
    setLearningUrls(learningUrls.filter(lu => lu.id !== learningUrlId));
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLearningUrl(null);
  };

  const handleRequestSort = (property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLearningUrls = [...learningUrls].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';
    return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning URL Management</Typography>

      <Typography variant="h6" gutterBottom>Add New Learning URL</Typography>
      <form onSubmit={e => { e.preventDefault(); handleAddLearningUrl(); }}>
        <TextField
          label="Category"
          value={newLearningUrl.category}
          onChange={e => setNewLearningUrl({ ...newLearningUrl, category: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Title"
          value={newLearningUrl.title}
          onChange={e => setNewLearningUrl({ ...newLearningUrl, title: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newLearningUrl.description}
          onChange={e => setNewLearningUrl({ ...newLearningUrl, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="URL"
          value={newLearningUrl.url}
          onChange={e => setNewLearningUrl({ ...newLearningUrl, url: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Add Learning URL</Button>
      </form>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Learning URL</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the learning URL information below.
          </DialogContentText>
          {editingLearningUrl && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateLearningUrl(); }}>
              <TextField
                label="Category"
                value={editingLearningUrl.category}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, category: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Title"
                value={editingLearningUrl.title}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={editingLearningUrl.description}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, description: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="URL"
                value={editingLearningUrl.url}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, url: e.target.value })}
                fullWidth
                margin="normal"
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Update Learning URL</Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Typography variant="h6" gutterBottom>Existing Learning URLs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleRequestSort('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'url'}
                  direction={orderBy === 'url' ? order : 'asc'}
                  onClick={() => handleRequestSort('url')}
                >
                  URL
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLearningUrls.map(learningUrl => (
              <TableRow key={learningUrl.id} className="table-row">
                <TableCell>{learningUrl.category}</TableCell>
                <TableCell>{learningUrl.title}</TableCell>
                <TableCell>{learningUrl.description}</TableCell>
                <TableCell>{learningUrl.url}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <IconButton className="icon-button" onClick={() => handleEditLearningUrl(learningUrl)}><Edit fontSize="small" /></IconButton>
                    <IconButton className="icon-button" onClick={() => handleDeleteLearningUrl(learningUrl.id)}><Delete fontSize="small" /></IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LearningURLManagement;