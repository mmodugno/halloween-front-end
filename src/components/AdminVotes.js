import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter } from "@mui/material";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";


const apiURL = "http://localhost:8080/api/"

export default function AdminVotes() {
  
const [votes, setVotes] = useState([
  { costume: 'calabacin 🎃', name: 'maga', votes_count: 4, data:[
    {user: 'guchi', message: 'se parece a longlegs'},
    {user: 'tute', message: 'aguante river no me importa nada'},
  ] },
  { costume: 'panda 🐼', name: 'guchi', votes_count: 2, data:[{user: 'ma', message: 'asqueroso la verdad'}] },
  { costume: 'videla', name: 'pa', votes_count: 1, data:[{user: 'maga', message: 'buen falcon 🚗'}] },
])


useEffect(() => {
  loadVotes()
}, []);

async function loadVotes() {
  try {
      const res = await (await fetch(apiURL + "results")).json()
      setVotes(res)
      return
  }
  catch (e) {
      console.log(e);
  }
  }
  
  return (
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
                {row.data.map((comment, i) => {
                  return (
                    <span>
                      <b>{comment.user}</b>
                      {comment.message ? `: ${comment.message}` : ""}
                      {i < row.data.length ? <br /> : ""}
                    </span>
                  );
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Button
              variant="contained"
              onClick={loadVotes}
              endIcon={<RefreshIcon />}
            >
              Actualizar
            </Button>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
