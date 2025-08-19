import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LocalHospital,
  Medication,
  MedicalServices,
  Thermostat,
  Vaccines,
  Psychology,
  Bolt,
  Shield,
  Healing,
} from "@mui/icons-material";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "" };
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      toast.success("Email Sent Successfully");
      navigate("/verify-otp");
      setIsLoading(false);
    }, 1500);
  };

  const iconComponents = [
    <LocalHospital />,
    <Medication />,
    <MedicalServices />,
    <Thermostat />,
    <Vaccines />,
    <Psychology />,
    <Bolt />,
    <Shield />,
  ];

  return (
    <Grid container spacing={0} minHeight="100vh">
      <Grid
        container
        xs={12}
        md={7}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh", backgroundColor: "white", position: "relative", overflow: "hidden" }}
      >
        {/* Floating Icons */}
        <Box sx={{ position: "absolute", top: 10, left: 30, zIndex: 0, opacity: 0.1, display: { xs: "flex", md: "none" } }}>
          <Medication sx={{ fontSize: 120, color: "#3b54b0" }} />
        </Box>
        <Box sx={{ position: "absolute", bottom: 20, right: 50, zIndex: 0, opacity: 0.1, display: { xs: "flex", md: "none" } }}>
          <Healing sx={{ fontSize: 100, color: "#ea641f" }} />
        </Box>

        <Grid xs={12} md={7} sx={{ zIndex: 1, py: 4 }}>
          <Container maxWidth="sm" sx={{ width: "100%" }}>
            <Box textAlign="center" mb={4}>
              <img src="/logoRenee.svg" alt="healthCare" width={150} height={50} style={{ display: "block", margin: "0 auto" }} />
              <Typography color="textSecondary" mt={1}>Healthcare Intelligence Platform</Typography>
            </Box>
            <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold"
              sx={{ color: "text.secondary", background: "linear-gradient(to right, #3b54b0, #ea641f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Forgot Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
               <TextField
  label="Email"
  placeholder="Enter your email"
  value={form.email}
  onChange={handleChange("email")}
  error={!!errors.email}
  helperText={errors.email}
  required
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon fontSize="small" />
      </InputAdornment>
    ),
  }}
  sx={{ mt: 2 }}
/>
               {isLoading ? (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{ mt: 2, flexDirection: 'column' }}
  >
    <CircularProgress color="primary" size={60} />
    <Typography fontWeight={600} fontSize="1.2rem" color="#3b54b0" mt={2}>
      Sending...
    </Typography>
  </Box>
) : (
  <Button
    type="submit"
    variant="contained"
    fullWidth
    sx={{
      borderRadius: 3,
      backgroundColor: "#3b54b0",
      border: "1px solid #3b54b0",
      mt: 2,
      py: 1.5,
    }}
  >
    Send Email
  </Button>
)}

              </Box>
            </form>
          </Container>
        </Grid>
      </Grid>
      <Grid xs={12} md={5} sx={{ background: "linear-gradient(to bottom right, rgb(48, 68, 141), #3b54b0)", display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", px: 2, py: 6, overflow: "hidden", borderRadius: "16px", position: "relative" }}>
        <Box position="absolute" width="100%" height="100%" zIndex={0} top="10%" left="10%" overflow="hidden">
          {iconComponents.map((icon, i) => (
            <Box key={i} position="absolute" top={`${(i % 5) * 15 + 5}%`} left={`${(i * 10 + 10) % 80}%`} sx={{ width: 50, height: 50, bgcolor: "white", opacity: 0.15, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
