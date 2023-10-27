import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function DataTable() {
  return (
    <div className="table">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Col1</TableCell>
              <TableCell>Col2</TableCell>
              <TableCell>Col3</TableCell>
              <TableCell>Col4</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Data1</TableCell>
              <TableCell>Data2</TableCell>
              <TableCell>Data3</TableCell>
              <TableCell>Data4</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DataTable;
