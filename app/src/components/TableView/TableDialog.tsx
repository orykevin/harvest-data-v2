import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataPhotoInterface, DataTextInterface } from "./TableView";
import heic2any from "heic2any";
import { bufferImage } from "@/function/imageBuffer";
import { buffer } from "stream/consumers";
import { Skeleton } from "../ui/skeleton";

interface DialogInterface {
  data: DataTextInterface | DataPhotoInterface;
}

function TableDialog(props: DialogInterface) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getExt = (str: string | null) => {
    const re = /(?:\.([^.]+))?$/;
    if (str !== null) {
      console.log(re.exec(str));
      return re.exec(str);
    } else return "";
  };

  const convertToPng = async (heicfile: File) => {
    heic2any({
      blob: heicfile,
      toType: "image/png",
      quality: 0.1,
    })
      .then((res) => {
        const url = URL.createObjectURL(res);
        setPreview(url);
        //setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const fetchAndConvertFile = async (file: string) => {
    setLoading(true);
    fetch(file)
      .then((res) => res.blob())
      .then((blob) =>
        heic2any({
          blob,
          toType: "image/jpeg",
          quality: 0.5, // cuts the quality and size by half
        })
      )
      .then((conversionResult) => {
        // conversionResult is a BLOB
        // of the JPEG formatted image
        // with low quality
        console.log(conversionResult);
        const url = URL.createObjectURL(conversionResult);
        setLoading(false);
        setPreview(url);
      })
      .catch((e) => {
        // see error handling section
        console.log(e);
      });
  };

  useEffect(() => {
    setPreview(null);
    let ext = getExt(props.data.filename)[1];
    if (ext === "HEIC") {
      setLoading(true);
      fetchAndConvertFile(`images/${props.data.filename}`);
    } else {
      setPreview(`./images/${props.data.filename}`);
    }
  }, [props.data]);

  return (
    <Dialog>
      <DialogTrigger style={{ textDecoration: "underline" }}>
        <img src={preview} className="w-[100px]" />
      </DialogTrigger>
      <DialogContent style={{ minWidth: "55vw" }}>
        <DialogHeader>
          <DialogTitle>{props.data.filename}</DialogTitle>
        </DialogHeader>
        <img
          src={preview} //{`./images/${props.data.filename}`}
          style={{
            minWidth: "50vw",
            maxHeight: "38vw",
            objectFit: "contain",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TableDialog;
