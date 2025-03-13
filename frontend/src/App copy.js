                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     import React, { useState, useEffect } from "react";
import { Container, TextField, Button, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import axios from "axios";

function App() {
    const [termoBusca, setTermoBusca] = useState("");
    const [patentes, setPatentes] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHistorico, setShowHistorico] = useState(false);

    // 📌 Buscar patentes no backend
    const buscarPatentes = async () => {
        if (!termoBusca) {
            alert("Digite um termo para buscar!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/buscar", { termo: termoBusca });
            setPatentes(response.data);
        } catch (error) {
            console.error("Erro ao buscar patentes:", error);
            alert("Erro ao buscar patentes.");
        }

        setLoading(false);
    };

    // 📌 Salvar patentes no banco
    const salvarPatentes = async () => {
        try {
            await axios.post("http://localhost:5000/salvar");
            alert("✅ Patentes salvas no banco!");
            setPatentes([]);
        } catch (error) {
            console.error("Erro ao salvar patentes:", error);
            alert("Erro ao salvar patentes.");
        }
    };

    // 📌 Carregar histórico salvo no banco
    const carregarHistorico = async () => {
        setShowHistorico(true);
        try {
            const response = await axios.get("http://localhost:5000/historico");
            setHistorico(response.data);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            alert("Erro ao carregar histórico.");
        }
    };

    return (
        <Container>
            <h1>🔍 Busca de Patentes</h1>
            <TextField label="Digite a palavra-chave" fullWidth value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} />
            <Button variant="contained" color="primary" onClick={buscarPatentes} style={{ marginTop: 10 }}>Buscar</Button>

            {loading && <CircularProgress style={{ marginTop: 20 }} />}

            <h2>📄 Resultados</h2>
            <List>
                {patentes.map((p, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={p.titulo} secondary={`📌 Nº Pedido: ${p.numero}`} />
                    </ListItem>
                ))}
            </List>

            {patentes.length > 0 && (
                <Button variant="contained" color="secondary" onClick={salvarPatentes} style={{ marginTop: 10 }}>
                    Salvar no Banco de Dados
                </Button>
            )}

            <Button variant="outlined" color="primary" onClick={carregarHistorico} style={{ marginTop: 20 }}>
                📜 Ver Histórico
            </Button>

            {showHistorico && (
                <List>
                    {historico.map((h, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={h.titulo} secondary={`📌 Nº Pedido: ${h.numero}`} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
}

export default App;
