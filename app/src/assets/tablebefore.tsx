// {(props.allData as any).length > 0 ? (
//     (props.allData as any).map((data: allDataInterface, i: number) => (
//       <TableBody>
//         <TableCell colSpan={8} className="title-row">
//           {data.code}
//         </TableCell>
//         {data.data.map(
//           (record: DataInterface | DataPhoneInterface, i: number) => (
//             <TableRow>
//               <TableCell className="">{data.code}</TableCell>
//               <TableCell className="">
//                 {`${new Date(
//                   "message_date" in record
//                     ? record.message_date
//                     : record.start_time
//                 ).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//                 \n
//                 ${
//                   "finish_time" in record
//                     ? new Date(record.finish_time).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })
//                     : ""
//                 }`}
//               </TableCell>
//               <TableCell>
//                 {"duration" in record
//                   ? record.duration > 0
//                     ? record.duration
//                     : "-"
//                   : "-"}
//               </TableCell>
//               <TableCell>
//                 {"io" in record
//                   ? ioChecker(record.io)
//                   : ioChecker(record.kind)}
//               </TableCell>
//               <TableCell>
//                 {"duration" in record ? "CALL" : formatType(record.type)}
//               </TableCell>
//               <TableCell>{record.name}</TableCell> {/*need sender name*/}
//               <TableCell>
//                 {record.number.includes("@")
//                   ? record.number
//                   : formatPhoneNumber(record.number)}
//               </TableCell>{" "}
//               {/* need sender number */}
//               <TableCell>
//                 {"io" in record ? record.io : record.message}
//               </TableCell>
//             </TableRow>
//           )
//         )}
//       </TableBody>
//     ))
//   ) : (
//     <TableCell colSpan={8} className="empty-container">
//       There is no data on this date
//     </TableCell>
//   )}
