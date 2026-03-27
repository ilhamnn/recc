import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Fot } from "@/components/ui/footer";
import SignInPageDemo from "@/pages/login";
import Penerima from "@/pages/Penerima";
import Pemberi from "./Pemberi";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/r" element={<Penerima />} />
        <Route path="/g" element={<Pemberi />} />
        <Route path="/landing" />
        <Route path="/login" element={<SignInPageDemo />} />;
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Fot />
    </>
  );
}
