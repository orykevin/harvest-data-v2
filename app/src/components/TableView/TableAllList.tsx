import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FixedSizeList as List } from 'react-window';

import TableDialog from "./TableDialog";
import EmailDialog from "./EmailDialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { formatPhoneNumber, formatType } from "@/function/internationalNumber";
import moment from 'moment'

import {
  DataTextInterface,
  DataPhoneInterface,
  DataPhotoInterface,
  DataEmailInterface,
  DataSeperatorInterface
} from "./TableView";

import { removeFileExt } from "@/function/removeFileExt";

interface propsInterface {
  allData:
    | (
        | DataTextInterface
        | DataPhoneInterface
        | DataPhotoInterface
        | DataEmailInterface
        | DataSeperatorInterface
      )[]
    | [];
}

export function TableAllList(props: propsInterface) {
  useEffect(() => {
    //console.log("rendered");
  }, [props.allData]);

  const ioChecker = (status: string | number | undefined) => {
    if (
      status == "Received" ||
      status == "Incoming call" ||
      status == "INCOMING" ||
      status == "Incomingcall" ||
      status == "CallForwarded" ||
      status == "Call Forwarded" ||
      status == "BLOCKED" ||
      status == "TollFree" ||
      status === 1
    ) {
      return ">";
    } else if (
      status == "Sent" ||
      status == "Outgoing call" ||
      status == "TollFree" ||
      status == "Outgoingcall" ||
      status === 0
    ) {
      return "<";
    } else {
      return "-";
    }
  };

  const contentChecker = (val: any) => {
    //console.log(val.io);
    if ("io" in val) {
      return val.io;
    } else if ("filename" in val && val.filename !== null) {
      return val.filename;
    } else {
      return val.message;
    }
  };

  const numberChecker = (val: any) => {
    if ("phone_number" in val) {
      return val.phone_number;
    } else {
      return val.user_number;
    }
  };

  return (
    <Table style={{ textAlign: "center" }}>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[50px] th-table"
            style={{ borderRight: "none" }}
          >
            Code
          </TableHead>
          <TableHead
            className="w-[65px] th-table"
            style={{ borderLeft: "1px solid #e5e5e5", maxWidth: "60px" }}
          >
            Time
          </TableHead>
          <TableHead className="w-[75px] th-table">Dur</TableHead>
          <TableHead className="w-[50px] th-table">IO</TableHead>
          <TableHead className="w-[50px] th-table">Type</TableHead>
          <TableHead className="w-[120px] th-table">Name</TableHead>
          <TableHead className="w-[120px] th-table">Number / Email</TableHead>
          <TableHead
            className="w-[250px] th-table"
            style={{ borderRight: "none" }}
          >
            Content
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
            props.allData.length > 0 ? (
              props.allData.map((record, i: number) => 
                 record?.type !== 'seperator' ? (
                  <TableRow >
                  <TableCell className="">
                    {record.client_code == "none" ? "-" : record.client_code}
                  </TableCell>
                  <TableCell className="">
                    <p
                      style={{
                        maxWidth: "60px",
                        minWidth: "60px",
                        margin: "0 auto",
                      }}
                    >
                      {`${new Date(record.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    \n
                    ${
                      "finish_time" in record
                        ? new Date(record.finish_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }`}
                    </p>
                  </TableCell>
                  <TableCell>
                    {"duration" in record
                      ? record.duration > 0
                        ? `${record.duration} / ${(record.duration / 60).toFixed(
                            2
                          )}`
                        : "-"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {"io" in record
                      ? ioChecker(record.io)
                      : "sender" in record
                      ? ioChecker(record.sender)
                      : ioChecker(record.kind)}
                  </TableCell>
                  <TableCell>
                    {"duration" in record
                      ? "CALL"
                      : "sender" in record
                      ? "EML"
                      : formatType(record.type)}
                  </TableCell>
                  <TableCell>
                    {"size" in record
                      ? record.filename.slice(20)
                      : record.user_name == "none"
                      ? "Unknown"
                      : record.user_name}
                  </TableCell>{" "}
                  {/*need sender name*/}
                  <TableCell>
                    {"size" in record
                      ? " - "
                      : "sender" in record
                      ? record.emails_user_email
                      : formatPhoneNumber(numberChecker(record))}
                  </TableCell>{" "}
                  <TableCell>
                    {"sender" in record ? (
                      <EmailDialog filename={record?.subject?.includes('.eml') ? removeFileExt(record.subject) : record?.subject} />
                    ) : "filename" in record && record.filename !== null ? (
                      <TableDialog data={record} />
                    ) : (
                      <p style={{ cursor: "pointer" }}>{contentChecker(record)}</p>
                    )}
                  </TableCell>
                </TableRow>
                
              ) : <TableRow className="sticky top-[47px]" style={{zIndex:i+1}}><TableCell colSpan='100%' className="bg-gray-100 font-semibold">{moment(record.date).utc().format("dddd, MMMM Do YYYY")}</TableCell></TableRow>)
            ) : (
              <TableCell colSpan={8} className="empty-container">
                There is no data on this date
              </TableCell>
            )}
      </TableBody>
    </Table>
  );
}

export default TableAllList;
