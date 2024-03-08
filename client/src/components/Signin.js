import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { backgrounds } from "../assets/backgrounds";
import { Dialog, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

function SignIn(props) {
  const { handleSnackBar } = props;
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordResetDialog, setPasswordResetDialog] = useState(false)
  const [sendEmail, setSendEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundIndex(randomIndex);
  }, []);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", formData.username);
        handleSnackBar(true, "Logged in successfully", "success");
        navigate("/feed");
      } else {
        const errorData = await response.json();
        handleSnackBar(true, `Login failed: ${errorData.error}`, "error");
        console.error("Login failed:", errorData.error);
      }
    } catch (error) {
      handleSnackBar(
        true,
        "An unexpected error occurred. Please try again later.",
        "error"
      );
    }
  };
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/forgot-password", { sendEmail });
      handleSnackBar(true, "Password reset email sent successfully", 'success')
    } catch (error) {
      handleSnackBar(true, error.response.data.error, 'error')
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgrounds[backgroundIndex]})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "block",
            sm: "none",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <p style={{ fontSize: "12px", color: "red", margin: 0 }}>
                  **{error}**
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={() => setPasswordResetDialog(true)}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog fullWidth maxWidth="sm" open={passwordResetDialog}>
        <h4 style={{marginLeft:"5%", marginBottom:"5%"}}>Reset password</h4>
        <form
          onSubmit={handlePasswordReset}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            width: "50%",
            marginLeft: "24%"
          }}
        >
          <TextField
            id="outlined-basic"
            label="Enter your email"
            variant="outlined"
            value={sendEmail}
            style={{width:'130%', marginBottom:"5%"}}
            onChange={(e) => setSendEmail(e.target.value)}
          />
          <div style={{display:"flex",alignItems:"center"}}>
            <Button
              variant="contained"
              color="error"
              type="button"
              onClick={() => setPasswordResetDialog(false)}
              style={{margin:"1.5vw", width:"10vw", fontSize:"0.8vw"}}>Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{margin:"1.5vw", width:"11vw", fontSize:"0.8vw"}}>Send Reset Email
            </Button>
          </div>
          
        </form>
      </Dialog>
    </ThemeProvider>
  );
}

export default SignIn;
