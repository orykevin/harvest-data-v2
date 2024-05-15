import React, { useEffect, useState } from "react";
import "./Inputview.css";
import DragnDrop from "./DragnDrop";
import ImageForm from "./ImageForm";
import { valueProps } from "../ui/combobox";
import DialogConfirm from "./DialogConfirm";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import { getDateTimeZone } from "@/function/getDateTimeZone";
import { Progress } from "../ui/progress";

export interface FileInterface {
  // path: string | undefined;
  // lastModified: number;
  // lastModifiedDate: Date | undefined;
  // name: string;
  // size: number;
  // type: string;
  file: File;
  imageBuffer: any;
  client: valueProps | null;
}

interface propsInterface {
  inputMode: string;
  setInputMode: React.Dispatch<React.SetStateAction<string>>;
}

function Inputview(props: propsInterface) {
  const [allFile, setAllFile] = useState<FileInterface[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [progress, setProgress] = useState({
    started: false,
    percent: 0,
  });

  const [timeZone, setTimeZone] = useState("");
  const { toast } = useToast();

  const getTimeZone = () => {
    const timeZoneNow = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(timeZoneNow);
  };

  useEffect(() => {
    getTimeZone();
  }, []);

  useEffect(() => {
    setAllFile([]);
  }, [props.inputMode]);

  useEffect(() => {
    console.log(timeZone);
    if (timeZone !== "") {
      console.log(getDateTimeZone(1565012694034, timeZone));
    }
  }, [timeZone]);

  return (
    <>
      <h4 className="title-header">
        {props.inputMode === "img" ? "Image Uploader" : "Email Uploader"}
      </h4>

      <p></p>
      {allFile.length > 0 && !progress.started && (
        <DialogConfirm
          allFile={allFile}
          progress={progress}
          setProgress={setProgress}
          toast={toast}
          setAllFile={setAllFile}
          setSelected={setSelected}
          selected={selected}
          timeZone={timeZone}
          inputMode={props.inputMode}
        />
      )}
      {progress.started && (
        <Progress className="progress-bar-custom" value={progress.percent} />
      )}
      <div className="image-uploader-cont">
        <div className="form-container">
          <h1>Drag & drop File</h1>
          <DragnDrop
            allFile={allFile}
            setAllFile={setAllFile}
            selected={selected}
            setSelected={setSelected}
            inputMode={props.inputMode}
          />
        </div>
        <div className="form-container">
          <h1 className="">
            {props.inputMode === "img"
              ? "Preview & Edit Images"
              : "Edit Client on Email"}
          </h1>
          <ImageForm
            allFile={allFile}
            setAllFile={setAllFile}
            selected={selected}
            setSelected={setSelected}
            timeZone={timeZone}
            inputMode={props.inputMode}
          />
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default Inputview;
