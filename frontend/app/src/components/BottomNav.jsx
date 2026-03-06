import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useMemo } from "react";
import { navigation } from "../constants";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function BottomNav() {
  const authUser = useAuthStore((state) => state.authUser);

  if (!authUser) return null;

  const location = useLocation();
  const current = useMemo(() => {
    return location.pathname === "/" ? "/" : location.pathname;
  }, [location.pathname]);

  const renderNav = (nav, role) => {
    if (nav === "Pricing" && role !== "vendor") return null;

    if (!authUser) {
      if (nav === "Home") return;
      return null;
    }

    if (nav === "Settings") return null;
    if (nav === "Messages") return null;
    if (nav === "Dashboard" && role !== "vendor") {
      return null;
    }
  };
  return (
    <div className="md:hidden">
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
        elevation={8}
      >
        <BottomNavigation
          showLabels
          value={current}
          sx={{
            bgcolor: "#F7561B",
            height: 64,
          }}
        >
          {navigation.map((nav) => {
            let to = nav.href === "/home" ? "/" : nav.href;

            if (nav.href === "/profile") {
              if (authUser && authUser.username) {
                to = authUser.hasProfile
                  ? `/p/${authUser.username}`
                  : "/complete-user-registration";
              } else {
                to = "/login";
              }
            }
            const navResult = renderNav(nav.text, authUser?.role);
            if (navResult === null) return null;

            const Icon = nav.icon;
            return (
              <BottomNavigationAction
                key={nav.id}
                label={nav.text}
                value={to}
                component={NavLink}
                to={to}
                icon={Icon ? <Icon /> : null}
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  minWidth: 0,
                  flex: 1,
                  pt: 1,
                  fontSize: 10,
                  "&.Mui-selected": {
                    color: "#F7561B",
                    bgcolor: "rgba(255,255,255,0.90)",
                    px: 1.5,
                    border: "none",
                  },

                  "& .MuiBottomNavigationAction-label": {
                    fontSize: 12,
                    fontWeight: 500,
                  },
                }}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </div>
  );
}
