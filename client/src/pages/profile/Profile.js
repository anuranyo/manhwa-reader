import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Typography>
          Profile content will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;