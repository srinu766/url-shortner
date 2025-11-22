// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//      <h1 class="text-3xl font-bold underline">
//     Hello world!
//   </h1>
//     </>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/code/:code" element={<Stats />} />
      <Route path="/:code" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
