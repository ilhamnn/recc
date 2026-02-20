// import { useState } from "react";
// import { Fot } from "@/components/ui/footer";
// import SignInPageDemo from "@/pages/welcome";
// import { SimpleHeader } from "@/components/ui/navBase/headr";

// export default function App() {
//   return (
//     <>
//       <SignInPageDemo />
//       <Fot />
//     </>
//   );
// }

import { Routes, Route } from "react-router-dom";
import SignInPageDemo from "@/pages/Welcome";
import Landing from "@/pages/Landing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Fot } from "@/components/ui/footer";

export default function App() {
  return (
    <>
      <Routes>
        {/* public */}
        <Route path="/" element={<SignInPageDemo />} />

        {/* protected */}
        <Route
          path="/landing"
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
