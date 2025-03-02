import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { User } from '../../types/User';

interface UserManagementTableProps {
  users: User[];
  order: 'asc' | 'desc';
  orderBy: keyof User;
  handleRequestSort: (property: keyof User) => void;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (userId: string) => void;
  title: string;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  order,
  orderBy,
  handleRequestSort,
  handleEditUser,
  handleDeleteUser,
  title,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleRequestSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">Role</TableCell>
              <TableCell className="table-head-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="table-row">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <IconButton className="icon-button" onClick={() => handleEditUser(user)}><Edit fontSize="small" /></IconButton>
                    <IconButton className="icon-button" onClick={() => handleDeleteUser(user.id)}><Delete fontSize="small" /></IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserManagementTable;