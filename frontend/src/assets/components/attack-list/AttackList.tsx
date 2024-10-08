// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   IconButton,
// } from "@mui/material";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import { AttackListType } from "../../types/Attack";

// interface AttackListProps {
//   attacks: AttackListType[];
//   setAttacks: (attacks: AttackListType[]) => void;
// }

// const getIntensityLabel = (intensity: string) => {
//   switch (intensity) {
//     case "2":
//       return "Moderate";
//     case "3":
//       return "Intense";
//     default:
//       return "Unknown";
//   }
// };

// const formatDate = (dateString: string) => {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//   };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const AttackList = ({ attacks, setAttacks }: AttackListProps) => {
//   const apiUrl =
//     import.meta.env.API_URL ||
//     "https://cefalyx-nereas-projects-2a045b48.vercel.app";
//   const [filteredAttacks, setFilteredAttacks] = useState<AttackListType[]>([]);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [listVisible, setListVisible] = useState(false);

//   const fetchAttacks = async () => {
//     try {
//       const response = await axios.get(${apiUrl}/api/attacks);
//       const fetchedAttacks: AttackListType[] = Array.isArray(response.data)
//         ? response.data
//         : [];
//       const sortedAttacks = fetchedAttacks.sort(
//         (a: AttackListType, b: AttackListType) => {
//           return new Date(b.date).getTime() - new Date(a.date).getTime();
//         }
//       );
//       setAttacks(sortedAttacks);
//     } catch (err) {
//       console.error("Error fetching attacks:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAttacks();
//     const intervalId = setInterval(fetchAttacks, 3001);
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     filterAttacks();
//   }, [selectedMonth, selectedType, attacks]);

//   const filterAttacks = () => {
//     let filtered = attacks;

//     if (selectedMonth) {
//       filtered = filtered.filter((attack) => {
//         const attackDate = new Date(attack.date);
//         return attackDate.getMonth() === parseInt(selectedMonth);
//       });
//     }

//     if (selectedType) {
//       filtered = filtered.filter(
//         (attack) => attack.type.toLowerCase() === selectedType.toLowerCase()
//       );
//     }

//     setFilteredAttacks(filtered);
//   };

//   const handleDownloadPdf = () => {
//     const doc = new jsPDF();
//     let y = 10;

//     doc.setFontSize(18);
//     doc.text("Attack List", 10, y);
//     y += 10;

//     doc.setFontSize(12);
//     filteredAttacks.forEach((attack, index) => {
//       doc.text(Date: ${formatDate(attack.date)}, 10, y);
//       y += 6;
//       doc.text(
//         Type: ${attack.type} - Intensity: ${getIntensityLabel(
//           attack.intensity
//         )},
//         10,
//         y
//       );
//       y += 6;
//       doc.text(
//         Duration: ${
//           attack.duration && attack.duration !== "N/A"
//             ? ${attack.duration} hours
//             : "N/A"
//         },
//         10,
//         y
//       );
//       y += 6;
//       doc.text(
//         Medication: ${
//           attack.medication === "yes"
//             ? "Yes"
//             : attack.medication === "no"
//             ? "No"
//             : "N/A"
//         } - Invalidating: ${
//           attack.invalidating === "yes"
//             ? "Yes"
//             : attack.invalidating === "no"
//             ? "No"
//             : "N/A"
//         } - Menstruation: ${
//           attack.menstruation === "yes"
//             ? "Yes"
//             : attack.menstruation === "no"
//             ? "No"
//             : "N/A"
//         },
//         10,
//         y
//       );
//       y += 10;
//       if (index < filteredAttacks.length - 1) {
//         doc.line(10, y, 200, y);
//         y += 5;
//       }
//     });

//     doc.save("attack-list.pdf");
//   };

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredAttacks.map((attack) => ({
//         Date: formatDate(attack.date),
//         Type: attack.type,
//         Intensity: getIntensityLabel(attack.intensity),
//         Duration: attack.duration ? ${attack.duration} hours : "N/A",
//         Medication:
//           attack.medication === "yes"
//             ? "Yes"
//             : attack.medication === "no"
//             ? "No"
//             : "N/A",
//         Invalidating:
//           attack.invalidating === "yes"
//             ? "Yes"
//             : attack.invalidating === "no"
//             ? "No"
//             : "N/A",
//         Menstruation:
//           attack.menstruation === "yes"
//             ? "Yes"
//             : attack.menstruation === "no"
//             ? "No"
//             : "N/A",
//       }))
//     );

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Attack List");
//     XLSX.writeFile(workbook, "attack-list.xlsx");
//   };

//   const toggleListVisibility = () => {
//     setListVisible(!listVisible);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         width: "100%",
//         maxWidth: 600,
//         border: "1px solid",
//         borderColor: "grey.500",
//         borderRadius: 2,
//         p: 2,
//         mt: 2,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           width: "100%",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Typography variant="h6">Attack List</Typography>
//         <IconButton onClick={toggleListVisibility}>
//           {listVisible ? <ExpandLess /> : <ExpandMore />}
//         </IconButton>
//       </Box>

//       {listVisible && (
//         <>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Month</InputLabel>
//             <Select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value as string)}
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               <MenuItem value="0">January</MenuItem>
//               <MenuItem value="1">February</MenuItem>
//               <MenuItem value="2">March</MenuItem>
//               <MenuItem value="3">April</MenuItem>
//               <MenuItem value="4">May</MenuItem>
//               <MenuItem value="5">June</MenuItem>
//               <MenuItem value="6">July</MenuItem>
//               <MenuItem value="7">August</MenuItem>
//               <MenuItem value="8">September</MenuItem>
//               <MenuItem value="9">October</MenuItem>
//               <MenuItem value="10">November</MenuItem>
//               <MenuItem value="11">December</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Type</InputLabel>
//             <Select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value as string)}
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               <MenuItem value="headache">Headache</MenuItem>
//               <MenuItem value="migraine">Migraine</MenuItem>
//             </Select>
//           </FormControl>

//           <Typography variant="body1" sx={{ mb: 2 }}>
//             {filteredAttacks.length} result
//             {filteredAttacks.length !== 1 ? "s" : ""}
//           </Typography>

//           <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleDownloadPdf}
//             >
//               Download as PDF
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: "olive", color: "white" }}
//               onClick={handleDownloadExcel}
//             >
//               Download as Excel
//             </Button>
//           </Box>

//           {filteredAttacks.length === 0 ? (
//             <Typography>No attacks recorded.</Typography>
//           ) : (
//             <List sx={{ width: "100%" }}>
//               {filteredAttacks.map((attack, index) => (
//                 <div key={attack._id}>
//                   <ListItem
//                     sx={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "flex-start",
//                     }}
//                   >
//                     <Typography variant="body1">
//                       Date: {formatDate(attack.date)}
//                     </Typography>
//                     <Typography variant="body1">
//                       Type: {attack.type} - Intensity:{" "}
//                       {getIntensityLabel(attack.intensity)}
//                     </Typography>
//                     <Typography variant="body1">
//                       Duration:{" "}
//                       {attack.duration ? ${attack.duration} hours : "N/A"}
//                     </Typography>
//                     <Typography variant="body1">
//                       Medication:{" "}
//                       {attack.medication ? ${attack.medication}  : "N/A"}-
//                       Invalidating:{" "}
//                       {attack.invalidating === "N/A"
//                         ? "N/A"
//                         : attack.invalidating === "yes"
//                         ? "Yes"
//                         : "No"}{" "}
//                       - Menstruation:{" "}
//                       {attack.menstruation === "N/A"
//                         ? "N/A"
//                         : attack.menstruation === "yes"
//                         ? "Yes"
//                         : "No"}
//                     </Typography>
//                   </ListItem>
//                   {index < filteredAttacks.length - 1 && (
//                     <Divider sx={{ width: "100%" }} />
//                   )}
//                 </div>
//               ))}
//             </List>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default AttackList;

//OPCION 2

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   Divider,
//   Button,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { Delete,ExpandLess, ExpandMore } from "@mui/icons-material";
// import { AttackListType } from "../../types/Attack";

// const apiUrl =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:3001"
//     : "https://cefalyx-nereas-projects-2a045b48.vercel.app";

// interface AttackListProps {
//   attacks: AttackListType[];
//   setAttacks: React.Dispatch<React.SetStateAction<AttackListType[]>>;
// }

// const formatDate = (dateString: string) => {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//   };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const AttackList = ({ attacks, setAttacks }: AttackListProps) => {
//   const [listVisible, setListVisible] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const fetchAttacks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/attacks`);
//       const fetchedAttacks: AttackListType[] = Array.isArray(response.data)
//         ? response.data
//         : [];

//       // Ordenar los ataques por fecha (más reciente primero)
//       const sortedAttacks = fetchedAttacks.sort(
//         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//       );
//       setAttacks(sortedAttacks); // Actualizamos el estado con el nuevo arreglo
//     } catch (err) {
//       console.error("Error fetching attacks:", err);
//     }
//   };

//   const handleDelete = async (attackId: string) => {
//     console.log("Attempting to delete attack with ID:", attackId); // Verificar el ID
//     try {
//       await axios.delete(`${apiUrl}/api/attacks/${attackId}`);
//       setAttacks((prev: AttackListType[]) =>
//         prev.filter((attack: AttackListType) => attack._id !== attackId)
//       );
//       setSnackbarOpen(true); // Mostrar mensaje de éxito
//     } catch (err) {
//       console.error("Error deleting attack:", err);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   useEffect(() => {
//     fetchAttacks();
//   }, []);

//   return (
//     <Box>
//       <Typography variant="h6">Attack List</Typography>
//       <IconButton onClick={() => setListVisible(!listVisible)}>
//         {listVisible ? <ExpandLess /> : <ExpandMore />}
//       </IconButton>

//       {listVisible && (
//         <List>
//           {attacks.map((attack) => (
//             <div key={attack._id}>
//               <ListItem>
//                 <Box sx={{ flexGrow: 1 }}>
//                   <Typography variant="body1">
//                     Date: {formatDate(attack.date)}
//                   </Typography>
//                   <Typography variant="body1">Type: {attack.type}</Typography>
//                   <Typography variant="body1">
//                     Intensity: {attack.intensity}
//                   </Typography>
//                   <Typography variant="body1">
//                     Duration: {attack.duration}
//                   </Typography>
//                   <Typography variant="body1">
//                     Medication: {attack.medication}
//                   </Typography>
//                   <Typography variant="body1">
//                     Invalidating: {attack.invalidating}
//                   </Typography>
//                   <Typography variant="body1">
//                     Menstruation: {attack.menstruation}
//                   </Typography>
//                   {/* Botón de eliminar */}
//                   <Button
//                     startIcon={<Delete />}
//                     onClick={() => handleDelete(attack._id!)} // Verificar que _id existe
//                     color="error"
//                   >
//                     Delete
//                   </Button>
//                 </Box>
//               </ListItem>
//               <Divider />
//             </div>
//           ))}
//         </List>
//       )}

//       {/* Snackbar para mostrar el mensaje "Attack deleted" */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleSnackbarClose} severity="success">
//           Attack deleted
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AttackList;

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
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { AttackListType } from "../../types/Attack";
import "./AttackList.scss";

const apiUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : "https://cefalyx-nereas-projects-2a045b48.vercel.app";

interface AttackListProps {
  attacks: AttackListType[];
  setAttacks: React.Dispatch<React.SetStateAction<AttackListType[]>>;
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
  const [filteredAttacks, setFilteredAttacks] = useState<AttackListType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [listVisible, setListVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchAttacks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/attacks`);
      const fetchedAttacks: AttackListType[] = Array.isArray(response.data)
        ? response.data
        : [];
      const sortedAttacks = fetchedAttacks.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
    if (attacks.length === 0) {
      console.error("No attacks available for download.");
      return; // Asegurarnos de que haya ataques para exportar
    }

    const doc = new jsPDF();
    let y = 10;
    const lineHeight = 10; // Altura de cada línea de texto
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    const marginBottom = 20; // Margen inferior

    doc.setFontSize(18);
    doc.text("Attack List", 10, y);
    y += 10;
    doc.setFontSize(12);

    attacks.forEach((attack, index) => {
      // Si estamos cerca del final de la página, agregar nueva página
      if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage(); // Añadir una nueva página si se excede la altura
        y = 10; // Resetear la posición en la nueva página
      }

      // Añadir los datos del ataque al PDF
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
        `Medication: ${attack.medication || "N/A"} - Invalidating: ${
          attack.invalidating
        }`,
        10,
        y
      );
      y += 6;
      doc.text(`Menstruation: ${attack.menstruation || "N/A"}`, 10, y);
      y += 10;

      // Dibujar una línea para separar los ataques
      if (index < attacks.length - 1) {
        doc.line(10, y, 200, y);
        y += 5;
      }
    });

    // Guardar el PDF
    doc.save("attack-list.pdf");
  };

  const handleDownloadExcel = () => {
    if (filteredAttacks.length === 0) {
      console.error("No attacks available for download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredAttacks.map((attack) => ({
        Date: formatDate(attack.date),
        Type: attack.type,
        Intensity: getIntensityLabel(attack.intensity),
        Duration: attack.duration ? `${attack.duration} hours` : "N/A",
        Medication:
          attack.medication === "yes"
            ? "Yes"
            : attack.medication === "no"
            ? "No"
            : "N/A",
        Invalidating:
          attack.invalidating === "yes"
            ? "Yes"
            : attack.invalidating === "no"
            ? "No"
            : "N/A",
        Menstruation:
          attack.menstruation === "yes"
            ? "Yes"
            : attack.menstruation === "no"
            ? "No"
            : "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attack List");
    XLSX.writeFile(workbook, "attack-list.xlsx");
  };

  const handleDelete = async (attackId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/attacks/${attackId}`);
      setAttacks((prev) => prev.filter((attack) => attack._id !== attackId));
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting attack:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="return-container">
      <Box className="return-box">
      <div className="header-container">
        <Typography variant="h6" className="attack-list-header">Attack List</Typography>
        <IconButton onClick={() => setListVisible(!listVisible)} >
          {listVisible ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        </div>

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
              <List>
                {filteredAttacks.map((attack) => (
                  <div key={attack._id}>
                    <ListItem>
                      <Box sx={{ flexGrow: 1 }}>
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
                          Medication: {attack.medication || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                          Invalidating: {attack.invalidating || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                          Menstruation: {attack.menstruation || "N/A"}
                        </Typography>
                        <Button
                          startIcon={<Delete />}
                          onClick={() => handleDelete(attack._id!)}
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
          </>
        )}

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
    </div>
  );
};

export default AttackList;
