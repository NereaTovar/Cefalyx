import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Box, CssBaseline, Typography } from "@mui/material";
import AttackForm from "./assets/components/attack-form/AttackForm";
import AttackList from "./assets/components/attack-list/AttackList";
import { AttackFormType, AttackListType } from "./assets/types/Attack";
import "./App.css";

const App = () => {
  const [attacks, setAttacks] = useState<AttackListType[]>([]);

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        // Añadir withCredentials si es necesario
        const response = await axios.get("/api/attacks", {
          withCredentials: true, 
        });
        setAttacks(response.data);
      } catch (err) {
        console.error("Error fetching attacks:", err);
      }
    };
    fetchAttacks();
  }, []);

  // Función para agregar un nuevo ataque
  const addAttack = (newAttack: AttackFormType) => {
    const attackDate =
      newAttack.date instanceof Date
        ? newAttack.date
        : new Date(newAttack.date);
    const newAttackWithDateString: AttackListType = {
      ...newAttack,
      date: attackDate.toISOString(),
      medication: newAttack.medication === "yes",
      invalidating: newAttack.invalidating === "yes",
      menstruation: newAttack.menstruation === "yes",
    };

    setAttacks((prevAttacks) => [newAttackWithDateString, ...prevAttacks]);
  };

  return (
    <Container>
      <CssBaseline />
      <Box className="container">
        <Typography variant="h4" component="h1" gutterBottom className="title">
          MyGraine
        </Typography>
        <AttackForm addAttack={addAttack} />
        <AttackList attacks={attacks} setAttacks={setAttacks} />
      </Box>
    </Container>
  );
};

export default App;
