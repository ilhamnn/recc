import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Fot } from "@/components/ui/footer";
import SignInPageDemo from "@/pages/Login";
import Penerima from "@/pages/Penerima";
import Pemberi from "./Pemberi";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignInPageDemo />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/r" element={<Penerima />} />
          <Route path="/g" element={<Pemberi />} />
        </Route>

        {/* Redirect /r dan /g lama ke route baru */}
        <Route path="/r" element={<Navigate to="/r" replace />} />
        <Route path="/g" element={<Navigate to="/g" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Fot />
    </>
  );
}
