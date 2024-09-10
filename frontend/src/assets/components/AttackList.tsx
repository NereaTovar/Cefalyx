import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { AttackListType } from "../types/Attack";

interface AttackListProps {
  attacks: AttackListType[];
  setAttacks: (attacks: AttackListType[]) => void;
}

const getIntensityLabel = (intensity: string) => {
  switch (intensity) {
    case "2":
      return "Moderate";
    case "3":
      return "Intense";
    default:
      return "Unknown";
  }
};

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
  const apiUrl =
    process.env.API_URL ||
    "https://cefalyx-nereas-projects-2a045b48.vercel.app";
  const [filteredAttacks, setFilteredAttacks] = useState<AttackListType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [listVisible, setListVisible] = useState(false);

  const fetchAttacks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/attacks`);
      const fetchedAttacks: AttackListType[] = Array.isArray(response.data)
        ? response.data
        : [];
      const sortedAttacks = fetchedAttacks.sort(
        (a: AttackListType, b: AttackListType) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      );
      setAttacks(sortedAttacks);
    } catch (err) {
      console.error("Error fetching attacks:", err);
    }
  };

  useEffect(() => {
    fetchAttacks();
    const intervalId = setInterval(fetchAttacks, 3001);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterAttacks();
  }, [selectedMonth, selectedType, attacks]);

  const filterAttacks = () => {
    let filtered = attacks;

    if (selectedMonth) {
      filtered = filtered.filter((attack) => {
        const attackDate = new Date(attack.date);
        return attackDate.getMonth() === parseInt(selectedMonth);
      });
    }

    if (selectedType) {
      filtered = filtered.filter(
        (attack) => attack.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredAttacks(filtered);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(18);
    doc.text("Attack List", 10, y);
    y += 10;

    doc.setFontSize(12);
    filteredAttacks.forEach((attack, index) => {
      doc.text(`Date: ${formatDate(attack.date)}`, 10, y);
      y += 6;
      doc.text(
        `Type: ${attack.type} - Intensity: ${getIntensityLabel(
          attack.intensity
        )}`,
        10,
        y
      );
      y += 6;
      doc.text(
        `Duration: ${attack.duration ? `${attack.duration} hours` : "N/A"}`,
        10,
        y
      );
      y += 6;
      doc.text(
        `Medication: ${attack.medication ? "Yes" : "No"} - Invalidating: ${
          attack.invalidating ? "Yes" : "No"
        } - Menstruation: ${attack.menstruation ? "Yes" : "No"}`,
        10,
        y
      );
      y += 10;
      if (index < filteredAttacks.length - 1) {
        doc.line(10, y, 200, y);
        y += 5;
      }
    });

    doc.save("attack-list.pdf");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredAttacks.map((attack) => ({
        Date: formatDate(attack.date),
        Type: attack.type,
        Intensity: getIntensityLabel(attack.intensity),
        Duration: attack.duration ? `${attack.duration} hours` : "N/A",
        Medication: attack.medication ? "Yes" : "No",
        Invalidating: attack.invalidating ? "Yes" : "No",
        Menstruation: attack.menstruation ? "Yes" : "No",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attack List");
    XLSX.writeFile(workbook, "attack-list.xlsx");
  };

  const toggleListVisibility = () => {
    setListVisible(!listVisible);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        border: "1px solid",
        borderColor: "grey.500",
        borderRadius: 2,
        p: 2,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Attack List</Typography>
        <IconButton onClick={toggleListVisibility}>
          {listVisible ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {listVisible && (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value as string)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="0">January</MenuItem>
              <MenuItem value="1">February</MenuItem>
              <MenuItem value="2">March</MenuItem>
              <MenuItem value="3">April</MenuItem>
              <MenuItem value="4">May</MenuItem>
              <MenuItem value="5">June</MenuItem>
              <MenuItem value="6">July</MenuItem>
              <MenuItem value="7">August</MenuItem>
              <MenuItem value="8">September</MenuItem>
              <MenuItem value="9">October</MenuItem>
              <MenuItem value="10">November</MenuItem>
              <MenuItem value="11">December</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as string)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="headache">Headache</MenuItem>
              <MenuItem value="migraine">Migraine</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {filteredAttacks.length} result
            {filteredAttacks.length !== 1 ? "s" : ""}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPdf}
            >
              Download as PDF
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "olive", color: "white" }}
              onClick={handleDownloadExcel}
            >
              Download as Excel
            </Button>
          </Box>

          {filteredAttacks.length === 0 ? (
            <Typography>No attacks recorded.</Typography>
          ) : (
            <List sx={{ width: "100%" }}>
              {filteredAttacks.map((attack, index) => (
                <div key={attack._id}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="body1">
                      Date: {formatDate(attack.date)}
                    </Typography>
                    <Typography variant="body1">
                      Type: {attack.type} - Intensity:{" "}
                      {getIntensityLabel(attack.intensity)}
                    </Typography>
                    <Typography variant="body1">
                      Duration:{" "}
                      {attack.duration ? `${attack.duration} hours` : "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      Medication: {attack.medication ? "Yes" : "No"} -
                      Invalidating: {attack.invalidating ? "Yes" : "No"} -
                      Menstruation: {attack.menstruation ? "Yes" : "No"}
                    </Typography>
                  </ListItem>
                  {index < filteredAttacks.length - 1 && (
                    <Divider sx={{ width: "100%" }} />
                  )}
                </div>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
};

export default AttackList;
