import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
} from '@mui/material';
import {
  AddBox as NewShipmentIcon,
  LocalShipping as ShipmentIcon,
  Inventory as ContainerIcon,
  Description as DocumentIcon,
  Timeline as TrackingIcon,
  Assessment as ReportIcon,
  Dashboard as DashboardIcon,
  People as ClientsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ArrowForward,
  Public,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  // View mode state: "dashboard" or "reports"
  const [activeSection, setActiveSection] = useState<'dashboard' | 'reports'>('dashboard');

  // Mock data (replace with your API data later)
  const activeShipments = 5;
  const pendingDocuments = 3;
  const containers = 8;

  // Sample cost report cards for the report section
  const costReports = [
    { title: 'Total Costs', value: '$50,000', icon: <AssessmentIcon />, color: '#ff8a65' },
    { title: 'Monthly Cost', value: '$5,000', icon: <AssessmentIcon />, color: '#81c784' },
    { title: 'Annualized Cost', value: '$60,000', icon: <AssessmentIcon />, color: '#7986cb' },
  ];

  interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: ReactElement;
    action: () => void;
    color: string;
  }

  const DashboardCard = ({ title, value, icon, action, color }: DashboardCardProps) => (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        borderRadius: 2,
        boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton sx={{ backgroundColor: `${color}20`, color: color, mr: 2, p: 1.2 }}>
            {icon}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color }}>
          {value}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button size="small" onClick={action} sx={{ color: color }}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ background: '#0a1929', color: '#4dd0e1' }}>
        <Typography variant="h6" noWrap>
          CRM/ERP
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon /> },
          { text: 'Clients', icon: <ClientsIcon /> },
          { text: 'Reports', icon: <ReportIcon /> },
          { text: 'Settings', icon: <SettingsIcon /> },
        ].map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              if (item.text === 'Dashboard') {
                setActiveSection('dashboard');
              } else if (item.text === 'Reports') {
                setActiveSection('reports');
              }
              // For other sections, you might want to handle routing separately.
            }}
          >
            <ListItemIcon sx={{ color: '#4dd0e1' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: '#4dd0e1' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters sx={{ mt: 0, mb: 4 }}>
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden',
            background: 'white',
            minHeight: '80vh',
          }}
        >
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Sidebar */}
            <Box
              sx={{
                width: { xs: 0, md: drawerWidth },
                background: '#0a1929',
                color: '#4dd0e1',
                p: 2,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {drawer}
            </Box>

            {/* Main Application Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* AppBar/Header (contained within the card) */}
              <Box
                sx={{
                  background: '#0a1929',
                  color: '#4dd0e1',
                  p: 2,
                  borderBottom: '1px solid rgba(77, 208, 225, 0.2)',
                }}
              >
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Typography variant="h6" noWrap component="div">
                {session?.user?.name}
                </Typography>
              </Box>

              {/* Mobile Sidebar Drawer */}
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    background: '#0a1929',
                    color: '#4dd0e1',
                  },
                }}
              >
                {drawer}
              </Drawer>

              {/* Main Content Area with conditional rendering */}
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)',
                  flexGrow: 1,
                }}
              >
                {activeSection === 'dashboard' && (
                  <>
                    {/* KPI Cards at the Top */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard
                          title="Active Shipments"
                          value={activeShipments}
                          icon={<ShipmentIcon />}
                          action={() => router.push('/shipments')}
                          color="#4dd0e1"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard
                          title="Pending Documents"
                          value={pendingDocuments}
                          icon={<DocumentIcon />}
                          action={() => router.push('/documents')}
                          color="#81c784"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard
                          title="Containers"
                          value={containers}
                          icon={<ContainerIcon />}
                          action={() => router.push('/containers')}
                          color="#7986cb"
                        />
                      </Grid>
                    </Grid>

                    {/* Quick Actions */}
                    <Box sx={{ mb: 6 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<NewShipmentIcon />}
                            onClick={() => router.push('/shipments/new')}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            New Shipment
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<DocumentIcon />}
                            onClick={() => router.push('/documents/upload')}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #81c784 30%, #66bb6a 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            Upload Documents
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<TrackingIcon />}
                            onClick={() => router.push('/tracking')}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #7986cb 30%, #5c6bc0 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            Track Shipment
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ReportIcon />}
                            // Instead of navigating away, switch to the report section
                            onClick={() => setActiveSection('reports')}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #ff8a65 30%, #ff7043 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            Generate Report
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Recent Activity (if any) */}
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        p: 3,
                        border: '1px solid rgba(77, 208, 225, 0.2)',
                      }}
                    >
                      <Typography variant="h5" sx={{ color: '#90caf9', mb: 3 }}>
                        Recent Activity
                      </Typography>
                      <Grid container spacing={3}>
                        {/* Add your recent activity components here */}
                      </Grid>
                    </Box>
                  </>
                )}

                {activeSection === 'reports' && (
                  <Box>
                    <Typography variant="h5" sx={{ color: '#90caf9', mb: 3 }}>
                      Cost Reports
                    </Typography>
                    <Grid container spacing={3}>
                      {costReports.map((report) => (
                        <Grid item xs={12} sm={6} md={4} key={report.title}>
                          <DashboardCard
                            title={report.title}
                            value={report.value}
                            icon={report.icon}
                            // In the report section, the card's action may be defined as needed
                            action={() => {}}
                            color={report.color}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 