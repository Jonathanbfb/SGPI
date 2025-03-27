import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("Usuário cadastrado:", { name, email, profile, password });
    // Aqui você pode adicionar a lógica de envio para a API
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      {/* Botão de voltar */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/patents")}
        sx={{ mb: 3 }}
      >
        Voltar para o Menu
      </Button>

      {/* Título */}
      <Typography variant="h4" gutterBottom>
        Cadastro de Usuário
      </Typography>

      {/* Formulário */}
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Perfil</InputLabel>
          <Select
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            label="Perfil"
          >
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Pesquisador">Pesquisador</MenuItem>
            <MenuItem value="Engenheiro">Engenheiro</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
        >
          Cadastrar
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
