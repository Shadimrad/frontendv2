import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';

interface HeatmapProps {
  days: (number | null)[];
  startDate: string;
  onDayClick: (date: Date) => void;
}

const Heatmap = ({ days, startDate, onDayClick }: HeatmapProps) => {
  const getColorForScore = (score: number | null): string => {
    if (score === null) return '#f3f4f6';
    
    const value = score / 100;
    
    if (value === 0) return '#f3f4f6';
    if (value <= 0.25) return `rgb(219, 234, 254)`;
    if (value <= 0.5) return `rgb(147, 197, 253)`;
    if (value <= 0.75) return `rgb(59, 130, 246)`;
    return `rgb(30, 64, 175)`;
  };

  const getDateForIndex = (index: number): Date => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  };

  const formatTooltipDate = (date: Date): string => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const getTooltipContent = (date: Date, score: number | null): string => {
    if (score === null) return 'No data recorded';
    return `Score: ${score.toFixed(1)}%`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Progress Heatmap</Label>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#f3f4f6]"></div>
            <span>0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[rgb(219,234,254)]"></div>
            <span>25%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[rgb(147,197,253)]"></div>
            <span>50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[rgb(59,130,246)]"></div>
            <span>75%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[rgb(30,64,175)]"></div>
            <span>100%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 max-w-[calc(29px*7+6px)] mx-auto">
        {days.map((score, index) => {
          const date = getDateForIndex(index);
          const shouldShow = date >= new Date(startDate);

          if (!shouldShow) {
            return <div key={index} className="w-[29px] h-[29px]" />;
          }

          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div
                  className="aspect-square w-[29px] h-[29px] rounded-md border border-gray-200 transition-colors hover:border-blue-500 cursor-pointer"
                  style={{
                    backgroundColor: getColorForScore(score)
                  }}
                  onClick={() => onDayClick(date)}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="space-y-1">
                  <p className="font-medium">{formatTooltipDate(date)}</p>
                  <p className="text-sm text-gray-500">
                    {getTooltipContent(date, score)}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
};

export default Heatmap;