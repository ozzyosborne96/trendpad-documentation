// import React, { useEffect, useState } from "react";
// import { getAdvancedSections } from "./ApiLaunchpadlisthandler";
// import {
//   Box,
//   CircularProgress,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";

// const AdvancedSection = () => {
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSections = async () => {
//       try {
//         const data = await getAdvancedSections({
//           limit: 20,
//           page: 1,
//           chain: "Ethereum",
//           hardcap: "1000",
//           Currency: "ETH",
//           Sale_type: "FairLaunch",
//         });
//         setSections(data?.data || []);
//       } catch (err) {
//         console.error("Failed to load data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSections();
//   }, []);

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );

//   return (
//     <Box p={2}>
//       <Typography variant="h5" mb={2}>
//         Advanced Pool Sections
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Token</TableCell>
//               <TableCell>Pool ID</TableCell>
//               <TableCell>Chain</TableCell>
//               <TableCell>Currency</TableCell>
//               <TableCell>Hardcap</TableCell>
//               <TableCell>Sale Type</TableCell>
//               <TableCell>Start Time</TableCell>
//               <TableCell>End Time</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sections.map((section) => (
//               <TableRow key={section._id}>
//                 <TableCell>{section.token}</TableCell>
//                 <TableCell>{section.pool_id}</TableCell>
//                 <TableCell>{section.chain_name}</TableCell>
//                 <TableCell>{section?.StepOne?.Currency || "-"}</TableCell>
//                 <TableCell>{section?.StepTwo?.Hard_cap || "-"}</TableCell>
//                 <TableCell>{section.Sale_type}</TableCell>
//                 <TableCell>
//                   {new Date(section?.StepTwo?.Start_time).toLocaleString()}
//                 </TableCell>
//                 <TableCell>
//                   {new Date(section?.StepTwo?.End_time).toLocaleString()}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AdvancedSection;
