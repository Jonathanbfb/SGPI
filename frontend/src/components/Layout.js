import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUser, logoutUser } from "./auth";
import logo from "../assets/logo.png";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = getAuthenticatedUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const getMenuItems = () => {
    const commonItems = [
      { label: "Cadastrar Patente", path: "/patent/new" },
      { label: "Listar Patentes", path: "/patents" },
      { label: "Dashboard", path: "/dashboard" },
    ];

    if (user.role === "Administrador") {
      return [
        { label: "Cadastrar Usuários", path: "/register" },
        ...commonItems
      ];
    }

    return commonItems;
  };

  return (
    <Box sx={{ display: "flex", width: '100vw', overflowX: 'hidden' }}>
      {/* AppBar superior */}
      <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: "#007B8F" }}>
        <Toolbar>
          <Avatar src={logo} sx={{ mr: 2, width: 28, height: 40, p: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Gerenciamento de Patentes Industriais
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Sair</Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            mt: 8,
            backgroundColor: "#f5f5f5",
            borderRight: "1px solid #ddd"
          },
        }}
      >
        <List>
          {getMenuItems().map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => navigate(item.path)}
              sx={{
                m: 1,
                borderRadius: 2,
                transition: "0.3s",
                '&:hover': {
                  backgroundColor: '#e0f7fa',
                  transform: 'scale(1.02)',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: '#007B8F'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Conteúdo principal com Paper e largura total */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, width: `calc(100vw - ${drawerWidth}px)` }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '100%', overflowX: 'auto' }}>
          {children}
        </Paper>
      </Box>
      
    </Box>
  );
};

export default Layout;
