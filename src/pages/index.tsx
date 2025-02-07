import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  useTheme,
  TextField,
} from '@mui/material';
import { LocalShipping, Warehouse, DirectionsBoat, Public, LocationOn, ArrowForward, Phone, Email, Send } from '@mui/icons-material';
import { useRouter } from 'next/router'
import Image from 'next/image';
import Link from 'next/link';

const fadeIn = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
};

const Home = () => {
  const router = useRouter()
  const theme = useTheme();

  const services = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#4dd0e1' }} />,
      title: 'Road Freight',
      description: 'Reliable overland transportation with real-time tracking'
    },
    {
      icon: <DirectionsBoat sx={{ fontSize: 40, color: '#4dd0e1' }} />,
      title: 'Maritime Shipping',
      description: 'Global container shipping and port management'
    },
    {
      icon: <Warehouse sx={{ fontSize: 40, color: '#4dd0e1' }} />,
      title: 'Warehousing',
      description: 'Smart storage solutions with inventory management'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.pathname, { locale: lng })
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Language Switcher */}
      <Box sx={{ 
        position: 'fixed', 
        top: 20, 
        right: 20, 
        zIndex: 1000,
        display: 'flex',
        gap: 1
      }}>
        {['en', 'fr', 'pt'].map((lang) => (
          <Button
            key={lang}
            onClick={() => changeLanguage(lang)}
            variant={router.locale === lang ? 'contained' : 'outlined'}
            sx={{
              minWidth: '40px',
              px: 1,
              backgroundColor: router.locale === lang ? 'primary.main' : 'transparent',
              borderColor: 'primary.main',
            }}
          >
            {lang.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Hero Section */}
      <Box 
        id="hero"
        sx={{ 
          minHeight: '100vh',
          backgroundImage: 'linear-gradient(rgba(10, 25, 41, 0.9), rgba(10, 25, 41, 0.9)), url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
          pt: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 0%, rgba(77, 208, 225, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover::before': {
            opacity: 1,
          },
          ...fadeIn,
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box textAlign="left" sx={{ maxWidth: '800px' }}>
            <Typography 
              variant="h1" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontSize: '4.5rem',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                opacity: 0,
                transform: 'translateY(30px)',
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: '0.2s',
                [theme.breakpoints.down('md')]: {
                  fontSize: '3rem',
                }
              }}
            >
              {('Trans-Continental')}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 6, 
                color: 'text.secondary',
                lineHeight: 1.3,
                maxWidth: '600px',
                fontWeight: 300,
                opacity: 0,
                transform: 'translateY(30px)',
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: '0.4s',
              }}
            >
              {('Automated Supply Chain Solutions powered by AI')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'flex-start',
              '& > *': {
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeIn 0.6s ease-out forwards',
              },
              '& > *:nth-of-type(1)': { animationDelay: '0.6s' },
              '& > *:nth-of-type(2)': { animationDelay: '0.8s' },
            }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => scrollToSection('services')}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                {('Get Quote')}
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderWidth: '3px',
                  borderRadius: '50px',
                  borderColor: 'white',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: '3px',
                    transform: 'translateY(-3px)',
                  }
                }}
              >
                {('Track Shipment')}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Our History Section */}
      <Box 
        id="our-history"
        sx={{ 
          py: { xs: 8, md: 12 },
          backgroundColor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, rgba(10, 25, 41, 0.95) 0%, rgba(15, 40, 70, 0.9) 100%),
              url(/luandanight.jpg)
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(30%)',
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Column – Image */}
            <Grid item xs={12} md={6}>
              <Box sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
                },
              }}>
                <Image
                  src="/TranscontinentalLOGO.png"
                  alt="Trans-Continental Office"
                  width={600}
                  height={400}
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease-out',
                  }}
                />
              </Box>
            </Grid>
            
            {/* Right Column – Text & Stats */}
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                <Public sx={{ 
                  fontSize: 48, 
                  verticalAlign: 'middle', 
                  mr: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }} />
                25+ Years Shaping Global Logistics
              </Typography>
              
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                p: 4,
                mb: 4,
                border: '1px solid rgba(77, 208, 225, 0.2)',
              }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: '#4dd0e1', fontWeight: 700, mb: 1 }}>
                        99.7%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        On-Time Delivery
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: '#4dd0e1', fontWeight: 700, mb: 1 }}>
                        70+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Countries Served
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'text.primary',
                  mb: 3,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                Trans-Continental Transitário Importação e Exportação Limitada
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 300,
                }}
              >
                Founded in 1995, Trans-Continental LDA has established itself as Angola&apos;s premier logistics solutions provider. With nearly three decades of excellence, we deliver seamless logistics, customs clearance, and freight forwarding services across Angola and beyond.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward sx={{ ml: 1 }} />}
                component={Link}
                href="/about"
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  fontWeight: 600,
                  transition: 'all 0.3s ease-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)',
                  },
                }}
              >
                Explore Our Story
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box 
        id="services" 
        sx={{ 
          py: 10, 
          backgroundColor: 'background.paper',
          clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(10, 25, 41, 0.9) 0%, rgba(15, 40, 70, 0.8) 100%)',
            zIndex: 1,
          },
          ...fadeIn,
          animation: 'fadeIn 0.8s ease-out',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ 
            mb: 8,
            color: '#4dd0e1',
            fontWeight: 600,
            opacity: 0,
            transform: 'translateY(30px)',
            animation: 'fadeIn 0.6s ease-out forwards',
            animationDelay: '0.2s',
          }}>
            {('Our Services')}
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={service.title}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(77, 208, 225, 0.2)',
                  opacity: 0,
                  transform: 'translateY(30px)',
                  animation: 'fadeIn 0.6s ease-out forwards',
                  animationDelay: `${0.4 + index * 0.2}s`,
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(77, 208, 225, 0.2)'
                  }
                }}>
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(77, 208, 225, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: '#4dd0e1'
                    }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box 
        id="about" 
        sx={{ 
          py: 10,
          backgroundColor: 'background.default',
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0 95%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, rgba(10, 25, 41, 0.95) 0%, rgba(15, 40, 70, 0.9) 100%),
              url(/luandanight.jpg)
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(30%)',
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" sx={{ position: 'relative' }}>
            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
              <Box sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)'
                }
              }}>
                <Box
                  component="img"
                  src="/luandanight.jpg"
                  alt="About Us"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.4s ease-out',
                    '&:hover': {
                      transform: 'scale(1.03)'
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em'
                }}
              >
                <Public sx={{ 
                  fontSize: 48, 
                  verticalAlign: 'middle', 
                  mr: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }} />
                25+ Years Shaping Global Logistics
              </Typography>

              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                borderRadius: 3,
                p: 4,
                mb: 4,
                border: '1px solid rgba(77, 208, 225, 0.2)'
              }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: '#4dd0e1', fontWeight: 700, mb: 1 }}>
                        99.7%
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        On-Time Delivery
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: '#4dd0e1', fontWeight: 700, mb: 1 }}>
                        70+
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Countries Served
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.primary',
                  mb: 4,
                  fontWeight: 300
                }}
              >
                As pioneers in automated supply chain solutions, we have redefined global logistics through:
              </Typography>

              <Box component="ul" sx={{ 
                pl: 0, 
                mb: 4,
                '& li': {
                  listStyle: 'none',
                  mb: 2,
                  pl: 3,
                  position: 'relative',
                  '&::before': {
                    content: '"▹"',
                    position: 'absolute',
                    left: 0,
                    color: '#4dd0e1'
                  }
                }
              }}>
                <li>Machine learning-powered route optimization</li>
                <li>Automated invoicing and process automation</li>
                <li>IoT-connected fleet management systems</li>
                <li>Up-to date supply chain visibility</li>
              </Box>

              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward sx={{ ml: 1 }} />}
                href="/about"
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                  }
                }}
              >
                Explore Our Innovations
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box 
        id="contact" 
        sx={{ 
          py: 10,
          backgroundColor: 'background.paper',
          clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 95%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(10, 25, 41, 0.95) 0%, rgba(15, 40, 70, 0.9) 100%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6}>
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(77, 208, 225, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    mb: 4,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Get in Touch
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationOn sx={{ color: '#4dd0e1', fontSize: 32, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        Global Headquarters
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        456 Maritime Plaza<br/>
                        Suite 2800<br/>
                        Luanda, Angola 018989
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Phone sx={{ color: '#4dd0e1', fontSize: 32, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        24/7 Support
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        +244 6123 4567 (International)<br/>
                        1-800-TRANSCON (872-6726)
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ color: '#4dd0e1', fontSize: 32, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        General Inquiries
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        info@transcontinentallog.com<br/>
                        support@transcontinental.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                    Operational Hours
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Monday - Friday: 06:00 to 18:00 GMT+1<br/>
                    Saturday - Sunday: Emergency Support Only
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Box 
                component="form" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 4,
                  p: 4,
                  border: '1px solid rgba(77, 208, 225, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    mb: 4,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Send a Message
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      InputLabelProps={{ style: { color: '#90caf9' } }}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                          '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                          '&:hover fieldset': { borderColor: '#4dd0e1' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      InputLabelProps={{ style: { color: '#90caf9' } }}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                          '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                          '&:hover fieldset': { borderColor: '#4dd0e1' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      InputLabelProps={{ style: { color: '#90caf9' } }}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                          '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                          '&:hover fieldset': { borderColor: '#4dd0e1' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={4}
                      variant="outlined"
                      InputLabelProps={{ style: { color: '#90caf9' } }}
                      InputProps={{
                        sx: {
                          color: 'text.primary',
                          '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                          '&:hover fieldset': { borderColor: '#4dd0e1' }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<Send sx={{ ml: 1 }} />}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                        }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;