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
import LockIcon from "@mui/icons-material/Lock";
import { CheckCircle as CheckCircleIcon, Healing } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  LocalHospital,
  Medication,
  MedicalServices,
  Thermostat,
  Vaccines,
  Psychology,
  Bolt,
  Shield,
} from "@mui/icons-material";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      setIsSuccess(true);
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
        size={{ xs: 12, md: 7 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          backgroundColor: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating Background Icons */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 30,
            zIndex: 0,
            opacity: 0.1,
            display: { xs: "flex", md: "none" },
          }}
        >
          <Medication sx={{ fontSize: 120, color: "#3b54b0" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 50,
            zIndex: 0,
            opacity: 0.1,
            display: { xs: "flex", md: "none" },
          }}
        >
          <Healing sx={{ fontSize: 100, color: "#ea641f" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "45%",
            zIndex: 0,
            opacity: 0.07,
            display: { xs: "flex", md: "none" },
          }}
        >
          <LocalHospital sx={{ fontSize: 160, color: "#3b54b0" }} />
        </Box>

        {/* Reset Password Card */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            zIndex: 1,
            py: 4,
          }}
        >
          <Container maxWidth="sm" sx={{ width: "100%" }}>
            <Box textAlign="center" mb={4}>
              <img
                src="/logoRenee.svg"
                alt="healthCare"
                width={150}
                height={50}
                style={{ display: "block", margin: "0 auto" }}
              />
              <Typography color="textSecondary" mt={1}>
                Healthcare Intelligence Platform
              </Typography>
            </Box>

            {isSuccess ? (
              <Box textAlign="center">
                <CheckCircleIcon sx={{ fontSize: 60, color: "#3EB489" }} />
                <Typography variant="h5" fontWeight="bold" mt={2}>
                  Password Reset Successful
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </Button>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Typography
                  variant="h5"
                  gutterBottom
                  textAlign="center"
                  fontWeight="bold"
                  sx={{
                    color: "text.secondary",
                    background: "linear-gradient(to right, #3b54b0, #ea641f)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Reset Password
                </Typography>

              <TextField
  label="New Password"
  type="password"
  value={form.password}
  onChange={handleChange("password")}
  error={!!errors.password}
  helperText={errors.password}
  fullWidth
  sx={{ mt: 2 }}
/>

             <TextField
  label="Confirm Password"
  type="password"
  value={form.confirmPassword}
  onChange={handleChange("confirmPassword")}
  error={!!errors.confirmPassword}
  helperText={errors.confirmPassword}
  required
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon fontSize="small" />
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
                    sx={{ mt: 2, flexDirection: "column" }}
                  >
                    <CircularProgress color="primary" size={60} />
                    <Typography
                      fontWeight={600}
                      fontSize="1.2rem"
                      color="#3b54b0"
                      mt={2}
                    >
                      Resetting...
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
                    Reset Password
                  </Button>
                )}
              </form>
            )}
          </Container>
        </Grid>
      </Grid>

      {/* Right Side Background */}
      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{
          background:
            "linear-gradient(to bottom right, rgb(48, 68, 141), #3b54b0)",
          position: "relative",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        <Box
          position="absolute"
          width="100%"
          height="100%"
          zIndex={0}
          top="10%"
          left="10%"
          overflow="hidden"
        >
          {iconComponents.map((icon, i) => (
            <Box
              key={i}
              position="absolute"
              top={`${(i % 5) * 15 + 5}%`}
              left={`${(i * 10 + 10) % 80}%`}
              sx={{
                width: 50,
                height: 50,
                bgcolor: "white",
                opacity: 0.15,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "float 5s ease-in-out infinite",
                animationDelay: `${i * 0.3}s`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>
        <Box
          zIndex={1}
          color="white"
          textAlign="center"
          sx={{
            "@keyframes slideFadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            animation: "slideFadeIn 1s ease-out forwards",
            maxWidth: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "40%",
            bottom: "50%",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Advanced Healthcare
            <br />
            <span style={{ color: "#ea641f" }}>AI Solutions</span>
          </Typography>
          <Typography variant="body1" mt={2}>
            Empowering healthcare professionals with intelligent insights,
            streamlined workflows, and better patient outcomes.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
