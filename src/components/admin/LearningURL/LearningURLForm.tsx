import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { LearningURLFormProps, ContentFormProps } from '../../../types/LearningURLForm';
import { LEARNING_URL_MESSAGES } from '../../../constants/learningURL';
import { useLearningURLForm } from '../../../hooks/useLearningURLForm';

const ContentForm: React.FC<ContentFormProps> = ({
  content,
  index,
  onUpdate,
  onRemove,
  isRemovable
}) => (
  <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="subtitle2">コンテンツ #{index + 1}</Typography>
      {isRemovable && (
        <IconButton onClick={() => onRemove(index)} size="small">
          <Remove />
        </IconButton>
      )}
    </Box>
    <TextField
      label={LEARNING_URL_MESSAGES.LABELS.CONTENT_TITLE}
      value={content.title}
      onChange={e => onUpdate(index, 'title', e.target.value)}
      fullWidth
      margin="normal"
      error={Boolean(content.title === '')}
      helperText={content.title === '' ? LEARNING_URL_MESSAGES.ERRORS.REQUIRED_CONTENT_TITLE : ''}
    />
    <TextField
      label={LEARNING_URL_MESSAGES.LABELS.CONTENT_DESCRIPTION}
      value={content.description}
      onChange={e => onUpdate(index, 'description', e.target.value)}
      fullWidth
      margin="normal"
      multiline
      rows={2}
    />
    <TextField
      label={LEARNING_URL_MESSAGES.LABELS.CONTENT_URL}
      value={content.url}
      onChange={e => onUpdate(index, 'url', e.target.value)}
      fullWidth
      margin="normal"
      error={Boolean(content.url === '')}
      helperText={content.url === '' ? LEARNING_URL_MESSAGES.ERRORS.REQUIRED_CONTENT_URL : ''}
    />
  </Box>
);

const LearningURLForm: React.FC<LearningURLFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    setFieldValue,
    setContentValue,
    addContent,
    removeContent,
    handleSubmit
  } = useLearningURLForm({
    initialData,
    onSubmit
  });

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      <TextField
        label={LEARNING_URL_MESSAGES.LABELS.CATEGORY}
        value={formData.category}
        onChange={e => setFieldValue('category', e.target.value)}
        fullWidth
        margin="normal"
        error={Boolean(errors.category)}
        helperText={errors.category}
      />
      <TextField
        label={LEARNING_URL_MESSAGES.LABELS.MAIN_TITLE}
        value={formData.mainTitle}
        onChange={e => setFieldValue('mainTitle', e.target.value)}
        fullWidth
        margin="normal"
        error={Boolean(errors.mainTitle)}
        helperText={errors.mainTitle}
      />
      <TextField
        label={LEARNING_URL_MESSAGES.LABELS.MAIN_DESCRIPTION}
        value={formData.mainDescription}
        onChange={e => setFieldValue('mainDescription', e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        {LEARNING_URL_MESSAGES.TABLE.CONTENTS}
      </Typography>
      
      {formData.contents.map((content, index) => (
        <ContentForm
          key={index}
          content={content}
          index={index}
          onUpdate={setContentValue}
          onRemove={removeContent}
          isRemovable={index > 0}
        />
      ))}

      <Button
        startIcon={<Add />}
        onClick={addContent}
        variant="outlined"
        sx={{ mt: 1, mb: 2 }}
      >
        {LEARNING_URL_MESSAGES.BUTTONS.ADD_CONTENT}
      </Button>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || isSubmitting}
        >
          {initialData ? LEARNING_URL_MESSAGES.BUTTONS.UPDATE : LEARNING_URL_MESSAGES.BUTTONS.ADD_URL}
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={isLoading || isSubmitting}
          >
            {LEARNING_URL_MESSAGES.BUTTONS.CANCEL}
          </Button>
        )}
      </Box>
    </form>
  );
};

export default LearningURLForm;