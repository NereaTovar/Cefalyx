import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete,ExpandLess, ExpandMore } from "@mui/icons-material";
import { AttackListType } from "../../types/Attack";

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : "https://cefalyx-nereas-projects-2a045b48.vercel.app";


interface AttackListProps {
  attacks: AttackListType[];
  setAttacks: React.Dispatch<React.SetStateAction<AttackListType[]>>;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AttackList = ({ attacks, setAttacks }: AttackListProps) => {
  const [listVisible, setListVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchAttacks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/attacks`);
      const fetchedAttacks: AttackListType[] = Array.isArray(response.data)
        ? response.data
        : [];

      // Ordenar los ataques por fecha (más reciente primero)
      const sortedAttacks = fetchedAttacks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAttacks(sortedAttacks); // Actualizamos el estado con el nuevo arreglo
    } catch (err) {
      console.error("Error fetching attacks:", err);
    }
  };

  const handleDelete = async (attackId: string) => {
    console.log("Attempting to delete attack with ID:", attackId); // Verificar el ID
    try {
      await axios.delete(`${apiUrl}/api/attacks/${attackId}`);
      setAttacks((prev: AttackListType[]) =>
        prev.filter((attack: AttackListType) => attack._id !== attackId)
      );
      setSnackbarOpen(true); // Mostrar mensaje de éxito
    } catch (err) {
      console.error("Error deleting attack:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchAttacks();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Attack List</Typography>
      <IconButton onClick={() => setListVisible(!listVisible)}>
        {listVisible ? <ExpandLess /> : <ExpandMore />}
      </IconButton>

      {listVisible && (
        <List>
          {attacks.map((attack) => (
            <div key={attack._id}>
              <ListItem>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">
                    Date: {formatDate(attack.date)}
                  </Typography>
                  <Typography variant="body1">Type: {attack.type}</Typography>
                  <Typography variant="body1">
                    Intensity: {attack.intensity}
                  </Typography>
                  <Typography variant="body1">
                    Duration: {attack.duration}
                  </Typography>
                  <Typography variant="body1">
                    Medication: {attack.medication}
                  </Typography>
                  <Typography variant="body1">
                    Invalidating: {attack.invalidating}
                  </Typography>
                  <Typography variant="body1">
                    Menstruation: {attack.menstruation}
                  </Typography>
                  {/* Botón de eliminar */}
                  <Button
                    startIcon={<Delete />}
                    onClick={() => handleDelete(attack._id!)} // Verificar que _id existe
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}

      {/* Snackbar para mostrar el mensaje "Attack deleted" */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Attack deleted
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttackList;
