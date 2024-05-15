import { useState, useEffect, useReducer, useContext } from "react";
import TableAllList from "./TableAllList";
import "./TableView.css";
import TimeBilling from "./TimeBilling";
import { getRequest } from "@/function/getFetch";
import { getDateString } from "@/function/dateFormatFunction";
import { PropertyInterface } from "@/App";
import ipContext from "@/function/ipContext";
import { Loading } from "../ui/loading";

interface tableProps {
  property: PropertyInterface | null;
  setProperty?: React.Dispatch<React.SetStateAction<PropertyInterface | null>>;
  view?: string;
}

export interface DataTextInterface {
  id: number;
  message: string;
  start_time: string;
  type: string;
  kind: string;
  filename: string | null;
  user_id: number;
  user_name: string;
  user_number: string;
  client_id: number;
  client_code: string;
  client_name: string;
  client_project: string;
}

export interface DataPhoneInterface {
  id: number;
  phone_number: string;
  start_time: string;
  finish_time: string;
  duration: number;
  io: string;
  user_id: number;
  user_name: string;
  user_number: string;
  client_id: number;
  client_code: string;
  client_name: string;
  client_project: string;
}

export interface DataPhotoInterface {
  client_code: string;
  client_id: number;
  client_name: string;
  client_project: string;
  filename: string;
  id: number;
  size: number;
  start_time: string;
  type: string;
  kind?: string | undefined | number;
}

export interface DataEmailInterface {
  client_code: string;
  client_id: number;
  client_name: string;
  client_project: string;
  emails_user_email: string;
  emails_user_name: string;
  id: number;
  sender: number;
  start_time: Date;
  subject: string;
  user_id: number;
  user_name: string;
  user_number: string;
}
export interface DataSeperatorInterface {
  type : string
  date: Date;
}

function TableView({ property, view }: tableProps) {
  const [allData, setAllData] = useState<
    (DataTextInterface | DataPhoneInterface)[] | []
  >([]);
  const [timeZone, setTimeZone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { ipConfig } = useContext(ipContext);

  const filtering = (item: DataPhoneInterface | DataTextInterface | DataSeperatorInterface) => {
    if (property?.types.includes("call")) {
      if ("io" in item) return true;
    } else if (property?.types.includes("imes")) {
      if ("type" in item && item.type == "iMessage") return true;
    } else if (property?.types.includes("wa")) {
      if ("type" in item && item.type == "WhatsApp") return true;
    } else if(view === 'client' && "type" in item &&  item.type === "seperator") return true
      else false;
  };

  const getAllData = (api: string) => {
    setIsLoading(true)
    const body = {
      date: property?.date ? getDateString(property?.date) : '',
      from: property?.from || '',
      to: property?.to || property?.from,
      types : property?.types,
      ...(property !== null &&
        "clientId" in property &&
        property.clientId !== 1 && { clientId: property.clientId }),
    };
    getRequest(`http://${ipConfig}:3000/api/get-data/${api}`, body, "")
      .then((res) => {
        //console.log(res);
        setAllData(
          res.filter(
            (
              item: DataTextInterface | DataPhoneInterface | DataPhotoInterface
            ) => {
              if (item.client_id === 1 && property?.unknown === false)
                return false;
              // if (
              //   property?.types.includes("imes") &&
              //   "type" in item &&
              //   item.type === "iMessage"
              // )
              //   return true;
              // if (
              //   property?.types.includes("wa") &&
              //   "type" in item &&
              //   item.type === "WhatsApp"
              // )
              //   return true;
              // if (property?.types.includes("call") && "io" in item) return true;
              // if ("size" in item && property?.types.includes("photos"))
              //   return true;
              // if (property?.types.includes("email") && "sender" in item)
              //   return true;
              if(view === 'client' && "type" in item &&  item.type === "seperator")
                return true
              else return true
            }
          )
        );
        setIsLoading(false)
      })
      .catch((err) => {
        console.log("Error when calling data" + err.message);
        setAllData([]);
        setIsLoading(false)
      });
  };

  useEffect(() => {
    if (property !== null) {
      console.log(property)
      // getAllData(`http://${ipConfig}:8000/api/v2/client-data`);
      if(view === 'day') getAllData("by-day");
      if(view === 'client') getAllData('by-client')
    }
  }, [property]);

  useEffect(() => {
    setAllData([])
  }, [view]);

  const dateFormated = view === 'client' ? '' : property?.date
    ? property.date.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        day: "numeric",
        month: "long",
      })
    : "Select The Date";

  return (
    <>
      <h4 className="title-header">
        {`${dateFormated ? dateFormated + ' - ' : ''} 
        ${
          property?.name === "none"
            ? "All Client"
            : property?.name
            ? property.name
            : "Select the Client"
        }`}
      </h4>
      
      {!isLoading ? <TableAllList allData={allData} /> 
        :
        <Loading className="mt-[30vh]" />
      }
      {/* <TimeBilling /> */}
    </>
  );
}

export default TableView;
