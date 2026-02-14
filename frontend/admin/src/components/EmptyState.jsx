import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There are no records to display.",
  icon = PackageOpen,
}) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon size={48} strokeWidth={1.5} />
      <p className="mt-4 text-lg font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}
