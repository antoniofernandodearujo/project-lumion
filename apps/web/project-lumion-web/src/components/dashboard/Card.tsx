import React from 'react';
import { Paper, Box, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SavingsIcon from '@mui/icons-material/Savings';
import { green } from '@mui/material/colors';

interface CardProps {
  title: string;
  value: string;
  description: string;
  type: 'energy' | 'money' | 'savings';
}

const iconMap = {
  energy: <ElectricBoltIcon sx={{ fontSize: 40, color: green[500] }} />,
  money: <AttachMoneyIcon sx={{ fontSize: 40, color: green[500] }} />,
  savings: <SavingsIcon sx={{ fontSize: 40, color: green[500] }} />,
};

export default function Card({ title, value, description, type }: CardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        flex: 1,
        minWidth: 250,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>{iconMap[type]}</Box>
        <Tooltip title={description} arrow placement="top">
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div" fontWeight="bold" color={green[800]}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}