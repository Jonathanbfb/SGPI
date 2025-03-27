import React, { useState, useEffect, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PatentTimeline from "./PatentTimeline";
import Layout from "./Layout";

const PatentList = () => {
  const navigate = useNavigate();
  const [patents, setPatents] = useState([]);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedPatents = JSON.parse(localStorage.getItem("patents")) || [];
    setPatents(storedPatents);
  }, []);

  useEffect(() => {
    if (patents.length > 0) {
      localStorage.setItem("patents", JSON.stringify(patents));
    }
  }, [patents]);

  const updatePatentInfo = useCallback((updatedInfo) => {
    if (!selectedPatent) return;
    setPatents(prev =>
      prev.map(p =>
        p.id === selectedPatent.id ? { ...p, info: updatedInfo } : p
      )
    );
  }, [selectedPatent]);

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Typography variant="h4">Minhas Patentes</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/patent/new")}>
          Cadastrar Patente
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ width: '100%' }}>
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

      {/* Modal de Status */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Status da Patente</DialogTitle>
        <DialogContent>
          {selectedPatent && <PatentTimeline patent={selectedPatent} onUpdate={updatePatentInfo} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatentList;
