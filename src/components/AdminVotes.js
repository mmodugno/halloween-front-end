import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const mockVotes = [
  { costume: 'calabacin 🎃', name: 'maga', votes_count: 4, data:[
    {user: 'guchi', message: 'se parece a longlegs'}, 
    {user: 'tute', message: 'aguante river no me importa nada'},
  ] },
  { costume: 'panda 🐼', name: 'guchi', votes_count: 2, data:[{user: 'ma', message: 'asqueroso la verdad'}] },
  { costume: 'videla', name: 'pa', votes_count: 1, data:[{user: 'maga', message: 'buen falcon 🚗'}] },
]

export default function AdminVotes() {
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
          {mockVotes.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.costume}</TableCell>
              <TableCell>{row.votes_count}</TableCell>
              <TableCell>{row.data.map((comment, i) => {
                return (
                <span>
                  <b>{comment.user}</b>
                  {comment.message ? `: ${comment.message}` : ''}
                  {i < row.data.length ? <br/> : ''}
                </span>
              )}
            )}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
