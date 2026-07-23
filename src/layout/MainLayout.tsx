import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main
        className="page-transition"
        style={{
          paddingTop: "96px",
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
