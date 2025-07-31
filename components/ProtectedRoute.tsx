
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else {
        setCanRender(true);
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !canRender) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
