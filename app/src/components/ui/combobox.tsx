import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { getRequest } from "@/function/getFetch";
import ipContext from "@/function/ipContext";
import { ipContextInterface } from "@/function/ipContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";

interface comboProps {
  client?: {
    code: string | null;
    name: string | null;
    clientId: number | null;
  } | null;
  setClient?: any;
  form?: boolean;
  selected?: number | null;
}

interface clientInterface {
  id: number;
  code: string | null;
  name: string;
  project: string;
  created_at: string;
  updated_at: string;
}

export interface valueProps {
  code: string | null;
  name: string | null;
  clientId: number | null;
}

export function Combobox({ setClient, client, selected }: comboProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<valueProps | null>(null);
  const [clientData, setClientData] = useState<clientInterface[] | []>([]);
  const { ipConfig } = useContext<ipContextInterface>(ipContext);

  useEffect(() => {
    getData(`http://${ipConfig}:3000/api/clients`);
  }, [ipConfig]);

  useEffect(() => {
    setClient(value);
  }, [value]);

  const getData = async (api: string) => {
    getRequest(api, {}, "").then((res) => {
      setClientData(res);
    });
  };

  useEffect(() => {
    if (client !== undefined) {
      setValue(client);
    }
  }, [selected]);

  const setupName = () => {
    if (value === null) {
      return "Select Client";
    } else if (value?.name === "none") {
      return "All Client";
    } else {
      return value?.name;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between"
        >
          {setupName()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <ScrollArea className="h-72 w-100% rounded-md border">
          <Command>
            <CommandInput placeholder="Search listClient..." />
            <CommandEmpty>No list Client found.</CommandEmpty>
            <CommandGroup>
              {clientData.map((listClient: clientInterface) => (
                <CommandItem
                  key={listClient.code}
                  onSelect={(currentValue) => {
                    console.log(currentValue);
                    setValue(
                      listClient.code === value
                        ? null
                        : {
                            code: listClient.code,
                            name: listClient.name,
                            clientId: listClient.id,
                          }
                    );
                    setOpen(false);
                  }}
                  style={{ paddingLeft: "0" }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === listClient.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {listClient.name === "none" ? "All Client" : listClient.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
