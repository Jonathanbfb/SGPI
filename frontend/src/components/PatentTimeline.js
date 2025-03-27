import React, { useState, useEffect } from "react";
import {
  Container, Stepper, Step, StepLabel, Box, Accordion,
  AccordionSummary, AccordionDetails, TextField, Typography, Button,
  CircularProgress
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";

const statuses = [
  "1ª Etapa: Cadastrada com sucesso",
  "2ª Etapa: Busca de patentes similares",
  "3ª Etapa: Guia de pagamento",
  "4ª Etapa: Exame Formal",
  "5ª Etapa: Exame de Mérito",
  "6ª Etapa: Concessão"
];

const PatentTimeline = ({ patent, onUpdate }) => {
  const [formData, setFormData] = useState(() => patent?.info || {});
  const [currentStep, setCurrentStep] = useState(() => patent?.status || 0);
  const [loading, setLoading] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  useEffect(() => {
    if (onUpdate) {
      onUpdate({ ...formData, status: currentStep });
    }
  }, [currentStep, formData, onUpdate]);

  if (!patent) {
    return <Typography variant="h6">Carregando informações da patente...</Typography>;
  }

  const handleInputChange = (statusIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      [statusIndex]: { ...prev[statusIndex], [field]: value }
    }));
  };

  const handleSave = async (step) => {
    if (step === 1) {
      const userData = {
        nomeUsuario: "Usuário Logado",
        data: new Date().toLocaleDateString(),
        titulo: patent?.titulo || "",
        numero: patent?.numero || "",
      };
      setFormData(prev => ({ ...prev, [step]: userData }));
    }

    if (step === 2) {
      setLoading(true);
      try {
        const response = await axios.post("https://api.exemplo.com/processar", { patent });
        setFormData(prev => ({ ...prev, [step]: response.data }));
      } catch (error) {
        console.error("Erro ao processar API", error);
      }
      setLoading(false);
    }

    if (step < statuses.length - 1) {
      setCurrentStep(step + 1);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Timeline da Patente</Typography>
      <Stepper activeStep={currentStep} alternativeLabel>
        {statuses.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        {statuses.map((status, index) => (
          <Accordion key={index} expanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`}>
              <Typography variant="h6" color={index === currentStep ? "primary" : "inherit"}>{status}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {index === 2 || index >= 3 ? (
                <input type="file" accept={index === 2 ? ".pdf" : ".txt"} />
              ) : (
                <TextField
                  fullWidth
                  label="Informações"
                  multiline
                  rows={3}
                  value={formData[index]?.info || ""}
                  onChange={(e) => handleInputChange(index, "info", e.target.value)}
                />
              )}
              {index === currentStep && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { if (index === statuses.length - 1) setIsFinalized(true); handleSave(index); }}
                  disabled={loading}
                  style={{ marginTop: 10 }}
                >
                  {loading && index === 2 ? <CircularProgress size={24} /> : index === statuses.length - 1 ? "Finalizar" : "Salvar e avançar"}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {isFinalized && (
        <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
          <CheckCircleIcon color="success" fontSize="large" />
          <Typography variant="h6" color="green" ml={2}>Finalizado</Typography>
        </Box>
      )}
    </Container>
  );
};

export default PatentTimeline;
