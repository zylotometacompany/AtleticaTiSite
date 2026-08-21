import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layout/MainLayout";

import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Diretoria from "./pages/Directors/Diretoria";

import { CheckoutPage } from "./pages/store/Checkout/Checkout";


export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/diretoria" element={<Diretoria />} />

        <Route path="/eventos" element={<Events />} />

      

        <Route path="/checkout" element={<CheckoutPage />} />

      </Route>
    </Routes>
  );
}
