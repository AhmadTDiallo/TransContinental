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
  billOfLadingCount: number;
  packingList: boolean;
  commercialInvoice: boolean;
  containers20ft: number;
  containers40ft: number;
};

// Pending Shipment Item Component
interface PendingShipmentItemProps extends ShipmentFormData {
  id: number;
  onDelete: () => void;
  onEdit: () => void;
}

const PendingShipmentItem: React.FC<PendingShipmentItemProps> = ({
  id,
  billOfLadingCount,
  packingList,
  commercialInvoice,
  containers20ft,
  containers40ft,
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
      New Shipment Submission
    </Typography>
    <Typography variant="body2">
      Bill of Lading/CNCA Files: {billOfLadingCount} file(s)
    </Typography>
    <Typography variant="body2">
      Packing List: {packingList ? 'Uploaded' : 'Not Uploaded'}
    </Typography>
    <Typography variant="body2">
      Commercial Invoice: {commercialInvoice ? 'Uploaded' : 'Not Uploaded'}
    </Typography>
    <Typography variant="body2">
      20ft Containers: {containers20ft}
    </Typography>
    <Typography variant="body2">
      40ft Containers: {containers40ft}
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
      shipments.map((shipment, index) => (
        <Box
          key={index}
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
              {`Containers: ${shipment.containers20ft}x20ft + ${shipment.containers40ft}x40ft, Documents: BL/CNCA (${shipment.billOfLadingCount}), Packing List (${shipment.packingList ? 'Yes' : 'No'}), Invoice (${shipment.commercialInvoice ? 'Yes' : 'No'})`}
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

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  // View mode state: "dashboard" or "reports"
  const [activeSection, setActiveSection] = useState<'dashboard' | 'reports'>('dashboard');
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [editingShipmentId, setEditingShipmentId] = useState<number | null>(null);
  const [pendingShipments, setPendingShipments] = useState<PendingShipmentItemProps[]>([
    { id: 1, billOfLadingCount: 2, packingList: true, commercialInvoice: true, containers20ft: 1, containers40ft: 0, onDelete: () => {}, onEdit: () => {} },
    { id: 2, billOfLadingCount: 1, packingList: false, commercialInvoice: true, containers20ft: 0, containers40ft: 2, onDelete: () => {}, onEdit: () => {} },
  ]);

  const [totalContainers, setTotalContainers] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Mock data (replace with your API data later)
  const activeShipments = 5;
  const pendingDocuments = 3;

  useEffect(() => {
    // Calculate initial total containers from pendingShipments on component mount
    const initialTotalContainers = pendingShipments.reduce((sum, shipment) => {
      return sum + shipment.containers20ft + shipment.containers40ft;
    }, 0);
    setTotalContainers(initialTotalContainers);
  }, [pendingShipments]); // Recalculate if pendingShipments changes

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

  const DashboardCard = ({ title, value, icon, action, color }: DashboardCardProps) => {
    console.log(`DashboardCard - Title: ${title}, Value: ${value}`); // Log in DashboardCard
    return (
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
  };

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

  const handleNewShipmentSubmit = (shipmentData: ShipmentFormData) => {
    console.log("Shipment Data in submit:", shipmentData); // Log shipmentData in submit
    console.log("Previous Total Containers:", totalContainers); // Log previous totalContainers
    if (editingShipmentId !== null) {
      setPendingShipments(pendingShipments.map(shipment =>
        shipment.id === editingShipmentId
          ? { ...shipment, ...shipmentData } as PendingShipmentItemProps
          : shipment
      ));
    } else {
      const newShipment: PendingShipmentItemProps = {
        id: Date.now(),
        ...shipmentData,
        onDelete: () => {},
        onEdit: () => {},
      };
      setPendingShipments([...pendingShipments, newShipment]);
      setTotalContainers(prevContainers => prevContainers + shipmentData.containers20ft + shipmentData.containers40ft);
    }
    handleCloseShipmentModal();
    console.log("New Total Containers after submit:", totalContainers); // Log totalContainers after submit
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
                          title="Pending Documents"
                          value={pendingDocuments}
                          icon={<DocumentIcon />}
                          action={() => router.push('/documents')}
                          color="#81c784"
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
                        pendingShipments.map((shipment, index) => (
                          <PendingShipmentItem
                            key={index}
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
                onClick={() => {
                  // Collect data from the modal form
                  const billOfLadingFiles = document.getElementById('bill-of-lading') as HTMLInputElement;
                  const packingListFile = document.getElementById('packing-list') as HTMLInputElement;
                  const commercialInvoiceFile = document.getElementById('commercial-invoice') as HTMLInputElement;
                  const containers20ftInput = document.getElementById('20ft-containers') as HTMLInputElement;
                  const containers40ftInput = document.getElementById('40ft-containers') as HTMLInputElement;

                  const shipmentData: ShipmentFormData = {
                    billOfLadingCount: billOfLadingFiles.files ? billOfLadingFiles.files.length : 0,
                    packingList: !!(packingListFile.files && packingListFile.files.length > 0),
                    commercialInvoice: !!(commercialInvoiceFile.files && commercialInvoiceFile.files.length > 0),
                    containers20ft: parseInt(containers20ftInput.value, 10) || 0,
                    containers40ft: parseInt(containers40ftInput.value, 10) || 0,
                  };
                  console.log("Shipment Data in submit:", shipmentData);
                  console.log("Previous Total Containers:", totalContainers);
                  handleNewShipmentSubmit(shipmentData);
                  console.log("New Total Containers after submit:", totalContainers);
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
    </Box>
  );
};

export default Dashboard;