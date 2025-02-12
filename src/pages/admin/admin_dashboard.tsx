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

  useEffect(() => {
    if (status === "unauthenticated" || session?.user.role !== 'admin') {
      router.push('/admin');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchShipmentsCount = () => {
      fetch("/api/shipments")
        .then((res) => res.json())
        .then((data) => setNewShipmentsCount(data.length))
        .catch((err) => console.error("Error fetching shipments", err));
    };
    fetchShipmentsCount();
    const intervalId = setInterval(fetchShipmentsCount, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
          .then((data) => setActivities(data))
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

  // Sidebar items (including the new Admin Users item)
  const sidebarItems = [
    { text: "Overview", icon: <DashboardIcon /> },
    { text: "Users", icon: <PeopleIcon /> },
    { text: "Reports", icon: <BarChartIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "Admin Users", icon: <AdminPanelSettingsIcon /> },
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
          onClick={() => setActiveSection(item.text.toLowerCase())}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "#112240" },
            backgroundColor: activeSection === item.text.toLowerCase() ? "#112240" : "inherit",
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

  // DashboardCard component (for overview KPIs)
  const DashboardCard = ({
    title,
    value,
    icon,
    action,
    color,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    action: () => void;
    color: string;
  }) => (
    <Card
      sx={{
        height: "100%",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 20px rgba(0,0,0,0.35)" },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton sx={{ backgroundColor: `${color}20`, color: color, mr: 2, p: 1.2 }} onClick={action}>
            {icon}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: color }}>
          {value}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button size="small" onClick={action} sx={{ color: color }}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  // Render main content based on navigation selection, including the new Admin Users view
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="New Shipments"
                  value={newShipmentsCount}
                  icon={<LocalShippingIcon />}
                  action={() => setActiveSection("shipments")}
                  color="#4dd0e1"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="New Files"
                  value={25}
                  icon={<DescriptionIcon />}
                  action={() => setActiveSection("files")}
                  color="#81c784"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DashboardCard
                  title="New Clients"
                  value={5}
                  icon={<PeopleIcon />}
                  action={() => setActiveSection("clients")}
                  color="#ff8a65"
                />
              </Grid>
            </Grid>
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
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Users Management
            </Typography>
            <Typography>Manage users, assignments, and profiles here.</Typography>
          </Box>
        );
      case "reports":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Reports & Analytics
            </Typography>
            <Typography>View performance, statistics, and reports here.</Typography>
          </Box>
        );
      case "settings":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#4dd0e1">
              Settings
            </Typography>
            <Typography>Configure system settings and preferences here.</Typography>
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
        return <Typography variant="h4" sx={{ color: "#4dd0e1" }}>{activeSection.toUpperCase()}</Typography>;
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
          <Tooltip title={(session?.user as any)?.name || session?.user?.companyName || "Admin"} arrow>
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