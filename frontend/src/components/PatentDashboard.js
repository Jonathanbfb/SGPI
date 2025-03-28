import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Avatar, Box } from "@mui/material";
import { Assignment, HourglassBottom, CheckCircle, Group } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
const COLORS = ["#8884d8", "#FFBB28", "#00C49F"];
const PatentDashboard = () => {
    const [patents, setPatents] = useState([]);
    useEffect(() => {
        const storedPatents = JSON.parse(localStorage.getItem("patents")) || [];
        setPatents(storedPatents);
    }, []);
    const total = patents.length;
    const emAndamento = patents.filter(p => p.status === 0).length;
    const concluidas = patents.filter(p => p.status === 1).length;
    const registradas = total;
    const usuarios = [...new Set(patents.map(p => p.usuario))];
    const data = [
        { name: "Em Andamento", value: emAndamento },
        { name: "Concluídas", value: concluidas },
        { name: "Registradas", value: registradas },
    ];
    const renderCard = (icon, label, value, color) => (
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
            <Box>
                <Typography variant="h6">{label}</Typography>
                <Typography variant="h5">{value}</Typography>
            </Box>
        </Card>
    );
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard de Patentes
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    {renderCard(<Assignment />, "Total Registradas", registradas, "#1976d2")}
                </Grid>
                <Grid item xs={12} md={4}>
                    {renderCard(<HourglassBottom />, "Em Andamento", emAndamento, "#ffa000")}
                </Grid>
                <Grid item xs={12} md={4}>
                    {renderCard(<CheckCircle />, "Concluídas", concluidas, "#2e7d32")}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Distribuição de Status</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="bottom"
                                    layout="horizontal"
                                    wrapperStyle={{ marginTop: 20 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Usuários que abriram patentes
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {usuarios.map((usuario, index) => (
                                <Card key={index} sx={{ p: 2, flex: "1 0 45%", display: "flex", alignItems: "center" }}>
                                    <Avatar sx={{ bgcolor: "#607d8b", mr: 2 }}>
                                        <Group />
                                    </Avatar>
                                    <Typography>{usuario}</Typography>
                                </Card>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
export default PatentDashboard;
