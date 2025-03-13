// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, CircularProgress, Stepper, Step, StepLabel, Typography, Box, Input } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import PatentForm from "./components/PatentForm";

const mockPatents = [
  {
    id: 1,
    titulo: "Sistema de Energia Solar Inteligente",
    numero: "BR1023456A",
    status: 0,
  },
  {
    id: 2,
    titulo: "Processo de Purificação de Água",
    numero: "BR9876543B",
    status: 2,
  }
];

const PatentTimeline = ({ patent }) => {
  const [activeStep, setActiveStep] = useState(patent.status);
  const [paymentFile, setPaymentFile] = useState(null);
  const [publicationStatus, setPublicationStatus] = useState({ formal: "", mérito: "", concessão: "" });

  const statuses = [
    "1ª Etapa: Cadastrada com sucesso",
    "2ª Etapa: Busca de patentes similares",
    "3ª Etapa: Guia de pagamento",
    "4ª Etapa: Exame Formal",
    "5ª Etapa: Exame de Mérito",
    "6ª Etapa: Concessão"
  ];

  const handleFileUpload = (e) => {
    setPaymentFile(e.target.files[0]);
  };

  const handlePublicationUpdate = (field, value) => {
    setPublicationStatus({ ...publicationStatus, [field]: value });
  };

  return (
    <Container>
      <Typography variant="h4">Timeline da Patente</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {statuses.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box mt={4}>
        {activeStep === 2 && (
          <>
            <Typography variant="h6">Guia de Pagamento</Typography>
            <Input type="file" onChange={handleFileUpload} />
            <Typography color={paymentFile ? "green" : "orange"}>{paymentFile ? "✅ Documento Anexado" : "⚠️ Aguardando Pagamento"}</Typography>
          </>
        )}
        {activeStep >= 3 && (
          <>
            <Typography variant="h6">Exame Formal</Typography>
            <TextField label="Última publicação" fullWidth onChange={(e) => handlePublicationUpdate("formal", e.target.value)} />
          </>
        )}
        {activeStep >= 4 && (
          <>
            <Typography variant="h6">Exame de Mérito</Typography>
            <TextField label="Última publicação" fullWidth onChange={(e) => handlePublicationUpdate("mérito", e.target.value)} />
          </>
        )}
        {activeStep >= 5 && (
          <>
            <Typography variant="h6">Concessão</Typography>
            <TextField label="Última publicação" fullWidth onChange={(e) => handlePublicationUpdate("concessão", e.target.value)} />
          </>
        )}
      </Box>
    </Container>
  );
};

const PatentList = () => {
  const [patents, setPatents] = useState(mockPatents);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <h2>Minhas Patentes</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Nº Pedido</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patents.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.titulo}</TableCell>
                <TableCell>{p.numero}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => { setSelectedPatent(p); setOpen(true); }}>
                    Ver Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Status da Patente</DialogTitle>
        <DialogContent>
          {selectedPatent && <PatentTimeline patent={selectedPatent} />}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patent/new" element={<PatentForm />} />
          <Route path="/patents" element={<PatentList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;