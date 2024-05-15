import { useState, useContext } from "react";
import "./Menubar.css";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/datepicker";
import { Combobox } from "../ui/combobox";
import { ComboCheckBox } from "../ui/combocheckbox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { DatePickerRange } from "../ui/datepickerrange";

type appProps = {
  property?: {} | null;
  setProperty: any;
  view?: string;
};
export interface clientProps {
  name: string;
  code: string;
  clientId: number;
}

function MenuBar({ property, setProperty, view='day' }: appProps) {
  const [dates, setDates] = useState<undefined | Date>();
  const [from, setFrom] = useState<undefined | Date>();
  const [to, setTo] = useState<undefined | Date>();
  const [client, setClient] = useState<clientProps | null>();
  const [unknownClient, setUnknown] = useState(true);
  const [types, setType] = useState(["call", "imes", "wa", "photos", "email"]);

  const styleClass = "grid w-full max-w-sm items-center gap-1.5 form-container";

  const handleSubmit = () => {
    setProperty({
      date: dates,
      from: from,
      to: to,
      clientId: client !== null ? client?.clientId : 1,
      code: client !== null ? client?.code : "none",
      name: client !== null ? client?.name : "none",
      unknown: unknownClient,
      types: types,
    });
  };

  const handleChangeDay = (dir: string) => {
    if (dir == "prev" && dates !== undefined) {
      setProperty({
        ...property,
        date: new Date(dates.setDate(dates.getDate() - 1)),
      });
    } else if (dir == "next" && dates !== undefined) {
      setProperty({
        ...property,
        date: new Date(dates.setDate(dates.getDate() + 1)),
      });
    }
  };

  return (
    <>
      {view === 'day' && <> 
        <div className={styleClass}>
          <Label htmlFor="date" className="font-medium">
            Pick a Date
          </Label>
          <DatePicker setDates={setDates} />
        </div>
        <div
          className={styleClass}
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <Button
            onClick={() => handleChangeDay("prev")}
            variant={"outline"}
            style={{ width: "40%" }}
          >
            Prev
          </Button>
          <Button
            onClick={() => handleChangeDay("next")}
            variant={"outline"}
            style={{ width: "40%" }}
          >
            Next
          </Button>
        </div> 
      </>}
      <div className={styleClass}>
        <Label htmlFor="client" className="font-medium">
          Choose a client
        </Label>
        <Combobox setClient={setClient} />
      </div>
      {view === 'client' && <div className={styleClass}>
          <Label htmlFor="date" className="font-medium">
            Pick a Date Range
          </Label>
          <div className="flex justify-between items-center gap-2 font-bold">
            <DatePicker noIcon setDates={setFrom} />
            -
            <DatePicker noIcon setDates={setTo} />
          </div>
          
        </div>}
      <div className={styleClass} style={{ display: "flex" }}>
        <Checkbox
          checked={unknownClient}
          onCheckedChange={() => setUnknown(!unknownClient)}
        />
        <Label style={{ fontWeight: "400" }}>Include Unknown Sender</Label>
      </div>
      <div className={styleClass}>
        <Label htmlFor="type"></Label>
        <ComboCheckBox setType={setType} />
      </div>
      <Button
        type="submit"
        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
        onClick={handleSubmit}
        disabled={dates !== undefined ? false : view === 'client' && client ? false : true}
      >
        Submit
      </Button>
    </>
  );
}

export default MenuBar;
