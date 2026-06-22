import { Badge } from "./ui/badge";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

interface PriorityBadgeProps {
  priority: 'alta' | 'media' | 'baixa';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    alta: {
      label: 'Alta',
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
      icon: ArrowUp
    },
    media: {
      label: 'Média',
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      icon: ArrowRight
    },
    baixa: {
      label: 'Baixa',
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      icon: ArrowDown
    }
  };

  const { label, className, icon: Icon } = config[priority];

  return (
    <Badge className={`${className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
