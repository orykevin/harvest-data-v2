import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState, FC } from "react";

interface PropDateInterface {
  dates?: Date;
  setDates?: (value: Date | undefined) => void;
  mode? :string
  noIcon?: boolean
}

export function DatePicker(props: PropDateInterface) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if(props.setDates){
      props.setDates(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100%] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {!props.noIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {date ? format(date, !props.noIcon ? "PPP" : 'dd MMM y') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" w-auto p-0 ">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={setDate}
          fromYear={1960}
          toYear={2030}
          defaultMonth={date}
          className="z-[9999]"
        />
      </PopoverContent>
    </Popover>
  );
}
