import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './Components/Auth.js'
import ForgotPass from "./Components/ForgotPass";
import Homepage from "./Components/Homepage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Auth />} />
    <Route path="/reset" element={<ForgotPass />} />
    <Route path="/home" element={<Homepage />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
