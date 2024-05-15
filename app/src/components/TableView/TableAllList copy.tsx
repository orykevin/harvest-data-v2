import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableAllList() {
  return (
    <Table style={{ textAlign: "center" }}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[75px] th-table" style={{ border: "none" }}>
            Code
          </TableHead>
          <TableHead className="w-[150px] th-table">Time</TableHead>
          <TableHead className="w-[100px] th-table">Dur</TableHead>
          <TableHead className="w-[75px] th-table">IO</TableHead>
          <TableHead className="w-[100px] th-table">Type</TableHead>
          <TableHead className="w-[150px] th-table">Name</TableHead>
          <TableHead className="w-[200px] th-table">Number / Email</TableHead>
          <TableHead className="w-[200px] th-table" style={{ border: "none" }}>
            Content
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableCell colSpan={8} style={{ padding: "0px" }}>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>VA</AccordionTrigger>
              <AccordionContent>
                {invoices.map((invoice) => (
                  <TableRow>
                    <TableCell className="w-[75px] border-table">VAS</TableCell>
                    <TableCell className="w-[175px] border-table">
                      VAS
                    </TableCell>
                    <TableCell className="w-[100px] border-table">
                      test
                    </TableCell>
                    <TableCell className="w-[90px] border-table">
                      {">"}
                    </TableCell>
                    <TableCell className="w-[100px] border-table">
                      test
                    </TableCell>
                    <TableCell className="w-[170px] border-table">
                      test
                    </TableCell>
                    <TableCell className="w-[210px] border-table">
                      tes
                    </TableCell>
                    <TableCell className="w-[220px] border-table">
                      test
                    </TableCell>
                  </TableRow>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TableCell>
      </TableBody>
    </Table>
  );
}

export default TableAllList;
