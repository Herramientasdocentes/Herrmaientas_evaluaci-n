import React from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText, CssBaseline, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import useStore from '../store';

const drawerWidth = 240;

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function DashboardLayout({ children }) {
  const { logout } = useStore();
  const [open, setOpen] = React.useState(true); // Puedes controlar esto con un botón o estado global

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Asistente de Evaluaciones Anluis
          </Typography>
          {/* Aquí podrías añadir elementos globales de la AppBar si es necesario */}
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {/* Aquí podrías poner un logo o un botón para cerrar el drawer */}
        </DrawerHeader>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/questions">
            <ListItemText primary="Banco de Preguntas" />
          </ListItem>
          <ListItem button component={Link} to="/assessments">
            <ListItemText primary="Mis Evaluaciones" />
          </ListItem>
          {/* Agrega más elementos de menú aquí */}
          <ListItem button onClick={logout}>
            <IconButton color="inherit" sx={{ ml: -1 }}>
              <LogoutIcon />
            </IconButton>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader /> {/* Esto empuja el contenido hacia abajo, debajo del AppBar */}
        {children}
      </Main>
    </Box>
  );
}

export default DashboardLayout;