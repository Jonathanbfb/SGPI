import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Container, Box, Alert } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import usuarios from './Usuarios.json';

export default function Recuperar({ isOpen, setSwitchs }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isOpen) {
           
        }
    }, [isOpen]);

    const homePath = () => {
        navigate('/Home');
    };

    const handleLogin = () => {
        const usuarioAutenticado = usuarios.find(
            (user) => user.nome === email && user.senha === senha
        );

        if (usuarioAutenticado) {
            localStorage.setItem("nome", usuarioAutenticado.nome);
            localStorage.setItem("cargo", usuarioAutenticado.office);
            localStorage.setItem("rota", usuarioAutenticado.rota);
            setError('');
            homePath();
        } else {
            setError('Usuário ou senha incorretos');
        }
    };

    const handleApiLogin = async () => {
        try {
            const response = await axios.post("http://localhost:4557/login", {
                email, senha
            });

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem("nome", data.name);
                localStorage.setItem("cargo", data.office);
                localStorage.setItem("employeeId", data._id);
                localStorage.setItem("companyId", data.company);
                setError('');
                homePath();
            } else {
                setError('Usuário ou senha incorretos');
            }
        } catch (error) {
            setError('Erro ao fazer login. Verifique sua conexão.');
        }
    };

    return isOpen ? (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, p: 2, bgcolor: '#1E1E2F', borderRadius: 2, boxShadow: 4, width: '90%', maxWidth: '360px' }}>
            <Typography variant="h5" color="#00E5FF" gutterBottom>Login</Typography>
            <Box sx={{ width: '100%', mb: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
            <TextField fullWidth label="Email" variant="standard" type="email" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1 }} /> }} sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }} />
            <TextField fullWidth label="Senha" variant="standard" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }} sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }} />
            <FormControlLabel control={<Checkbox />} label="Manter-me conectado" sx={{ color: 'white' }} />
            <Button fullWidth variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2, bgcolor: '#00E5FF', color: '#1E1E2F' }}>
                ENTRAR
            </Button>
            <Typography variant="body2" color="#00E5FF" sx={{ mt: 2, cursor: 'pointer' }} onClick={setSwitchs}>
                Esqueceu a senha?
            </Typography>
        </Container>
    ) : null;
}
