import { ProcessStatus, STATUS_LABELS } from "../types";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: ProcessStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<ProcessStatus, string> = {
    'no-prazo': 'bg-green-100 text-green-800 hover:bg-green-100',
    'atencao': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    'vencido': 'bg-red-100 text-red-800 hover:bg-red-100',
    'concluido': 'bg-blue-100 text-blue-800 hover:bg-blue-100'
  };

  return (
    <Badge className={variants[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
