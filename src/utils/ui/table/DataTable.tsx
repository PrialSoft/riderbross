'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './DataTable.module.css';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <Box className={className}>
      {searchable && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </Box>
      )}

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: { xs: '400px', md: '600px' },
          overflowX: 'auto',
          borderRadius: '12px',
        }}
        className={styles.tableContainer}
      >
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      backgroundColor: 'var(--bg-secondary)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'var(--accent)',
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Mostrando {table.getState().pagination.pageIndex * pageSize + 1} -{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          de {table.getFilteredRowModel().rows.length} resultados
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            size="small"
            aria-label="Primera página"
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            size="small"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="body2" sx={{ minWidth: '60px', textAlign: 'center' }}>
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </Typography>
          <IconButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            size="small"
            aria-label="Página siguiente"
          >
            <ChevronRightIcon />
          </IconButton>
          <IconButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            size="small"
            aria-label="Última página"
          >
            <LastPageIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

