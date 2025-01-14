import { Route, BrowserRouter as Router, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster
          position="top-center"
          reverseOrder={false}
          // to add custom css I believe, to the toast container
          containerClassName=""
          toastOptions={{
            className: "",
            duration: 5000,
            // can pass specific options for each toast type
            success: {
              duration: 3000,
            },
          }}
        />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
