import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}
