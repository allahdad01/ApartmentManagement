import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
  mobile?: boolean; // Show in mobile card view
  mobileLabel?: string; // Custom label for mobile
}

interface MobileTableProps {
  columns: Column[];
  rows: any[];
  onRowClick?: (row: any) => void;
  onMenuClick?: (event: React.MouseEvent<HTMLElement>, row: any) => void;
  keyField?: string;
  emptyMessage?: string;
}

const MobileTable: React.FC<MobileTableProps> = ({
  columns,
  rows,
  onRowClick,
  onMenuClick,
  keyField = 'id',
  emptyMessage = 'No data available'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  if (isMobile) {
    // Mobile card view
    return (
      <Stack spacing={2}>
        {rows.map((row) => (
          <Card
            key={row[keyField]}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:hover': onRowClick ? {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-1px)',
              } : {},
              transition: 'all 0.2s ease-in-out',
            }}
            onClick={() => onRowClick?.(row)}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {columns
                    .filter(col => col.mobile !== false)
                    .map((column) => {
                      const value = row[column.id];
                      const displayValue = column.format ? column.format(value) : value;
                      const label = column.mobileLabel || column.label;
                      
                      return (
                        <Box key={column.id} sx={{ mb: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', fontSize: '0.75rem' }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: column.id === 'name' || column.id === 'title' ? 600 : 400,
                              fontSize: '0.875rem',
                              wordBreak: 'break-word'
                            }}
                          >
                            {displayValue}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
                
                {onMenuClick && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuClick(e, row);
                    }}
                    sx={{ ml: 1, mt: -0.5 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Desktop table view
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.grey[50],
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {onMenuClick && (
              <TableCell
                align="center"
                sx={{
                  width: 48,
                  fontWeight: 600,
                  backgroundColor: theme.palette.grey[50],
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              hover
              key={row[keyField]}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => {
                const value = row[column.id];
                const displayValue = column.format ? column.format(value) : value;
                
                return (
                  <TableCell key={column.id} align={column.align}>
                    {displayValue}
                  </TableCell>
                );
              })}
              {onMenuClick && (
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuClick(e, row);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MobileTable;