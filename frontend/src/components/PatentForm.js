import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthenticatedUser } from "./auth"; // Obtém o usuário logado

const PatentForm = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [numero, setNumero] = useState("");
  const [observacao, setObservacao] = useState("");
  const [usuario, setUsuario] = useState("");
  const [dataHoraAbertura, setDataHoraAbertura] = useState("");
  const [patentesSimilares, setPatentesSimilares] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [patentID, setPatentID] = useState(null); 

  // Obtém usuário logado e define a data/hora automaticamente
  useEffect(() => {
    const user = getAuthenticatedUser();
    if (user) {
      setUsuario(user.username);
    }
    setDataHoraAbertura(new Date().toLocaleString());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (titulo && numero) {
      const newPatent = {
        id: Date.now(), // Criando um ID único para a patente
        titulo,
        numero,
        dataHoraAbertura,
        usuario,
        observacao,
        status: 0
      };

      // Salvar no LocalStorage
      const storedPatents = JSON.parse(localStorage.getItem("patents")) || [];
      storedPatents.push(newPatent);
      localStorage.setItem("patents", JSON.stringify(storedPatents));

      // Definir ID da patente para buscar similares
      setPatentID(newPatent.id);

      // Chamar API para buscar patentes similares
      buscarPatentesSimilares(newPatent.titulo, newPatent.id);

      navigate("/patents");
    }
  };

  const buscarPatentesSimilares = async (titulo, id) => {
    setBuscando(true);
    try {
      // 1️⃣ Buscar patentes (scraper)
      const response = await axios.post("http://localhost:5000/buscar", { termo: titulo }, {
        headers: { "Content-Type": "application/json" }
      });
  
      // 2️⃣ Salvar patentes no banco
      const salvarResponse = await axios.post("http://localhost:5000/salvar", { palavra_chave: titulo }, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("✅ Patentes salvas:", salvarResponse.data);
  
      // 3️⃣ Buscar histórico atualizado
      const historicoResponse = await axios.get("http://localhost:5000/historico", { params: { id } });
      setPatentesSimilares(historicoResponse.data);
  
    } catch (error) {
      console.error("❌ Erro ao buscar/salvar patentes similares:", error.response ? error.response.data : error);
    }
    setBuscando(false);
  };
  
  return (
    <Container>
      <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Voltar
      </Button>
      <Typography variant="h4">Cadastro de Patente</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título da Patente"
          fullWidth
          margin="normal"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <TextField
          label="Número do Pedido"
          fullWidth
          margin="normal"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <TextField
          label="Data e Hora da Abertura"
          fullWidth
          margin="normal"
          value={dataHoraAbertura}
          disabled
        />
        <TextField
          label="Usuário"
          fullWidth
          margin="normal"
          value={usuario}
          disabled
        />
        <TextField
          label="Observação"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Cadastrar e Buscar Similares
        </Button>
      </form>

      {/* Se houver busca em andamento */}
      {buscando && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
          <Typography variant="body1">Buscando patentes similares...</Typography>
        </div>
      )}

      {/* Exibir a lista de patentes similares encontradas */}
      {patentesSimilares.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <Typography variant="h5">Patentes Similares Encontradas</Typography>
          <List>
            {patentesSimilares.map((patente, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={patente.titulo}
                  secondary={`Número: ${patente.numero} | Data: ${patente.dataHoraAbertura}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Container>
  );
};

export default PatentForm;
