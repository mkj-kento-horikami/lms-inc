import React, { useRef, useState } from 'react';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import Papa from 'papaparse';
import { LearningURLFormData } from '../../../types/LearningURLForm';
import { LEARNING_URL_MESSAGES } from '../../../constants/learningURL';
import { groupCsvDataByMainTitle } from '../../../utils/learningURLTransform';

interface LearningURLUploadProps {
  onUpload: (data: LearningURLFormData[]) => Promise<void>;
  workspaceId?: string;
  userId?: string;
  disabled?: boolean;
}

type CsvRow = Record<string, string>;

const LearningURLUpload: React.FC<LearningURLUploadProps> = ({
  onUpload,
  workspaceId,
  userId,
  disabled
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!workspaceId) {
      setError(LEARNING_URL_MESSAGES.ERRORS.WORKSPACE_NOT_SELECTED);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const parseFile = (file: File): Promise<Papa.ParseResult> => {
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: resolve,
            error: reject,
            skipEmptyLines: true
          });
        });
      };

      const result = await parseFile(file);
      const data = result.data as CsvRow[];

      if (result.errors.length > 0) {
        throw new Error(LEARNING_URL_MESSAGES.ERRORS.CSV_PARSE_ERROR);
      }

      const groupedData = groupCsvDataByMainTitle(data, workspaceId, userId);
      
      if (groupedData.length === 0) {
        throw new Error('有効なデータが見つかりませんでした');
      }

      await onUpload(groupedData);

      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('CSV upload error:', err);
      setError(err instanceof Error ? err.message : LEARNING_URL_MESSAGES.ERRORS.CSV_UPLOAD_ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        accept=".csv"
        style={{ display: 'none' }}
        id="csv-file-upload"
        type="file"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      <label htmlFor="csv-file-upload">
        <Button
          variant="contained"
          component="span"
          disabled={disabled || isUploading}
          startIcon={isUploading ? <CircularProgress size={20} /> : undefined}
        >
          {LEARNING_URL_MESSAGES.BUTTONS.UPLOAD_CSV}
        </Button>
      </label>
      
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 1 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LearningURLUpload;