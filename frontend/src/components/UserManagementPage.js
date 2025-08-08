import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'https://herrmaientas-evaluaci-n.onrender.com';

function UserManagementPage() {
  const { token, user } = useStore(); // Asume que el store tiene la info del usuario logueado
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRol, setEditRol] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRol, setNewUserRol] = useState('docente');

  useEffect(() => {
    if (user && user.rol === 'administrador') {
      fetchUsers();
    } else {
      setError('No tienes permisos para acceder a esta página.');
      setLoading(false);
    }
  }, [token, user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`${API_URL}/api/users`, config);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar los usuarios.');
      toast.error('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`${API_URL}/api/users/${userToDelete._id}`, config);
      toast.success('Usuario eliminado exitosamente.');
      fetchUsers(); // Refetch users
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Error al eliminar el usuario.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditName(user.nombre);
    setEditEmail(user.email);
    setEditRol(user.rol);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setUserToEdit(null);
    setEditName('');
    setEditEmail('');
    setEditRol('');
  };

  const confirmEdit = async () => {
    if (!userToEdit) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        nombre: editName,
        email: editEmail,
        rol: editRol,
      };
      await axios.put(`${API_URL}/api/users/${userToEdit._id}`, body, config);
      toast.success('Usuario actualizado exitosamente.');
      fetchUsers(); // Refetch users
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Error al actualizar el usuario.');
    } finally {
      handleCloseEditDialog();
    }
  };

  // --- Create Handlers ---
  const handleCreateClick = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRol('docente');
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const confirmCreate = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword || !newUserRol) {
      return toast.warn('Por favor, completa todos los campos para crear un usuario.');
    }
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = {
        nombre: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        rol: newUserRol,
      };
      await axios.post(`${API_URL}/api/users`, body, config);
      toast.success('Usuario creado exitosamente.');
      fetchUsers(); // Refetch users
      handleCloseCreateDialog();
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Error al crear el usuario.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchUsers} variant="contained" sx={{ mt: 2 }}>Reintentar</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleCreateClick}
        >
          Crear Usuario
        </Button>
      </Box>
      {users.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No hay usuarios registrados.</Typography>
      ) : (
        <List component={Paper} elevation={2}>
          {users.map((userItem) => (
            <ListItem key={userItem._id} divider sx={{ mb: 2 }}>
              <ListItemText 
                primary={`${userItem.nombre} (${userItem.email})`}
                secondary={`Rol: ${userItem.rol}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(userItem)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(userItem)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar al usuario "{userToDelete?.nombre}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={confirmDelete} autoFocus color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Editar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Puedes editar la información del usuario.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nombre"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="email"
            label="Correo Electrónico"
            type="email"
            fullWidth
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              id="rol"
              value={editRol}
              label="Rol"
              onChange={(e) => setEditRol(e.target.value)}
            >
              <MenuItem value={"docente"}>Docente</MenuItem>
              <MenuItem value={"administrador"}>Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={confirmEdit} color="primary">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} aria-labelledby="create-user-dialog-title">
        <DialogTitle id="create-user-dialog-title">Crear Nuevo Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingresa los datos del nuevo usuario.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="new-name"
            label="Nombre"
            type="text"
            fullWidth
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="new-email"
            label="Correo Electrónico"
            type="email"
            fullWidth
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="new-password"
            label="Contraseña"
            type="password"
            fullWidth
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="new-rol-label">Rol</InputLabel>
            <Select
              labelId="new-rol-label"
              id="new-rol"
              value={newUserRol}
              label="Rol"
              onChange={(e) => setNewUserRol(e.target.value)}
            >
              <MenuItem value={"docente"}>Docente</MenuItem>
              <MenuItem value={"administrador"}>Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
          <Button onClick={confirmCreate} color="primary">Crear Usuario</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagementPage;
