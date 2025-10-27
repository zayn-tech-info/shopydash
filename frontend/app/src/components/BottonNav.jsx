import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useMemo } from "react";
import { navigation } from "../constants";
import { NavLink, useLocation } from "react-router-dom";

export function BottonNav() {
  const location = useLocation();
  const current = useMemo(() => {
    return location.pathname === "/" ? "/" : location.pathname;
  }, [location.pathname]);
  return (
    <div className="md:hidden">
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
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
            const to = nav.href === "/home" ? "/" : nav.href;
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
                  // label tweaks
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
