import { useState } from "react";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import DatePicker from "react-date-picker";
import { SelectChangeEvent } from "@mui/material/Select";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { AttackFormType } from "../types/Attack";

interface AttackFormProps {
  addAttack: (attack: AttackFormType) => void;
}

const AttackForm = ({ addAttack }: AttackFormProps) => {
  const apiUrl = process.env.VITE_API_URL || "https://backend-sandy-eight.vercel.app";
  console.log("API URL in AttackForm:", apiUrl);
  const [formData, setFormData] = useState<AttackFormType>({
    type: "",
    intensity: "",
    invalidating: "",
    medication: "",
    menstruation: "",
    duration: "",
    date: new Date(),
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value as string,
    });
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setFormData({ ...formData, date: value });
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      setFormData({ ...formData, date: value[0] });
    } else {
      setFormData({ ...formData, date: new Date() });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.intensity) {
      setError("Type and Intensity are mandatory.");
      return;
    }

    const capitalizedType =
      formData.type.charAt(0).toUpperCase() +
      formData.type.slice(1).toLowerCase();
      // Verifica si formData.date es un objeto Date
  const attackDate = formData.date instanceof Date ? formData.date : new Date(formData.date);

    // Convertir date a string antes de enviarlo al servidor
    const formattedData = {
      ...formData,
      type: capitalizedType,
      date: attackDate.toISOString(), // Aquí convertimos a string ISO
    };

    console.log("Submitting data:", formattedData);

    try {
      const response = await axios.post(`${apiUrl}/api/attacks`, formattedData);
      addAttack(response.data); // Aquí el servidor te devolverá el ataque con la fecha como string
      setFormData({
        type: "",
        intensity: "",
        invalidating: "",
        medication: "",
        menstruation: "",
        duration: "",
        date: new Date(),
      });
      setError("");
    } catch (err) {
      console.error("Error saving attack:", err);
      setError("Error saving attack.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6">Record a New Attack</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth required>
        <InputLabel>Type</InputLabel>
        <Select value={formData.type} name="type" onChange={handleChange}>
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="headache">Headache</MenuItem>
          <MenuItem value="migraine">Migraine</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Intensity</InputLabel>
        <Select
          value={formData.intensity}
          name="intensity"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="2">Moderate</MenuItem>
          <MenuItem value="3">Intense</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Duration (hours)</InputLabel>
        <Select
          value={formData.duration}
          name="duration"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="12">12</MenuItem>
          <MenuItem value="24">24</MenuItem>
          <MenuItem value="48">48</MenuItem>
          <MenuItem value="72">72</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Medication</InputLabel>
        <Select
          value={formData.medication}
          name="medication"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="triptans">Triptans</MenuItem>
          <MenuItem value="ibuprofen">Ibuprofen</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Invalidating</InputLabel>
        <Select
          value={formData.invalidating}
          name="invalidating"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Menstruation</InputLabel>
        <Select
          value={formData.menstruation}
          name="menstruation"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body1">Migraine Start Date</Typography>
      <DatePicker
        onChange={handleDateChange}
        value={formData.date}
        format="dd/MM/yyyy"
        calendarIcon={null}
        clearIcon={null}
      />
      <Button type="submit" variant="contained" color="primary">
        Save Attack
      </Button>
    </Box>
  );
};

export default AttackForm;
