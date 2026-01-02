import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserCircle, LogOut } from "lucide-react";

export  function CompleteProfileLanding() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  React.useEffect(() => {
    if (authUser?.hasProfile) {
      if (authUser.role === "vendor") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [authUser, navigate]);

  const handleCompleteProfile = () => {
    if (authUser?.role === "vendor") {
      navigate("/create-vendor-profile");
    } else {
      navigate("/create-client-profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="py-12 bg-n-1 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center border border-n-3/20 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-n-4 hover:text-n-6 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-n-2 rounded-full flex items-center justify-center text-n-4">
            <UserCircle size={64} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-n-8 mb-2">
          Welcome, {authUser?.username || "User"}!
        </h1>

        <p className="text-n-4 mb-8">
          To get the most out of Shopydash, please complete your profile
          information. It only takes a minute!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCompleteProfile}
            className="w-full py-3 px-6 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 transition-colors"
          >
            Complete Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-n-2 text-n-6 rounded-xl font-bold hover:bg-n-3 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
