import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Categories = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Categories
        </Typography>
        <Typography>
          Categories content will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Categories;