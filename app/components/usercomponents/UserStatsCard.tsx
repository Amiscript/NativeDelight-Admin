import { LucideIcon } from 'lucide-react';

interface UserStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export function UserStatCard({ label, value, icon: Icon, color }: UserStatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}