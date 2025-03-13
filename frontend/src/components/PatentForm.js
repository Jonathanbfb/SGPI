import React, { useState } from "react";
import { Container, TextField, Button, Select, MenuItem, Typography, Input } from "@mui/material";

const PatentForm = () => {
  const [natureza, setNatureza] = useState("PF");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [titulo, setTitulo] = useState("");
  const [documento, setDocumento] = useState(null);

  const handleFileChange = (e) => {
    setDocumento(e.target.files[0]);
  };

  const handleSubmit = () => {
    console.log("Patente cadastrada", { natureza, cpfCnpj, responsavel, titulo, documento });
  };

  return (
    <Container>
      <Typography variant="h4">Cadastro de Patente</Typography>
      <Select fullWidth value={natureza} onChange={(e) => setNatureza(e.target.value)}>
        <MenuItem value="PF">Pessoa Física</MenuItem>
        <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
      </Select>
      <TextField label="CPF/CNPJ" fullWidth value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
      <TextField label="Nome do Responsável" fullWidth value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
      <TextField label="Título da Patente" fullWidth value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <Input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Cadastrar</Button>
    </Container>
  );
};

export default PatentForm;