import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

const CustomTable = ({ title, fetchData, columns }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await fetchData();
        console.log("result", result);

        // If result is an object, wrap it in an array
        const normalizedData = Array.isArray(result) ? result : [result];
        setData(normalizedData);
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [fetchData]);

  return (
    <TableContainer>
      <Typography variant="h6" sx={{ p: 2 }}>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress sx={{ m: 2 }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <strong>{col.label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key !== "buyBackAmount"
                      ? `${row[col.key]}${" "} ${"minutes"}`
                      : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default CustomTable;
