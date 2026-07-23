import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import ZCardRequest from "./pages/zCardRequest/zCardRequest";
import { ProductsPage } from "./pages/store/Store";
import { CheckoutPage } from "./pages/store/Checkout/Checkout";


export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/zcard" element={<ZCardRequest/>}/>
          <Route path="/loja" element={<ProductsPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
        </Route>
    </Routes>
  );
}
