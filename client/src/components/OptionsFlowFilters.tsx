
import { Zap, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Filters {
  unusual: boolean;
  scalp: boolean;
  golden: boolean;
}

interface OptionsFlowFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function OptionsFlowFilters({ filters, onFilterChange }: OptionsFlowFiltersProps) {
  const toggleFilter = (filterName: keyof Filters) => {
    onFilterChange({
      ...filters,
      [filterName]: !filters[filterName],
    });
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        className={`rounded-full flex items-center gap-2 ${
          filters.unusual ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={() => toggleFilter("unusual")}
      >
        <Zap className="h-4 w-4" />
        Unusual
      </Button>
      <Button
        variant="outline"
        className={`rounded-full flex items-center gap-2 ${
          filters.scalp ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={() => toggleFilter("scalp")}
      >
        <TrendingUp className="h-4 w-4" />
        Scalp
      </Button>
      <Button
        variant="outline"
        className={`rounded-full flex items-center gap-2 ${
          filters.golden ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
        onClick={() => toggleFilter("golden")}
      >
        <Star className="h-4 w-4" />
        Golden
      </Button>
    </div>
  );
}
