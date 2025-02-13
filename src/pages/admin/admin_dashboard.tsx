import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  TextField,
  Checkbox,
  Paper,
  Box as MuiBox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActionArea,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminActivityLog from '../../components/AdminActivityLog';
import AdminShipmentsOverview from '../../components/AdminShipmentsOverview';
import { DashboardCard } from '../../components/Dashboard_components';
import ReceiptIcon from '@mui/icons-material/Receipt';

const drawerWidth = 240;

interface Shipment {
  id: string;
  clientName: string;
  containers20ft: number;
  containers40ft: number;
  billOfLadingFiles: string[];
  packingListFile?: string | null;
  commercialInvoiceFile?: string | null;
  status: "UNDER_REVIEW" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [newShipmentsCount, setNewShipmentsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [shipmentPreview, setShipmentPreview] = useState<string>("");
  const [newClientsPreview, setNewClientsPreview] = useState<string>("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientDialogOpen, setClientDialogOpen] = useState<boolean>(false);
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [editClientEmail, setEditClientEmail] = useState<string>("");
  const [editClientName, setEditClientName] = useState<string>("");
  const [editClientCompanyName, setEditClientCompanyName] = useState<string>("");
  const [editClientRole, setEditClientRole] = useState<string>("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user.role !== 'admin') {
      router.push('/admin');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("/api/shipments");
        if (res.ok) {
          const data = await res.json();
          setNewShipmentsCount(data.length);
          if (data.length > 0) {
            setShipmentPreview(`New shipment from ${data[0].clientName}`);
          } else {
            setShipmentPreview("No recent shipments");
          }
        }
      } catch (err) {
        console.error("Error fetching shipments", err);
      }
    };
    fetchShipments();
    const intervalShipments = setInterval(fetchShipments, 5000);
    return () => clearInterval(intervalShipments);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsersCount(data.count);
          setNewClientsPreview(
            data.preview ? `Latest client: ${data.preview}` : "No recent clients"
          );
        } else {
          console.error("Error fetching users count", await res.text());
        }
      } catch (err) {
        console.error("Error fetching users count", err);
      }
    };
    fetchUsers();
    const intervalUsers = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalUsers);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/admin/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        } else {
          console.error("Error fetching clients", await res.text());
        }
      } catch (err) {
        console.error("Error fetching clients", err);
      }
    };
    if (activeSection === "users") {
      fetchClients();
    }
  }, [activeSection]);

  if (status === "loading" || !session) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/admin");
  };

  // Redesigned ManageAdminUsers component with delete/edit functionality
  const ManageAdminUsers = () => {
    const isSuperAdmin = (session?.user as { isSuperAdmin: boolean }).isSuperAdmin;
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [newName, setNewName] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newIsSuperAdmin, setNewIsSuperAdmin] = useState<boolean>(false);

    // Edit modal states
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [editName, setEditName] = useState<string>("");
    const [editEmail, setEditEmail] = useState<string>("");
    const [editPassword, setEditPassword] = useState<string>("");
    const [editIsSuperAdmin, setEditIsSuperAdmin] = useState<boolean>(false);

    useEffect(() => {
      fetchAdmins();
    }, []);

    const fetchAdmins = () => {
      setLoading(true);
      fetch("/api/admin-users")
        .then((res) => res.json())
        .then((data) => {
          setAdmins(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching admin users");
          setLoading(false);
        });
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          isSuperAdmin: newIsSuperAdmin,
        }),
      });
      if (res.ok) {
        const newAdmin = await res.json();
        setAdmins((prev) => [...prev, newAdmin]);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewIsSuperAdmin(false);
      } else {
        setError("Failed to create new admin user");
      }
    };

    const handleDeleteAdmin = async (adminId: string) => {
      const confirmDelete = confirm("Are you sure you want to delete this admin user?");
      if (!confirmDelete) return;
      const res = await fetch(`/api/admin-users?id=${adminId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
      } else {
        setError("Failed to delete admin user");
      }
    };

    const openEditModal = (admin: any) => {
      setSelectedAdmin(admin);
      setEditName(admin.name);
      setEditEmail(admin.email);
      setEditPassword("");
      setEditIsSuperAdmin(admin.isSuperAdmin);
      setEditModalOpen(true);
    };

    const closeEditModal = () => {
      setSelectedAdmin(null);
      setEditModalOpen(false);
    };

    const handleUpdateAdmin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedAdmin) return;
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAdmin.id,
          name: editName,
          email: editEmail,
          password: editPassword, // if empty the API will ignore and keep current password
          isSuperAdmin: editIsSuperAdmin,
        }),
      });
      if (res.ok) {
        const updatedAdmin = await res.json();
        setAdmins((prev) =>
          prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
        );
        closeEditModal();
      } else {
        setError("Failed to update admin user");
      }
    };

    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ color: "#4dd0e1", mb: 3 }}>
          Admin Users Management
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={4}>
          {/* Current Admin Users */}
          <Grid item xs={12} md={isSuperAdmin ? 6 : 12}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(77,208,225,0.2)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "#4dd0e1", mb: 2 }}>
                Current Admins
              </Typography>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : admins.length > 0 ? (
                <Grid container spacing={2}>
                  {admins.map((admin) => (
                    <Grid item xs={12} key={admin.id}>
                      <Paper
                        sx={{
                          p: 2,
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(77,208,225,0.2)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: "#4dd0e1", fontWeight: "bold" }}>
                            {admin.name || "Unnamed"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#4dd0e1" }}>
                            {admin.email}
                          </Typography>
                          <Typography variant="caption" sx={{ color: admin.isSuperAdmin ? "#81c784" : "#ff8a65" }}>
                            {admin.isSuperAdmin ? "Super Admin" : "Admin"}
                          </Typography>
                        </Box>
                        {isSuperAdmin && (
                          <Box>
                            <IconButton onClick={() => openEditModal(admin)} sx={{ color: "#4dd0e1" }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteAdmin(admin.id)} sx={{ color: "#4dd0e1" }}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ color: "grey" }}>No admin users available.</Typography>
              )}
            </Paper>
          </Grid>
          {/* Create New Admin (only visible if logged in user is a super admin) */}
          {isSuperAdmin && (
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(77,208,225,0.2)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "#4dd0e1", mb: 2 }}>
                  Create New Admin
                </Typography>
                <Box component="form" onSubmit={handleCreateAdmin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Name"
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    InputLabelProps={{ style: { color: "#4dd0e1" } }}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: "white" } }}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    InputLabelProps={{ style: { color: "#4dd0e1" } }}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: "white" } }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    size="small"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputLabelProps={{ style: { color: "#4dd0e1" } }}
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: "white" } }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ color: "#4dd0e1", mr: 1 }}>Super Admin:</Typography>
                    <Checkbox
                      checked={newIsSuperAdmin}
                      onChange={(e) => setNewIsSuperAdmin(e.target.checked)}
                      sx={{ color: "#4dd0e1" }}
                    />
                  </Box>
                  <Button type="submit" variant="contained" sx={{ background: "linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)" }}>
                    Create Admin
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
        {/* Edit Admin Modal */}
        <Dialog open={editModalOpen} onClose={closeEditModal}>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleUpdateAdmin} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Name"
                size="small"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: "#4dd0e1" } }}
                sx={{ input: { color: "black" } }}
              />
              <TextField
                label="Email"
                size="small"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: "#4dd0e1" } }}
                sx={{ input: { color: "black" } }}
              />
              <TextField
                label="Password"
                type="password"
                size="small"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                fullWidth
                InputLabelProps={{ style: { color: "#4dd0e1" } }}
                helperText="Leave blank to keep current password"
                sx={{ input: { color: "black" } }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1 }}>Super Admin:</Typography>
                <Checkbox
                  checked={editIsSuperAdmin}
                  onChange={(e) => setEditIsSuperAdmin(e.target.checked)}
                />
              </Box>
              <DialogActions>
                <Button onClick={closeEditModal}>Cancel</Button>
                <Button type="submit" variant="contained" sx={{ background: "linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)" }}>
                  Update
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    );
  };

  // Add this component near the top of your file (alongside ManageAdminUsers)
  const AdminActivityLog = () => {
    const [activities, setActivities] = useState<any[]>([]);
    
    useEffect(() => {
      const fetchActivities = () => {
        fetch("/api/admin-activities")
          .then((res) => res.json())
          .then((data) => {
            setActivities(Array.isArray(data) ? data : []);
          })
          .catch((err) => console.error("Failed to fetch admin activities", err));
      };
      fetchActivities();
      const intervalId = setInterval(fetchActivities, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    }, []);

    return (
      <Paper
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(77,208,225,0.2)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#4dd0e1", mb: 2 }}>
          Activity Log
        </Typography>
        {activities.length === 0 ? (
          <Typography sx={{ color: "grey" }}>No recent activity.</Typography>
        ) : (
          <Box sx={{ maxHeight: 300, overflow: "auto" }}>
            {activities.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  mb: 1,
                  borderBottom: "1px solid rgba(77,208,225,0.2)",
                  pb: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "#4dd0e1" }}>
                  {activity.message}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey" }}>
                  {new Date(activity.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    );
  };

  // Updated sidebarItems array
  const sidebarItems = [
    { text: "Overview", icon: <DashboardIcon /> },
    { text: "Clients", icon: <PeopleIcon /> },
    { text: "Admin Users", icon: <AdminPanelSettingsIcon /> },
    { text: "Reports", icon: <BarChartIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
  ];

  // Sidebar component using ListItemButton for clickable items
  const Sidebar = (
    <Box sx={{ backgroundColor: "#0a1929", height: "100%", color: "#4dd0e1" }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin CRM
        </Typography>
      </Toolbar>
      {sidebarItems.map((item) => (
        <Box
          key={item.text}
          onClick={() => {
            if (item.text.toLowerCase() === "clients") {
              setActiveSection("users");
            } else {
              setActiveSection(item.text.toLowerCase());
            }
          }}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "#112240" },
            backgroundColor: activeSection === (item.text.toLowerCase() === "clients" ? "users" : item.text.toLowerCase()) ? "#112240" : "inherit",
            p: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", pl: 2 }}>
            {item.icon}
            <Typography variant="body1" sx={{ ml: 2 }}>
              {item.text}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  // Updated renderContent function with three DashboardCards in the "overview" view
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <DashboardCard
                  title="New Shipments"
                  value={newShipmentsCount}
                  preview={shipmentPreview}
                  icon={<LocalShippingIcon fontSize="large" />}
                  action={() => setActiveSection("shipments")}
                  color="#4dd0e1"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DashboardCard
                  title="New Clients"
                  value={usersCount}
                  preview={newClientsPreview}
                  icon={<PeopleIcon fontSize="large" />}
                  action={() => setActiveSection("users")}
                  color="#ff8a65"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DashboardCard
                  title="Reports"
                  value={"Preview"}
                  preview={"View analytics"}
                  icon={<BarChartIcon fontSize="large" />}
                  action={() => setActiveSection("reports")}
                  color="#26c6da"
                />
              </Grid>
            </Grid>
            {/* New Buttons Section */}
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                onClick={() => router.push("/generate-proforma")}
                sx={{
                  minWidth: '350px',
                  background: "linear-gradient(45deg, #ff8a65 30%, #ff7043 90%)",
                  color: "white",
                  padding: "12px 24px",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Generate Performa
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push("/generate-final-invoice")}
                sx={{
                  minWidth: '350px',
                  background: "linear-gradient(45deg, #81c784 30%, #66bb6a 90%)",
                  color: "white",
                  padding: "12px 24px",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Generate Final Invoice
              </Button>
            </Box>
            <AdminActivityLog />
          </Box>
        );
      case "shipments":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ color: "#4dd0e1", mb: 3 }}>
              New Shipments
            </Typography>
            <AdminShipmentsOverview />
          </Box>
        );
      case "users":
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: "#0a1620" }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#4dd0e1", fontWeight: "bold", mb: 3 }}>
                Client Management
              </Typography>
              <Grid container spacing={3}>
                {clients.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ color: "#ffffff" }}>
                      No clients found.
                    </Typography>
                  </Grid>
                ) : (
                  clients.map((client) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          background: "linear-gradient(135deg, #1e293b 0%, #112240 100%)",
                          color: "#4dd0e1",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
                          },
                        }}
                        onClick={() => {
                          setSelectedClient(client);
                          setEditClientEmail(client.email);
                          setEditClientName(client.name || "");
                          setEditClientCompanyName(client.companyName || "");
                          setEditClientRole(client.role || "");
                          setEditClientMode(false);
                          setClientDialogOpen(true);
                        }}
                      >
                        <CardActionArea>
                          <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                              {client.companyName || client.name || client.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {client.email}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Paper>
            <Dialog
              open={clientDialogOpen}
              onClose={() => {
                setClientDialogOpen(false);
                setEditClientMode(false);
              }}
              fullWidth
              maxWidth="sm"
              PaperProps={{ sx: { backgroundColor: "#112240", color: "#4dd0e1" } }}
            >
              <DialogTitle sx={{ fontWeight: "bold" }}>
                {editClientMode ? "Edit Client" : "Client Details"}
              </DialogTitle>
              <DialogContent dividers>
                {selectedClient && (
                  <>
                    {editClientMode ? (
                      <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                          label="Email"
                          fullWidth
                          value={editClientEmail}
                          onChange={(e) => setEditClientEmail(e.target.value)}
                          sx={{ mb: 2 }}
                          InputLabelProps={{ style: { color: "#4dd0e1" } }}
                          inputProps={{ style: { color: "#4dd0e1" } }}
                        />
                        <TextField
                          label="Name"
                          fullWidth
                          value={editClientName}
                          onChange={(e) => setEditClientName(e.target.value)}
                          sx={{ mb: 2 }}
                          InputLabelProps={{ style: { color: "#4dd0e1" } }}
                          inputProps={{ style: { color: "#4dd0e1" } }}
                        />
                        <TextField
                          label="Company Name"
                          fullWidth
                          value={editClientCompanyName}
                          onChange={(e) => setEditClientCompanyName(e.target.value)}
                          sx={{ mb: 2 }}
                          InputLabelProps={{ style: { color: "#4dd0e1" } }}
                          inputProps={{ style: { color: "#4dd0e1" } }}
                        />
                        <TextField
                          label="Role"
                          fullWidth
                          value={editClientRole}
                          onChange={(e) => setEditClientRole(e.target.value)}
                          sx={{ mb: 2 }}
                          InputLabelProps={{ style: { color: "#4dd0e1" } }}
                          inputProps={{ style: { color: "#4dd0e1" } }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>ID:</Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedClient.id}
                        </Typography>
                        <Typography variant="subtitle1">Email:</Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedClient.email}
                        </Typography>
                        {selectedClient.name && (
                          <>
                            <Typography variant="subtitle1">Name:</Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedClient.name}
                            </Typography>
                          </>
                        )}
                        {selectedClient.companyName && (
                          <>
                            <Typography variant="subtitle1">Company Name:</Typography>
                            <Typography variant="body1" gutterBottom>
                              {selectedClient.companyName}
                            </Typography>
                          </>
                        )}
                        <Typography variant="subtitle1">Role:</Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedClient.role}
                        </Typography>
                        <Typography variant="subtitle1">Joined:</Typography>
                        <Typography variant="body1">
                          {new Date(selectedClient.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                {editClientMode ? (
                  <>
                    <Button onClick={() => setEditClientMode(false)} sx={{ color: "#4dd0e1" }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveClientChanges} variant="contained" sx={{ background: "linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)" }}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setClientDialogOpen(false)} sx={{ color: "#4dd0e1" }}>
                      Close
                    </Button>
                    <Button onClick={() => setEditClientMode(true)} variant="contained" sx={{ background: "linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)" }}>
                      Edit
                    </Button>
                    <Button onClick={() => setConfirmDeleteOpen(true)} variant="contained" sx={{ background: "linear-gradient(45deg, #ff1744 30%, #d50000 90%)" }}>
                      Delete
                    </Button>
                  </>
                )}
              </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog
              open={confirmDeleteOpen}
              onClose={() => setConfirmDeleteOpen(false)}
              fullWidth
              maxWidth="xs"
              PaperProps={{
                sx: { backgroundColor: "#112240", color: "#4dd0e1", textAlign: "center" },
              }}
            >
              <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to permanently delete this client?
                </Typography>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ color: "#4dd0e1" }}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteClient} variant="contained" sx={{ background: "linear-gradient(45deg, #ff1744 30%, #d50000 90%)" }}>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        );
      case "reports":
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
              elevation={6}
              sx={{ p: 4, borderRadius: 3, backgroundColor: "#0a1620" }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "#4dd0e1", fontWeight: "bold", mb: 3 }}
              >
                Reports & Analytics
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#ffffff", mb: 2 }}
              >
                View performance, statistics, and reports here.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, #112240 0%, #0a1620 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#4dd0e1" }}>
                      Sales Report
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Chart placeholder
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2,
                      background: "linear-gradient(135deg, #112240 0%, #0a1620 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#4dd0e1" }}>
                      User Growth
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Chart placeholder
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        );
      case "settings":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Settings
            </Typography>
            <Typography>
              Configure system settings and preferences here.
            </Typography>
          </Box>
        );
      case "admin users":
        return (
          <Box sx={{ p: 3 }}>
            <ManageAdminUsers />
            <AdminActivityLog />
          </Box>
        );
      default:
        return (
          <Typography variant="h4" sx={{ color: "#4dd0e1" }}>
            {activeSection.toUpperCase()}
          </Typography>
        );
    }
  };

  // Function to handle saving updated client details to the DB
  const handleSaveClientChanges = async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedClient.id,
          email: editClientEmail,
          name: editClientName,
          companyName: editClientCompanyName,
          role: editClientRole,
        }),
      });
      if (res.ok) {
        const updatedClient = await res.json();
        const updatedClients = clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        );
        setClients(updatedClients);
        setSelectedClient(updatedClient);
        setEditClientMode(false);
      } else {
        console.error("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedClient.id }),
      });
      if (res.ok) {
        // Remove deleted client from local state
        const updatedClients = clients.filter(
          (client) => client.id !== selectedClient.id
        );
        setClients(updatedClients);
        setClientDialogOpen(false);
        setConfirmDeleteOpen(false);
      } else {
        console.error("Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "#0a1929",
          color: "#4dd0e1",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Tooltip title={session?.user.name || session?.user.companyName || "Admin"} arrow>
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, background: "#0a1929", color: "#4dd0e1" },
          }}
        >
          {Sidebar}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, background: "#0a1929", color: "#4dd0e1" },
          }}
          open
        >
          {Sidebar}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          background: "#112240",
          minHeight: "100vh",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard; 