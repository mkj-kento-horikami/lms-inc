import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
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
  Card,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import { Edit, Delete, Add, Remove } from '@mui/icons-material';
import { LearningURL, Content } from '../../types/LearningURL';
import Papa from 'papaparse';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles.css';

const LearningURLManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [learningUrls, setLearningUrls] = useState<LearningURL[]>([]);
  const [newLearningUrl, setNewLearningUrl] = useState<Omit<LearningURL, 'id'>>({
    category: '',
    mainTitle: '',
    mainDescription: '',
    url: '',
    contents: [{ title: '', description: '', url: '' }]
  });
  const [editingLearningUrl, setEditingLearningUrl] = useState<LearningURL | null>(null);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof LearningURL>('mainTitle');

  const handleAddContent = () => {
    setNewLearningUrl({
      ...newLearningUrl,
      contents: [...newLearningUrl.contents, { title: '', description: '', url: '' }]
    });
  };

  const handleRemoveContent = (index: number) => {
    setNewLearningUrl({
      ...newLearningUrl,
      contents: newLearningUrl.contents.filter((_, i) => i !== index)
    });
  };

  const handleContentChange = (index: number, field: keyof Content, value: string) => {
    const newContents = [...newLearningUrl.contents];
    newContents[index] = { ...newContents[index], [field]: value };
    setNewLearningUrl({
      ...newLearningUrl,
      contents: newContents
    });
  };

  useEffect(() => {
    const fetchLearningUrls = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningUrls'));
      const learningUrlsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LearningURL));
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
    setNewLearningUrl({
      category: '',
      mainTitle: '',
      mainDescription: '',
      url: '',
      contents: [{ title: '', description: '', url: '' }]
    });
  };

  const handleEditLearningUrl = (learningUrl: LearningURL) => {
    setEditingLearningUrl(learningUrl);
    setOpen(true);
  };

  const handleUpdateLearningUrl = async () => {
    if (editingLearningUrl) {
      const learningUrlRef = doc(db, 'learningUrls', editingLearningUrl.id);
      const { id, ...updatedLearningUrl } = editingLearningUrl;
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const data = results.data as Array<{
            category: string;
            mainTitle: string;
            mainDescription: string;
            contentTitle: string;
            contentDescription: string;
            contentUrl: string;
          }>;

          // グループ化してLearningURLオブジェクトを作成
          const groupedData = data.reduce((acc, row) => {
            const key = `${row.category}-${row.mainTitle}`;
            if (!acc[key]) {
              acc[key] = {
                category: row.category,
                mainTitle: row.mainTitle,
                mainDescription: row.mainDescription || '',
                url: '',
                contents: []
              };
            }
            acc[key].contents.push({
              title: row.contentTitle,
              description: row.contentDescription || '',
              url: row.contentUrl
            });
            return acc;
          }, {} as Record<string, Omit<LearningURL, 'id'>>);

          // Firestoreに保存
          for (const learningUrl of Object.values(groupedData)) {
            await addDoc(collection(db, 'learningUrls'), {
              ...learningUrl,
              createdBy: currentUser?.uid
            });
          }

          // 更新されたデータを取得
          const querySnapshot = await getDocs(collection(db, 'learningUrls'));
          const learningUrlsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as LearningURL[];
          setLearningUrls(learningUrlsData);
        },
      });
    }
  };

  const handleRequestSort = (property: keyof LearningURL) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLearningUrls = [...learningUrls].sort((a, b) => {
    const aValue = String(a[orderBy] || '');
    const bValue = String(b[orderBy] || '');
    return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning URL Management</Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
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
              label="Main Title"
              value={newLearningUrl.mainTitle}
              onChange={e => setNewLearningUrl({ ...newLearningUrl, mainTitle: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Main Description"
              value={newLearningUrl.mainDescription}
              onChange={e => setNewLearningUrl({ ...newLearningUrl, mainDescription: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Contents</Typography>
            {newLearningUrl.contents.map((content, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Content #{index + 1}</Typography>
                  {index > 0 && (
                    <IconButton onClick={() => handleRemoveContent(index)} size="small">
                      <Remove />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  label="Content Title"
                  value={content.title}
                  onChange={e => handleContentChange(index, 'title', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Content Description"
                  value={content.description}
                  onChange={e => handleContentChange(index, 'description', e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                />
                <TextField
                  label="Content URL"
                  value={content.url}
                  onChange={e => handleContentChange(index, 'url', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddContent}
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
            >
              Add Content
            </Button>
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="primary" onClick={handleAddLearningUrl}>
            Add Learning URL
          </Button>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" color="primary" component="span">
              Upload CSV
            </Button>
          </label>
        </CardActions>
      </Card>

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
                label="Main Title"
                value={editingLearningUrl.mainTitle}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, mainTitle: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Main Description"
                value={editingLearningUrl.mainDescription}
                onChange={e => setEditingLearningUrl({ ...editingLearningUrl, mainDescription: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
              
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Contents</Typography>
              {editingLearningUrl.contents.map((content, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Content #{index + 1}</Typography>
                    {index > 0 && (
                      <IconButton 
                        onClick={() => {
                          const newContents = editingLearningUrl.contents.filter((_, i) => i !== index);
                          setEditingLearningUrl({ ...editingLearningUrl, contents: newContents });
                        }} 
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Box>
                  <TextField
                    label="Content Title"
                    value={content.title}
                    onChange={e => {
                      const newContents = [...editingLearningUrl.contents];
                      newContents[index] = { ...newContents[index], title: e.target.value };
                      setEditingLearningUrl({ ...editingLearningUrl, contents: newContents });
                    }}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Content Description"
                    value={content.description}
                    onChange={e => {
                      const newContents = [...editingLearningUrl.contents];
                      newContents[index] = { ...newContents[index], description: e.target.value };
                      setEditingLearningUrl({ ...editingLearningUrl, contents: newContents });
                    }}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Content URL"
                    value={content.url}
                    onChange={e => {
                      const newContents = [...editingLearningUrl.contents];
                      newContents[index] = { ...newContents[index], url: e.target.value };
                      setEditingLearningUrl({ ...editingLearningUrl, contents: newContents });
                    }}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={() => {
                  setEditingLearningUrl({
                    ...editingLearningUrl,
                    contents: [...editingLearningUrl.contents, { title: '', description: '', url: '' }]
                  });
                }}
                variant="outlined"
                sx={{ mt: 1, mb: 2 }}
              >
                Add Content
              </Button>
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
                  active={orderBy === 'mainTitle'}
                  direction={orderBy === 'mainTitle' ? order : 'asc'}
                  onClick={() => handleRequestSort('mainTitle')}
                >
                  Main Title
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'mainDescription'}
                  direction={orderBy === 'mainDescription' ? order : 'asc'}
                  onClick={() => handleRequestSort('mainDescription')}
                >
                  Main Description
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                Contents
              </TableCell>
              <TableCell className="table-head-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLearningUrls.map(learningUrl => (
              <TableRow key={learningUrl.id} className="table-row">
                <TableCell>{learningUrl.category}</TableCell>
                <TableCell>{learningUrl.mainTitle}</TableCell>
                <TableCell>{learningUrl.mainDescription}</TableCell>
                <TableCell>
                  {learningUrl.contents.map((content, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{content.title}</Typography>
                      <Typography variant="body2" color="textSecondary">{content.description}</Typography>
                      <Typography variant="body2" color="primary" component="a" href={content.url} target="_blank">
                        {content.url}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <IconButton className="icon-button" onClick={() => handleEditLearningUrl(learningUrl)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton className="icon-button" onClick={() => handleDeleteLearningUrl(learningUrl.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
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