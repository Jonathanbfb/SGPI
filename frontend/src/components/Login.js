
import React, { useState } from "react";
import { Container, TextField, Button, Link, Typography } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempt", { username, password });
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField label="Usuário" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField label="Senha" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleLogin}>Entrar</Button>
      <Link href="#">Esqueci a senha</Link>
    </Container>
  );
};

export default Login;