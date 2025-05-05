import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
  Rating,
  Skeleton,
  Paper,
  Link
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { searchManhwas } from '../api/manhwaService';
import { getRecommendations } from '../api/recommendationService';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
  // Fetch popular manhwas
  const { data: popularData, isLoading: popularLoading } = useQuery(
    'popularManhwas',
    () => searchManhwas('', 10, 0, { order: { followedCount: 'desc' } }),
    { staleTime: 300000 } // 5 minutes
  );
  
  // Fetch latest updates
  const { data: latestData, isLoading: latestLoading } = useQuery(
    'latestManhwas',
    () => searchManhwas('', 10, 0, { order: { latestUploadedChapter: 'desc' } }),
    { staleTime: 60000 } // 1 minute
  );
  
  // Fetch recommendations if authenticated
  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery(
    'recommendations',
    getRecommendations,
    { 
      enabled: isAuthenticated,
      staleTime: 600000 // 10 minutes
    }
  );
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        sx={{
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          className="gradient-text"
          sx={{ fontWeight: 700 }}
        >
          {t('app.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('app.slogan')}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            component={RouterLink} 
            to="/browse" 
            variant="contained" 
            size="large" 
            color="primary"
            sx={{ mr: 2 }}
          >
            {t('nav.browse')}
          </Button>
          {!isAuthenticated && (
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="outlined" 
              size="large"
            >
              {t('auth.signUp')}
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Content Tabs */}
      <Paper elevation={0} sx={{ mb: 4, bgcolor: 'background.default' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t('manhwa.popular')} />
          <Tab label={t('manhwa.latest')} />
          {isAuthenticated && <Tab label={t('manhwa.recommended')} />}
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Popular Manhwas */}
        {activeTab === 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {popularLoading
                ? Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card>
                        <Skeleton variant="rectangular" height={320} />
                        <CardContent>
                          <Skeleton variant="text" />
                          <Skeleton variant="text" width="60%" />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : popularData?.manga?.map((manhwa) => (
                    <Grid item xs={12} sm={6} md={3} key={manhwa.id} component={motion.div} variants={itemVariants}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 8
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={manhwa.coverImage || '/placeholder-cover.jpg'}
                          alt={manhwa.title}
                          height={320}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {manhwa.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={manhwa.rating || 0} readOnly size="small" precision={0.5} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {manhwa.description || 'No description available.'}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={RouterLink}
                            to={`/manhwa/${manhwa.id}`}
                          >
                            {t('common.view')}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to="/browse"
              >
                {t('common.viewMore')}
              </Button>
            </Box>
          </motion.div>
        )}
        
        {/* Latest Updates */}
        {activeTab === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {latestLoading
                ? Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card>
                        <Skeleton variant="rectangular" height={320} />
                        <CardContent>
                          <Skeleton variant="text" />
                          <Skeleton variant="text" width="60%" />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : latestData?.manga?.map((manhwa) => (
                    <Grid item xs={12} sm={6} md={3} key={manhwa.id} component={motion.div} variants={itemVariants}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 8
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            image={manhwa.coverImage || '/placeholder-cover.jpg'}
                            alt={manhwa.title}
                            height={320}
                            sx={{ objectFit: 'cover' }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              bgcolor: 'secondary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                            }}
                          >
                            NEW
                          </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {manhwa.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {t('manhwa.status')}: {manhwa.status || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}>
                            {manhwa.description || 'No description available.'}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            component={RouterLink}
                            to={`/manhwa/${manhwa.id}`}
                          >
                            {t('common.view')}
                          </Button>
                          <Button 
                            size="small" 
                            component={RouterLink}
                            to={`/manhwa/${manhwa.id}`}
                            color="secondary"
                          >
                            {t('manhwa.readNow')}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                component={RouterLink}
                to="/browse"
              >
                {t('common.viewMore')}
              </Button>
            </Box>
          </motion.div>
        )}
        
        {/* Recommended Manhwas (Only for authenticated users) */}
        {activeTab === 2 && isAuthenticated && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {recommendationsLoading ? (
              <Grid container spacing={3}>
                {Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ display: 'flex', height: '200px' }}>
                      <Skeleton variant="rectangular" width={140} height={200} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <CardContent>
                          <Skeleton variant="text" height={40} />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" width="60%" />
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : recommendationsData?.recommendations?.length > 0 ? (
              <Grid container spacing={3}>
                {recommendationsData.recommendations.map((rec, index) => (
                  <Grid item xs={12} sm={6} key={index} component={motion.div} variants={itemVariants}>
                    <Card sx={{ display: 'flex', height: '100%' }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 140 }}
                        image={rec.coverImage || '/placeholder-cover.jpg'}
                        alt={rec.title}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                          <Typography component="div" variant="h6">
                            {rec.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary" component="div">
                            {rec.description}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            {rec.reason}
                          </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                          {rec.id ? (
                            <Button 
                              size="small" 
                              component={RouterLink}
                              to={`/manhwa/${rec.id}`}
                            >
                              {t('common.view')}
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              component={RouterLink}
                              to={`/search?q=${encodeURIComponent(rec.title)}`}
                            >
                              {t('common.search')}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1">
                  {t('library.noManhwas')}
                </Typography>
                <Button 
                  variant="contained" 
                  component={RouterLink}
                  to="/browse"
                  sx={{ mt: 2 }}
                >
                  {t('library.addSome')}
                </Button>
              </Box>
            )}
          </motion.div>
        )}
      </Box>
      
      {/* Featured Categories */}
      <Box sx={{ my: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ mb: 4, fontWeight: 600 }}
        >
          {t('categories.featured')}
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={2}>
          {['Action', 'Romance', 'Fantasy', 'Comedy', 'Drama', 'Slice of Life'].map((category) => (
            <Grid item xs={6} sm={4} md={2} key={category}>
              <Paper
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.card',
                }}
              >
                <Link 
                  component={RouterLink}
                  to={`/browse?genre=${category}`}
                  underline="none"
                  color="inherit"
                >
                  <Typography variant="h6" component="div">
                    {category}
                  </Typography>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;