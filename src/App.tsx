import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layout/MainLayout";
import { CompradorLayout } from "./layout/CompradorLayout";

import { CompradorProtectedRoute } from "./routes/CompradorProtectedRoute";

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

import CompradorRegisterPage from "./pages/store/comprador/CompradorRegister";
import CompradorLoginPage from "./pages/store/comprador/CompradorLogin";
import MinhasCompras from "./pages/store/comprador/MinhasCompras";

import CompletarCadastroPage from "./pages/store/comprador/CompletarCadastroPage";

export default function App() {
  return (
    <Routes>
      {/*
       * ========================================
       * SITE PÚBLICO
       * ========================================
       */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/diretoria" element={<Diretoria />} />

        <Route path="/eventos" element={<Events />} />

        <Route path="/zcard" element={<ZCardRequest />} />

        <Route path="/loja" element={<ProductsPage />} />

        {/*
         * ========================================
         * AUTENTICAÇÃO DO COMPRADOR
         * ========================================
         */}
        <Route path="/login" element={<CompradorLoginPage />} />
        <Route path="/completar-cadastro" element={<CompletarCadastroPage />} />
        <Route path="/register" element={<CompradorRegisterPage />} />

        {/*
         * ========================================
         * VERIFICAÇÃO DE E-MAIL
         *
         * IMPORTANTE:
         * Esta rota é pública.
         * ========================================
         */}

        {/*
         * ========================================
         * RETORNOS DO MERCADO PAGO
         * ========================================
         */}
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

      {/*
       * ========================================
       * ÁREA PROTEGIDA DO COMPRADOR
       * ========================================
       */}
      <Route element={<CompradorProtectedRoute />}>
        {/*
         * CHECKOUT
         */}
        <Route element={<MainLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/*
         * MINHA CONTA
         */}
        <Route element={<CompradorLayout />}>
          <Route path="/minha-conta/compras" element={<MinhasCompras />} />
        </Route>
      </Route>
    </Routes>
  );
}
