import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Container } from "@mui/material";
import HalloweenButton from "./base/HalloweenButton";
import RefreshIcon from "@mui/icons-material/Refresh";


export default function AdminVotes({ totalCandidates }) {

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [votes, setVotes] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)


  useEffect(() => {
    loadVotes()
  }, []);

  async function loadVotes() {
    try {
      const res = await (await fetch(backendUrl + "/results")).json()
      console.log("res", res);
      
      setVotes(res)
      setTotalVotes(res.reduce((acc, row) => acc + row.votes_count, 0))
      return
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <Container>
      <Box
        sx={{ color: '#571263', marginBottom: '10px', fontWeight: 'bold' }}
      >Votos hasta ahora: {totalVotes} / {totalCandidates * 2}</Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Disfraz</TableCell>
              <TableCell>Votos</TableCell>
              <TableCell>Comentarios</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.costume}</TableCell>
                <TableCell>{row.votes_count}</TableCell>
                <TableCell>
  {row.data && row.data.length > 0 ? (
    row.data.map((comment, i) => (
      <span key={i}>
        <b>{comment.user}</b>
        {comment.message ? `: ${comment.message}` : ""}
        {i < row.data.length - 1 ? <br /> : ""}
      </span>
    ))
  ) : (
    <span>No comments available</span> // Fallback for when `data` is not present
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <HalloweenButton
        variant="contained"
        onClick={loadVotes}
        sx={{ marginTop: '10px' }}
        endIcon={<RefreshIcon />}
      >
        Actualizar
      </HalloweenButton>
    </Container>
  );
}
