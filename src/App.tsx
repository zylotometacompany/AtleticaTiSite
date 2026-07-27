import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layout/MainLayout";

import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Diretoria from "./pages/Directors/Diretoria";
import ZCardRequest from "./pages/zCardRequest/zCardRequest";

import { ProductsPage } from "./pages/store/Store";

import { CheckoutPage } from "./pages/store/Checkout/Checkout";
import PedidoSucessoPage from "./pages/store/PedidoSucessoPage/PedidoSucessoPage";
import PedidoPendentePage from "./pages/store/PedidoPendentePage/PedidoPendentePage";
import PedidoFalhaPage from "./pages/store/PedidoFalhaPage/PedidoFalhaPage";
import PedidoComprovantePage from "./pages/store/PedidoComprovantePage/PedidoComprovantePage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/eventos" element={<Events />} />

        <Route path="/diretoria" element={<Diretoria />} />

        <Route path="/zcard" element={<ZCardRequest />} />

        <Route path="/loja" element={<ProductsPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />

        <Route
          path="/pedido/:publicToken/sucesso"
          element={<PedidoSucessoPage />}
        />

        <Route
          path="/pedido/:publicToken/pendente"
          element={<PedidoPendentePage />}
        />

        <Route
          path="/pedido/:publicToken/falha"
          element={<PedidoFalhaPage />}
        />

        <Route
          path="/pedido/:publicToken/comprovante"
          element={<PedidoComprovantePage />}
        />
      </Route>
    </Routes>
  );
}
