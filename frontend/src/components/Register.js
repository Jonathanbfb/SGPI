import React, { useState } from "react";
import { Container, TextField, Button, Select, MenuItem, Typography } from "@mui/material";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("User registered", { name, email, profile, password });
  };

  return (
    <Container>
      <Typography variant="h4">Cadastro</Typography>
      <TextField label="Nome" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
      <Select fullWidth value={profile} onChange={(e) => setProfile(e.target.value)}>
        <MenuItem value="Administrador">Administrador</MenuItem>
        <MenuItem value="Pesquisador">Pesquisador</MenuItem>
        <MenuItem value="Engenheiro">Engenheiro</MenuItem>
      </Select>
      <TextField label="Senha" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleRegister}>Cadastrar</Button>
    </Container>
  );
};

export default Register;