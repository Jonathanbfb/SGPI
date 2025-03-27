import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { loginUser } from "./auth";
import videoSource from "../assets/video.mov";
import logo from "../assets/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = loginUser(username, password);
    if (user) {
      navigate(`/${user.role.toLowerCase()}`);
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        src={videoSource}
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <Card
        sx={{
          p: 5,
          minWidth: 340,
          borderRadius: 4,
          boxShadow: 6,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(6px)",
        }}
      >
        <CardContent component="form" onSubmit={(e) => {
          e.preventDefault(); // impede o reload da página
          handleLogin();      // chama o login
        }}>
          <Typography variant="h4" gutterBottom color="primary">
            SGPI
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              backgroundColor: "#007B8F",
              borderRadius: "50%",
              margin: "0 auto 24px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
          >
            <img src={logo} alt="SGPI Logo" style={{ width: 70 }} />
          </Box>

          <TextField
            fullWidth
            label="Usuário"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#007B8F',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007B8F',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#007B8F',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007B8F',
                },
              },
            }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit" // <- Aqui!
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
