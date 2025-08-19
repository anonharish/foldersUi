import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Container,
  CircularProgress,
  TextField,
} from "@mui/material";
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

const VerifyOtp = () => {
  const navigate = useNavigate();
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, ""); // only digits
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < otpLength - 1) refs.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      refs.current[idx - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    setIsLoading(true);
    setTimeout(() => {
      if (enteredOtp === "123456") {
        toast.success("Verified OTP Successfully");
        navigate("/resetPassword");
      } else {
        setError("Invalid OTP");
      }
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
      {/* Left Side */}
      <Grid
        container
        size={{ xs: 12, md: 7 }}
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
        <Box sx={{ position: "absolute", top: "40%", left: "45%", zIndex: 0, opacity: 0.07, display: { xs: "flex", md: "none" } }}>
          <LocalHospital sx={{ fontSize: 160, color: "#3b54b0" }} />
        </Box>

        {/* OTP Card */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ zIndex: 1, py: 4 }}>
          <Container maxWidth="sm" sx={{ width: "100%" }}>
            <Box textAlign="center" mb={4}>
              <img src="/logoRenee.svg" alt="healthCare" width={150} height={50} style={{ display: "block", margin: "0 auto" }} />
              <Typography color="textSecondary" mt={1}>
                Healthcare Intelligence Platform
              </Typography>
            </Box>

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
              Verify OTP
            </Typography>
            <Typography variant="body2" textAlign="center" mb={3}>
              Enter the 6-digit OTP sent to your email
            </Typography>

            {/* MUI OTP TextFields */}
            <Box display="flex" justifyContent="space-between" maxWidth={300} mx="auto">
              {otp.map((digit, idx) => (
                <TextField
                  key={idx}
                  inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.5rem" } }}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  error={!!error}
                  sx={{ width: 40 }}
                  inputRef={(el) => (refs.current[idx] = el)}
                />
              ))}
            </Box>

            {error && (
              <Typography color="error" mt={2} textAlign="center">
                {error}
              </Typography>
            )}

            {isLoading ? (
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 2, flexDirection: "column" }}>
                <CircularProgress color="primary" size={60} />
                <Typography fontWeight={600} fontSize="1.2rem" color="#3b54b0" mt={2}>
                  Verifying...
                </Typography>
              </Box>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ borderRadius: 3, backgroundColor: "#3b54b0", border: "1px solid #3b54b0", mt: 2, py: 1.5 }}
                onClick={handleVerify}
              >
                Verify OTP
              </Button>
            )}
          </Container>
        </Grid>
      </Grid>

      {/* Right Side Background */}
      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{
          background: "linear-gradient(to bottom right, rgb(48, 68, 141), #3b54b0)",
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
        <Box position="absolute" width="100%" height="100%" zIndex={0} top="10%" left="10%" overflow="hidden">
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
            Empowering healthcare professionals with intelligent insights, streamlined workflows, and better patient outcomes.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default VerifyOtp;
