import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import Signup from "./components/SignUp";
import SignIn from "./components/Signin";
import Feed from "./components/Feed";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const defaultTheme = createTheme();

function App() {
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    color: "",
  });

  const handleSnackBar = (open, message, color) => {
    setSnackBar({
      open: open,
      message: message,
      color: color,
    });
  };

  const handleClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/feed" />}
              handleSnackBar={handleSnackBar}
            />
            <Route
              path="/signin"
              element={<SignIn handleSnackBar={handleSnackBar} />}
            />
            <Route
              path="/signup"
              element={<Signup handleSnackBar={handleSnackBar} />}
            />
            <Route
              path="/feed"
              element={<Feed handleSnackBar={handleSnackBar} />}
            />
          </Routes>
          <Snackbar
            open={snackBar.open}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={snackBar.color}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackBar.message}
            </Alert>
          </Snackbar>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
