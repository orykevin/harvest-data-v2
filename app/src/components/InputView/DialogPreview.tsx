import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DataTextInterface } from "./TableView";
import { Expand } from "lucide-react";

interface DialogInterface {
  preview: string | ArrayBuffer;
}

function DialogPreview(props: DialogInterface) {
  return (
    <Dialog>
      <DialogTrigger style={{ textDecoration: "underline" }}>
        <Button size={"icon"} className=" absolute top-1 right-1">
          <Expand />
        </Button>
      </DialogTrigger>
      <DialogContent style={{ minWidth: "60vw", padding: "3rem 1rem" }}>
        {props.preview !== null && (
          <img
            src={props.preview}
            style={{
              minWidth: "52vw",
              maxHeight: "40vw",
              objectFit: "contain",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DialogPreview;
