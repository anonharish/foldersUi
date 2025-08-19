import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography,
  Grid,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
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
import { useAuth } from "../../componnets/Auth/useAuth";



const LoginPage = () => {
  const navigate = useNavigate();
const {login} = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered credentials
  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true";
    const savedUsername = localStorage.getItem("savedUsername") || "";
    const savedPassword = localStorage.getItem("savedPassword") || "";
    if (remember) {
      setForm({ username: savedUsername, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (e) => {
    setForm((prev) => ({ ...prev, username: e.target.value }));
    setErrors((prev) => ({ ...prev, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const validate = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!form.username.trim()) {
      newErrors.username = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.username.trim())
    ) {
      newErrors.username = "Invalid email format";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Dummy user data
    const dummyUser = {
      username: "admin@example.com",
      password: "admin",
      name: "John Doe",
    };

    setTimeout(() => {
      setIsLoading(false);
      if (
        form.username === dummyUser.username &&
        form.password === dummyUser.password
      ) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedUsername", form.username);
          localStorage.setItem("savedPassword", form.password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
        }
          login(dummyUser, dummyUser.name);
        navigate("/home");
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "Invalid username or password",
        }));
      }
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
      {/* Left Panel */}
      <Grid
        container
        item
        xs={12}
        md={7}
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh", backgroundColor: "white", position: "relative" }}
      >
        {/* Login Card */}
        <Grid item xs={12} md={7} sx={{ zIndex: 1, py: 4 }}>
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

            <form onSubmit={handleSubmit}>
              <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
            <TextField
  label="Email"
  placeholder="Enter your email"
  value={form.username}
  onChange={handleEmailChange}
  error={!!errors.username}
  helperText={errors.username}
  required
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon fontSize="small" />
      </InputAdornment>
    ),
  }}
  sx={{ mb: 2 }}
/>

<TextField
  label="Password"
  placeholder="Enter your password"
  type="password"
  value={form.password}
  onChange={handlePasswordChange}
  error={!!errors.password}
  helperText={errors.password}
  required
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockIcon fontSize="small" />
      </InputAdornment>
    ),
  }}
  sx={{ mb: 2 }}
/>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: "#3b54b0",
                          "&.Mui-checked": { color: "#3b54b0" },
                        }}
                      />
                    }
                    label="Remember me"
                    sx={{ color: "#3b54b0" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "#ea641f", fontWeight: 500 }}
                    onClick={() => navigate("/forgotPassword")}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                {isLoading ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <CircularProgress color="primary" />
                    <Typography fontWeight={600} fontSize="1.2rem" color="#3b54b0" ml={2}>
                      Logging In...
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
                    Log In to revPlus AI
                  </Button>
                )}
              </Box>
            </form>
          </Container>
        </Grid>
      </Grid>

      {/* Right Panel */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: { xs: "none", md: "flex" },
          background: "linear-gradient(to bottom right, rgb(48, 68, 141), #3b54b0)",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        <Box position="absolute" width="100%" height="100%" zIndex={0} top="10%" left="10%">
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
          sx={{ maxWidth: 500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
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

export default LoginPage;
