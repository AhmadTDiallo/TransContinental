import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useState, useEffect } from 'react';
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
  FormLabel,
  TextField,
  ListItemButton,
  Snackbar,
  Alert
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
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Timeline from '@mui/icons-material/Timeline';

const drawerWidth = 240;

// Styled Modal for theme consistency
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Styled Modal Content Box
const ModalContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#0a1929', // Dark background from theme
  color: '#4dd0e1',         // Teal text color from theme
  padding: theme.spacing(4),
  borderRadius: 8,
  width: '80%',
  maxWidth: 600,
  '& .MuiTextField-root, & .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root': {
      color: '#4dd0e1', // Teal label color
    },
    '& .MuiInputBase-input': {
      color: 'white',     // White input text color
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(77, 208, 225, 0.5)', // Teal border color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4dd0e1', // Brighter teal on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4dd0e1', // Brighter teal when focused
    },
  },
}));

// Define the type for shipmentData explicitly
type ShipmentFormData = {
  billOfLadingFiles: string[];
  packingListFile: string | null;
  commercialInvoiceFile: string | null;
  containers20ft: number;
  containers40ft: number;
};

// Updated Pending Shipment Item Props to include status
interface PendingShipmentItemProps extends ShipmentFormData {
  id: number;
  status: string; // e.g., 'Under Review', 'Approved', or 'Disapproved'
  onDelete: () => void;
  onEdit: () => void;
}

const PendingShipmentItem: React.FC<PendingShipmentItemProps> = ({
  id,
  billOfLadingFiles,
  packingListFile,
  commercialInvoiceFile,
  containers20ft,
  containers40ft,
  status,
  onDelete,
  onEdit,
}) => (
  <Card
    sx={{
      mb: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      p: 3,
      border: '1px solid rgba(77, 208, 225, 0.2)',
      color: 'white',
      position: 'relative',
    }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4dd0e1', mb: 1 }}>
      New Shipment Submission #{id}
    </Typography>
    <Typography variant="body2">
      Bill of Lading/CNCA Files: {billOfLadingFiles.length} file(s)
    </Typography>
    <Typography variant="body2">
      Packing List: {packingListFile ? 'Uploaded' : 'Not Uploaded'}
    </Typography>
    <Typography variant="body2">
      Commercial Invoice: {commercialInvoiceFile ? 'Uploaded' : 'Not Uploaded'}
    </Typography>
    <Typography variant="body2">
      20ft Containers: {containers20ft}
    </Typography>
    <Typography variant="body2">
      40ft Containers: {containers40ft}
    </Typography>
    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
      Status: {status || 'Under Review'}
    </Typography>
    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
      <IconButton aria-label="edit" size="small" sx={{ color: '#4dd0e1' }} onClick={onEdit}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" size="small" sx={{ color: '#ff7043' }} onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  </Card>
);

// Recent Activity Section Component - Redesigned
const RecentActivitySection: React.FC<{ shipments: PendingShipmentItemProps[] }> = ({ shipments }) => (
  <Box
    sx={{
      mb: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      p: 3,
      border: '1px solid rgba(77, 208, 225, 0.2)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Timeline sx={{ color: '#90caf9', mr: 1, fontSize: '2rem' }} />
      <Typography variant="h6" sx={{ color: '#90caf9' }}>
        Recent Activity
      </Typography>
    </Box>
    {shipments.length > 0 ? (
      shipments.map((shipment) => (
        <Box
          key={shipment.id}
          sx={{
            mb: 1.5,
            p: 2,
            borderRadius: 1,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4dd0e1',
              mr: 2,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
              New Shipment Submission #{shipment.id}
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey' }}>
              {`Containers: ${shipment.containers20ft}x20ft + ${shipment.containers40ft}x40ft, Docs: BL/CNCA (${shipment.billOfLadingFiles.length}), Packing List (${shipment.packingListFile ? 'Yes' : 'No'}), Invoice (${shipment.commercialInvoiceFile ? 'Yes' : 'No'}), Status: ${shipment.status || 'Under Review'}`}
            </Typography>
          </Box>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No recent activity.
      </Typography>
    )}
  </Box>
);

const DashboardCard = ({
  title,
  value,
  icon,
  action,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactElement;
  action: () => void;
  color: string;
}) => {
  return (
    <Card
      sx={{
        minWidth: { xs: '100%', sm: '280px', md: '300px' },
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
};

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  // View mode state: "dashboard" or "reports"
  const [activeSection, setActiveSection] = useState<'dashboard' | 'reports'>('dashboard');
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [editingShipmentId, setEditingShipmentId] = useState<number | null>(null);
  const [pendingShipments, setPendingShipments] = useState<PendingShipmentItemProps[]>([]);
  const [totalContainers, setTotalContainers] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shipmentSuccess, setShipmentSuccess] = useState<boolean>(false);
  const [usersCount, setUsersCount] = useState<number>(0);

  // Fetch only shipments for the logged-in client based on their email.
  const fetchPendingShipments = async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch(`/api/shipments?clientEmail=${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setPendingShipments(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch shipments", await res.text());
        }
      } catch (err) {
        console.error("Error fetching shipments", err);
      }
    }
  };

  // Call it when the session is available.
  useEffect(() => {
    fetchPendingShipments();
  }, [session]);

  // Recalculate total containers when pending shipments change.
  useEffect(() => {
    const initialTotalContainers = pendingShipments.reduce((sum, shipment) => {
      return sum + shipment.containers20ft + shipment.containers40ft;
    }, 0);
    setTotalContainers(initialTotalContainers);
  }, [pendingShipments]);

  // Update active shipments count to show only the client's submitted shipments.
  // (Assuming all shipments fetched for the client are considered "active.")
  const activeShipments = pendingShipments.length;

  // Sample cost report cards for the report section
  const costReports = [
    { title: 'Total Costs', value: '$50,000', icon: <AssessmentIcon />, color: '#ff8a65' },
    { title: 'Monthly Cost', value: '$5,000', icon: <AssessmentIcon />, color: '#81c784' },
    { title: 'Annualized Cost', value: '$60,000', icon: <AssessmentIcon />, color: '#7986cb' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenShipmentModal = () => {
    setIsShipmentModalOpen(true);
  };

  const handleCloseShipmentModal = () => {
    setIsShipmentModalOpen(false);
    setEditingShipmentId(null);
  };

  const handleNewShipmentSubmit = async (shipmentData: ShipmentFormData) => {
    const clientEmail = session?.user?.email;
    const res = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...shipmentData, clientEmail }),
    });
    if (res.ok) {
      const newShipment = await res.json();
      console.log('Shipment submitted:', newShipment);
      // Optionally refresh local shipment state or provide user feedback
    } else {
      console.error('Failed to submit shipment');
    }
  };

  const handleDeleteShipment = (id: number) => {
    const deletedShipment = pendingShipments.find(shipment => shipment.id === id);
    if (deletedShipment) {
      setTotalContainers(prevContainers => prevContainers - deletedShipment.containers20ft - deletedShipment.containers40ft);
    }
    setPendingShipments(pendingShipments.filter(shipment => shipment.id !== id));
  };

  const handleEditShipment = (id: number) => {
    setEditingShipmentId(id);
    handleOpenShipmentModal();
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleFileUploadSubmit = (files: FileList) => {
    console.log("Files to upload:", files);
    // TODO: Implement actual file upload logic here (e.g., using fetch or axios to send files to your backend)
    handleCloseUploadModal(); // Close modal after (simulated) upload
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
          { text: 'Tracking', icon: <LocalShippingIcon /> },
          { text: 'Reports', icon: <ReportIcon /> },
          { text: 'Settings', icon: <SettingsIcon /> },
        ].map((item) => (
          <ListItemButton component="li" key={item.text} onClick={() => {
            if (item.text === 'Dashboard') {
              setActiveSection('dashboard');
            } else if (item.text === 'Reports') {
              setActiveSection('reports');
            }
            // For other sections, you might want to handle routing separately.
          }}>
            <ListItemIcon sx={{ color: '#4dd0e1' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ color: '#4dd0e1' }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      const fetchUsersCount = async () => {
        try {
          const res = await fetch('/api/users');
          if (res.ok) {
            const data = await res.json();
            setUsersCount(data.count);
          } else {
            console.error('Error fetching users count', await res.text());
          }
        } catch (error) {
          console.error('Error fetching users count', error);
        }
      };
      fetchUsersCount();
      const interval = setInterval(fetchUsersCount, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <Box sx={{ backgroundColor: '#f4f4f4', height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden',
            background: 'white',
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
            {/* Sidebar */}
            <Box
              sx={{
                width: { xs: 0, md: drawerWidth },
                background: '#0a1929',
                color: '#4dd0e1',
                p: 2,
                display: { xs: 'none', md: 'block' },
                height: '100%',
                flexShrink: 0,
              }}
            >
              {drawer}
            </Box>

            {/* Main Application Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
              {/* AppBar/Header (contained within the card) */}
              <Box
                sx={{
                  background: '#0a1929',
                  color: '#4dd0e1',
                  p: 2,
                  borderBottom: '1px solid rgba(77, 208, 225, 0.2)',
                  flexShrink: 0,
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
                  {(session?.user as any)?.name || session?.user?.companyName}
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
                  overflowY: 'auto',
                  height: '100%',
                }}
              >
                {activeSection === 'dashboard' && (
                  <>
                    {/* KPI Cards at the Top */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                      <Grid item xs={12} sm={6} md={6} lg={4}>
                        <DashboardCard
                          title="Active Shipments"
                          value={activeShipments}
                          icon={<ShipmentIcon />}
                          action={() => router.push('/shipments')}
                          color="#4dd0e1"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={4}>
                        <DashboardCard
                          title="Containers"
                          value={totalContainers}
                          icon={<ContainerIcon />}
                          action={() => router.push('/containers')}
                          color="#7986cb"
                        />
                      </Grid>
                      {session?.user?.role === 'admin' && (
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                          <DashboardCard
                            title="New Clients"
                            value={usersCount}
                            icon={<ClientsIcon />}
                            action={() => router.push('/users')}
                            color="#81c784"
                          />
                        </Grid>
                      )}
                    </Grid>

                    {/* Quick Actions */}
                    <Box sx={{ mb: 6 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<NewShipmentIcon />}
                            onClick={handleOpenShipmentModal}
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
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<DocumentIcon />}
                            onClick={handleOpenUploadModal}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #7986cb 30%, #5c6bc0 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            Upload Documents
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ReportIcon />}
                            onClick={() => setActiveSection('reports')}
                            sx={{
                              p: 2,
                              background: 'linear-gradient(45deg, #ff8a65 30%, #ff7043 90%)',
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              '&:hover': { transform: 'translateY(-3px)' },
                            }}
                          >
                            Generate Proforma
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Pending Shipments Section */}
                    <Box
                      sx={{
                        mb: 6,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        p: 3,
                        border: '1px solid rgba(77, 208, 225, 0.2)',
                      }}
                    >
                      <Typography variant="h5" sx={{ color: '#90caf9', mb: 3 }}>
                        Pending Shipments
                      </Typography>
                      {pendingShipments.length > 0 ? (
                        pendingShipments.map((shipment) => (
                          <PendingShipmentItem
                            key={shipment.id}
                            {...shipment}
                            onDelete={() => handleDeleteShipment(shipment.id)}
                            onEdit={() => handleEditShipment(shipment.id)}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: 'grey' }}>
                          No pending shipments at the moment.
                        </Typography>
                      )}
                    </Box>

                    {/* Recent Activity Section - Redesigned */}
                    <RecentActivitySection shipments={pendingShipments} />
                  </>
                )}

                {activeSection === 'reports' && (
                  <Grid container spacing={3}>
                    {costReports.map((report, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <DashboardCard {...report} action={() => { /* TODO: Implement report detail view */ }} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* New Shipment Modal */}
      <StyledModal
        open={isShipmentModalOpen}
        onClose={handleCloseShipmentModal}
        aria-labelledby="new-shipment-modal"
        aria-describedby="new-shipment-form"
      >
        <ModalContentBox>
          <Typography id="new-shipment-modal" variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
            {editingShipmentId !== null ? 'Edit Shipment Details' : 'New Shipment Details'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel id="bill-of-lading-label" sx={{ color: '#4dd0e1' }}>Bill of Lading/CNCA (Multiple Files)</FormLabel>
              <input
                type="file"
                multiple
                id="bill-of-lading"
                style={{ display: 'block', width: '100%', padding: '8px', backgroundColor: '#1e293b', color: 'white', borderRadius: '4px', border: '1px solid rgba(77, 208, 225, 0.5)' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel id="packing-list-label" sx={{ color: '#4dd0e1' }}>Packing List</FormLabel>
              <input
                type="file"
                id="packing-list"
                style={{ display: 'block', width: '100%', padding: '8px', backgroundColor: '#1e293b', color: 'white', borderRadius: '4px', border: '1px solid rgba(77, 208, 225, 0.5)' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel id="commercial-invoice-label" sx={{ color: '#4dd0e1' }}>Commercial Invoice</FormLabel>
              <input
                type="file"
                id="commercial-invoice"
                style={{ display: 'block', width: '100%', padding: '8px', backgroundColor: '#1e293b', color: 'white', borderRadius: '4px', border: '1px solid rgba(77, 208, 225, 0.5)' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="20ft-containers"
                label="Number of 20ft Containers"
                type="number"
                defaultValue={
                  editingShipmentId !== null
                    ? pendingShipments.find(shipment => shipment.id === editingShipmentId)?.containers20ft || 0
                    : 0
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="40ft-containers"
                label="Number of 40ft Containers"
                type="number"
                defaultValue={
                  editingShipmentId !== null
                    ? pendingShipments.find(shipment => shipment.id === editingShipmentId)?.containers40ft || 0
                    : 0
                }
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleCloseShipmentModal} sx={{ mr: 2, color: '#4dd0e1', borderColor: '#4dd0e1' }} variant="outlined">
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)' }}
                onClick={async () => {
                  // Get file inputs
                  const billInput = document.getElementById('bill-of-lading') as HTMLInputElement;
                  const packingInput = document.getElementById('packing-list') as HTMLInputElement;
                  const invoiceInput = document.getElementById('commercial-invoice') as HTMLInputElement;
                  
                  const formData = new FormData();
                  if(billInput.files) {
                    for(let i = 0; i < billInput.files.length; i++){
                      formData.append('billOfLading', billInput.files[i]);
                    }
                  }
                  if(packingInput.files && packingInput.files[0]){
                    formData.append('packingList', packingInput.files[0]);
                  }
                  if(invoiceInput.files && invoiceInput.files[0]){
                    formData.append('commercialInvoice', invoiceInput.files[0]);
                  }
                  
                  const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  if(!uploadRes.ok) {
                    console.error("File upload failed");
                    return;
                  }
                  const fileUrls = await uploadRes.json();
                  
                  // Get container inputs
                  const containers20ftInput = document.getElementById('20ft-containers') as HTMLInputElement;
                  const containers40ftInput = document.getElementById('40ft-containers') as HTMLInputElement;
                  
                  const shipmentData = {
                    billOfLadingFiles: fileUrls.billOfLading || [],
                    packingListFile: fileUrls.packingList || null,
                    commercialInvoiceFile: fileUrls.commercialInvoice || null,
                    containers20ft: parseInt(containers20ftInput.value, 10) || 0,
                    containers40ft: parseInt(containers40ftInput.value, 10) || 0,
                    clientEmail: session?.user?.email,
                  };
                  
                  const shipmentRes = await fetch('/api/shipments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(shipmentData),
                  });
                  
                  if(shipmentRes.ok) {
                    const newShipment = await shipmentRes.json();
                    console.log("Shipment submitted:", newShipment);
                    setShipmentSuccess(true);
                    await fetchPendingShipments();
                    setIsShipmentModalOpen(false);
                  } else {
                    console.error("Shipment submission failed");
                  }
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </ModalContentBox>
      </StyledModal>

      {/* Upload Documents Modal */}
      <StyledModal
        open={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        aria-labelledby="upload-documents-modal-title"
        aria-describedby="upload-documents-modal-description"
      >
        <ModalContentBox>
          <Typography id="upload-documents-modal-title" variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center' }}>
            Upload Documents
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel id="documents-upload-label" sx={{ color: '#4dd0e1' }}>Select Documents to Upload (Multiple Files)</FormLabel>
              <input
                type="file"
                multiple
                id="documents-upload"
                style={{ display: 'block', width: '100%', padding: '8px', backgroundColor: '#1e293b', color: 'white', borderRadius: '4px', border: '1px solid rgba(77, 208, 225, 0.5)' }}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleCloseUploadModal} sx={{ mr: 2, color: '#4dd0e1', borderColor: '#4dd0e1' }} variant="outlined">
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ background: 'linear-gradient(45deg, #7986cb 30%, #5c6bc0 90%)' }}
                onClick={() => {
                  const filesInput = document.getElementById('documents-upload') as HTMLInputElement;
                  if (filesInput && filesInput.files) {
                    handleFileUploadSubmit(filesInput.files);
                  }
                }}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </ModalContentBox>
      </StyledModal>

      {/* Success Snackbar */}
      <Snackbar open={shipmentSuccess} autoHideDuration={3000} onClose={() => setShipmentSuccess(false)}>
        <Alert onClose={() => setShipmentSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Shipment submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;

// Export DashboardCard as a named export so it can be used in AdminDashboard.
export { DashboardCard };