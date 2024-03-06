import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import Signup from "./components/SignUp";
import SignIn from "./components/Signin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/Feed";

const defaultTheme = createTheme();

function App() {
  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <div className="App">
          <ThemeProvider theme={defaultTheme}>
            <Routes>
              <Route path="/signin" Component={SignIn} />
              <Route path="/signup" Component={Signup} />
              <Route path="/feed" Component={Feed} />
            </Routes>
          </ThemeProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
