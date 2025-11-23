


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Routes basename="/">
      <Route path="/" element={<Dashboard />} />
      <Route path="/code/:code" element={<Stats />} />
      {/* <Route path="/r/:code" element={<Redirect />} /> */}

      <Route path="/r/:code" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
