import { Card, CardContent, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, color = "#6366f1", loading = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
          transition: "box-shadow 0.2s",
        }}
      >
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">
                {title}
              </p>
              {loading ? (
                <Skeleton width={80} height={36} />
              ) : (
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {value}
                </p>
              )}
            </div>
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              {Icon && <Icon size={24} style={{ color }} />}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
