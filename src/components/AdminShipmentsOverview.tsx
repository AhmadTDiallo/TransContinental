import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export interface Shipment {
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

const AdminShipmentsOverview = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const fetchShipments = async () => {
    try {
      const res = await fetch("/api/shipments");
      const data = await res.json();
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments", error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const deleteShipment = async (shipmentId: string) => {
    try {
      const res = await fetch(`/api/shipments/${shipmentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchShipments();
      } else {
        console.error("Failed to delete shipment.");
      }
    } catch (error) {
      console.error("Error deleting shipment", error);
    }
  };

  const updateShipmentStatus = async (
    shipmentId: string,
    status: "ACCEPTED" | "DECLINED"
  ) => {
    try {
      const res = await fetch(`/api/shipments/${shipmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchShipments();
      } else {
        console.error("Failed to update shipment status.");
      }
    } catch (error) {
      console.error("Error updating shipment", error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#4dd0e1" }}>
        New Shipments
      </Typography>
      {shipments.length === 0 ? (
        <Typography>No new shipments under review.</Typography>
      ) : (
        shipments.map((shipment) => (
          <Accordion
            key={shipment.id}
            sx={{
              mb: 2,
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#4dd0e1" }} />}
              id={`shipment-${shipment.id}`}
              sx={{ padding: 2 }}
            >
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ color: "#4dd0e1" }}>
                  {shipment.clientName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Submitted: {new Date(shipment.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "#ffffff" }}>
                  Status: {shipment.status}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 2, pb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Containers (20ft):</strong> {shipment.containers20ft}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Containers (40ft):</strong> {shipment.containers40ft}
                  </Typography>
                </Grid>
              </Grid>
              {(shipment.billOfLadingFiles.length > 0 ||
                shipment.packingListFile ||
                shipment.commercialInvoiceFile) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                    Attached Files:
                  </Typography>
                  <Grid container spacing={1}>
                    {shipment.billOfLadingFiles.map((fileUrl, idx) => (
                      <Grid item key={idx}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          component="a"
                          href={fileUrl}
                          target="_blank"
                        >
                          DL {idx + 1}
                        </Button>
                      </Grid>
                    ))}
                    {shipment.packingListFile && (
                      <Grid item>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          component="a"
                          href={shipment.packingListFile}
                          target="_blank"
                        >
                          Packing List
                        </Button>
                      </Grid>
                    )}
                    {shipment.commercialInvoiceFile && (
                      <Grid item>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          component="a"
                          href={shipment.commercialInvoiceFile}
                          target="_blank"
                        >
                          Commercial Invoice
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => deleteShipment(shipment.id)}
                >
                  Delete
                </Button>
                {shipment.status === "UNDER_REVIEW" && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => updateShipmentStatus(shipment.id, "ACCEPTED")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<CloseIcon />}
                      onClick={() => updateShipmentStatus(shipment.id, "DECLINED")}
                    >
                      Disapprove
                    </Button>
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

const NewShipmentForm = () => {
  const [clientName, setClientName] = useState("");
  const [containers20ft, setContainers20ft] = useState<number>(0);
  const [containers40ft, setContainers40ft] = useState<number>(0);
  const [billFiles, setBillFiles] = useState<FileList | null>(null);
  const [packingFile, setPackingFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBillFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillFiles(e.target.files);
  };

  const handlePackingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPackingFile(e.target.files[0]);
    }
  };

  const handleInvoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload files
      const formData = new FormData();
      if (billFiles) {
        for (let i = 0; i < billFiles.length; i++) {
          formData.append("billOfLading", billFiles[i]);
        }
      }
      if (packingFile) {
        formData.append("packingList", packingFile);
      }
      if (invoiceFile) {
        formData.append("commercialInvoice", invoiceFile);
      }

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("File upload failed");
      const fileUrls = await uploadRes.json();

      // Submit shipment data
      const shipmentData = {
        clientName,
        containers20ft,
        containers40ft,
        billOfLadingFiles: fileUrls.billOfLading || [],
        packingListFile: fileUrls.packingList || null,
        commercialInvoiceFile: fileUrls.commercialInvoice || null,
        status: "UNDER_REVIEW",
      };

      const shipmentRes = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipmentData),
      });
      if (!shipmentRes.ok) throw new Error("Shipment submission failed");

      // Reset form and show success
      setClientName("");
      setContainers20ft(0);
      setContainers40ft(0);
      setBillFiles(null);
      setPackingFile(null);
      setInvoiceFile(null);
      setSuccessOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 2,
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        }}
      >
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "#fff" }}>
            New Shipment Submission
          </Typography>
          <Typography variant="body2" sx={{ color: "#cfd8dc" }}>
            Fill in the details to submit your shipment
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "#fff",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Client Name"
                variant="outlined"
                fullWidth
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Containers (20ft)"
                variant="outlined"
                type="number"
                fullWidth
                value={containers20ft}
                onChange={(e) =>
                  setContainers20ft(Number(e.target.value))
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Containers (40ft)"
                variant="outlined"
                type="number"
                fullWidth
                value={containers40ft}
                onChange={(e) =>
                  setContainers40ft(Number(e.target.value))
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#4dd0e1" }}
              >
                {billFiles
                  ? `Selected ${billFiles.length} Bill of Lading File(s)`
                  : "Upload Bill of Lading Files"}
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleBillFilesChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#26c6da" }}
              >
                {packingFile
                  ? `Packing List Selected: ${packingFile.name}`
                  : "Upload Packing List"}
                <input
                  type="file"
                  hidden
                  onChange={handlePackingFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2, backgroundColor: "#81c784" }}
              >
                {invoiceFile
                  ? `Commercial Invoice Selected: ${invoiceFile.name}`
                  : "Upload Commercial Invoice"}
                <input
                  type="file"
                  hidden
                  onChange={handleInvoiceFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  background: "linear-gradient(45deg, #4dd0e1, #26c6da)",
                }}
              >
                {loading ? "Submitting..." : "Submit Shipment"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success">
          Shipment submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminShipmentsOverview; 