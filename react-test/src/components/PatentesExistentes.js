import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    AppBar, Toolbar, Typography, TextField, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Box, Drawer, List, ListItem, 
    ListItemText, CssBaseline, IconButton, Container 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import headerLogo from '../img/headerLogo.png';

function PatentesExistentes() {
    const navigate = useNavigate();
    const [patentes, setPatentes] = useState([]);
    const [nomePatente, setNomePatente] = useState('');
    const [error, setError] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const pesquisar = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3106/result', { 'buscaPatente': nomePatente });
            setPatentes(response.data.patentes);
        } catch (error) {
            setError(error?.response ? 'Erro na busca' : 'Erro ao acessar o servidor');
        }
    };

    const homePath = () => {
        navigate('/Home');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
            <CssBaseline />

            {/* Barra de Navegação Superior */}
            <AppBar position="fixed" sx={{ backgroundColor: '#4A90E2', height: "60px" }}>
                <Toolbar sx={{ minHeight: 20 }}> {/* Altura reduzida */}
                    <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <img src={headerLogo} alt="Logo" style={{ height: 40, cursor: 'pointer', marginRight: 15 }} onClick={homePath} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Patentes Existentes
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Menu Lateral (Drawer) */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem 
                            button 
                            onClick={homePath} 
                            sx={{ '&:hover': { backgroundColor: '#f0f0f0', color: '#1976d2' } }}
                        >
                            <ListItemText primary="Início" />
                        </ListItem>
                        <ListItem 
                            button 
                            sx={{ '&:hover': { backgroundColor: '#f0f0f0', color: '#1976d2' } }}
                        >
                            <ListItemText primary="Minhas Patentes" />
                        </ListItem>
                        <ListItem 
                            button 
                            sx={{ '&:hover': { backgroundColor: '#f0f0f0', color: '#1976d2' } }}
                        >
                            <ListItemText primary="Configurações" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* Conteúdo Principal */}
            <Container 
                maxWidth="md" 
                sx={{ 
                    flexGrow: 1, 
                    mt: 10, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* Campo de Busca */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Digite o nome da patente"
                        variant="outlined"
                        value={nomePatente}
                        onChange={(e) => setNomePatente(e.target.value)}
                    />
                    <Button variant="contained" color="primary" startIcon={<SearchIcon />} onClick={pesquisar}>
                        Pesquisar
                    </Button>
                </Box>

                {/* Exibição de Erro (se existir) */}
                {error && (
                    <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {/* Tabela de Resultados - Agora ajustável */}
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        borderRadius: 2, 
                        boxShadow: 3, 
                        width: '100%',  
                        maxWidth: '1000px',  
                        padding: '10px' 
                    }}
                >
                    <Table sx={{ justifyContent: 'center', width: '95%' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'black' }}>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
                                    Nome da Patente
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patentes.length > 0 ? (
                                patentes.map((patente, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <a href={patente.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                {patente.titulo}
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={1} sx={{ textAlign: 'center' }}>Nenhuma patente encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
}

export default PatentesExistentes;
