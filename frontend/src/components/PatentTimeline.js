import React from "react";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

const PatentTimeline = ({ patent }) => {
  const statuses = [
    "1ª Etapa: Cadastrada com sucesso",
    "2ª Etapa: Busca de patentes similares",
    "3ª Etapa: Guia de pagamento",
    "4ª Etapa: Exame Formal",
    "5ª Etapa: Exame de Mérito",
    "6ª Etapa: Concessão"
  ];

  return (
    <Container>
      <Typography variant="h4">Timeline da Patente</Typography>
      <List>
        {statuses.map((status, index) => (
          <ListItem key={index}>
            <ListItemText primary={status} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PatentTimeline;