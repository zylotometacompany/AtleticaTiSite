import { Navigate, Outlet, useLocation } from "react-router-dom";

const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

export function CompradorProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem(COMPRADOR_TOKEN_KEY);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
