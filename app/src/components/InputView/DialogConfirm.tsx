import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FileInterface } from "./Inputview";
import { postFile } from "@/function/getFetch";
import { progressInterface } from "@/function/getFetch";
import { Progress } from "../ui/progress";
import { useToast } from "../ui/use-toast";
import ipContext from "@/function/ipContext";

interface DialogInterface {
  allFile: FileInterface[];
  progress: progressInterface;
  setProgress: React.Dispatch<React.SetStateAction<progressInterface>>;
  toast: any;
  selected: null | number;
  setAllFile: React.Dispatch<React.SetStateAction<FileInterface[] | []>>;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  timeZone: string;
  inputMode: string;
}

interface infoDbInterface {
  affectedRows: number;
  changedRows: number;
  fieldCount: number;
  info: string;
  insertId: number;
  serverStatus: number;
  warningStatus: number;
}

function DialogConfirm(props: DialogInterface) {
  const { ipConfig } = useContext(ipContext);
  const [missFile, setMissFile] = useState<FileInterface[]>([]);

  const checkInfo = (
    obj: infoDbInterface
  ): string | { record: string; duplicate: string } | undefined => {
    if (obj.affectedRows == 0 && obj.info == "") {
      return "No File Uploaded !";
    } else if (obj.affectedRows == 1 && obj.info == "") {
      return "1 File Uploaded !";
    } else if (obj.info !== "") {
      let indexD = obj.info.indexOf("D");
      let indexW = obj.info.indexOf("W");
      console.log({
        record: obj.info.slice(0, indexD - 1),
        duplicate: obj.info.slice(indexD, indexW - 1),
      });
      return {
        record: obj.info.slice(0, indexD - 1),
        duplicate: obj.info.slice(indexD, indexW - 1),
      };
    }
  };
  const {toast} = useToast()

  useEffect(() => {
    const missArr = props.allFile.filter((file) => {
      return file.client === null;
    });
    setMissFile(missArr);
  }, [props.allFile]);

  const submitUploadHandler = () => {
    props.setProgress({ ...props.progress, started: true });
    let api =
      props.inputMode == "img"
        ? `http://${ipConfig}:3000/api/upload-image`
        : `http://${ipConfig}:3000/api/upload-email`;
    postFile(api, props.allFile, props.progress, props.setProgress)
      .then((res) => {
        toast({
          title:
            props.inputMode == "img" ? "Image Uploaded !" : "Email Uploaded !",
          description: (
            <div>
              <h1 style={{ fontWeight: "600" }}>
                {typeof checkInfo(res) === "string"
                  ? checkInfo(res)
                  : checkInfo(res)?.record}
              </h1>
              <h1 className="text-red-600" style={{ fontWeight: "600" }}>
                {typeof checkInfo(res) === "string"
                  ? ""
                  : checkInfo(res)?.duplicate}
              </h1>
              <h1></h1>
            </div>
          ),
        });
        props.setAllFile([]);
        props.setSelected(null);
        props.setProgress({ started: false, percent: 0 });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog>
      <DialogTrigger className="submit-btn">
        <Button>{`Upload ${props.allFile.length} ${
          props.allFile.length === 1 ? "file" : "files"
        }`}</Button>
      </DialogTrigger>
      <DialogContent style={{ minWidth: "30vw" }}>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        {missFile.length > 0 && (
          <div>
            <h1>
              Founded {missFile.length}{" "}
              {missFile.length === 1 ? "file" : "files"} with no client assigned
            </h1>
            {missFile.length < 5 &&
              missFile.map((miss) => {
                return <h1 className=" bold text-red-700">{miss.file.name}</h1>;
              })}
          </div>
        )}
        {missFile.length > 0 ? (
          <h1>
            Do you still want to upload {props.allFile.length}{" "}
            {props.allFile.length === 1 ? "file" : "files"}?
          </h1>
        ) : (
          <h1>
            Do you want to upload {props.allFile.length}{" "}
            {props.allFile.length === 1 ? "file" : "files"}?
          </h1>
        )}
        <DialogClose
          style={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            gap: "12px",
          }}
        >
          <Button variant={"destructive"} className="w-[100px]">
            Cancel
          </Button>
          <Button className="w-[100px]" onClick={submitUploadHandler}>
            Confirm
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default DialogConfirm;
