import React, { useEffect, useState } from "react";
import { FileInterface } from "./Inputview";
import { formatBytes } from "@/function/getFormatByte";
import format from "date-fns/format";
import { Label } from "@radix-ui/react-label";
import { Combobox } from "../ui/combobox";
import { valueProps } from "../ui/combobox";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { Mail } from "lucide-react";
import DialogPreview from "./DialogPreview";
import heic2any from "heic2any";
import { Skeleton } from "../ui/skeleton";
import { getDateTimeZone } from "@/function/getDateTimeZone";

interface PropsInterface {
  allFile: FileInterface[] | [];
  setAllFile: React.Dispatch<React.SetStateAction<FileInterface[] | []>>;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  timeZone: string;
  inputMode: string;
}

function ImageForm(props: PropsInterface) {
  const [client, setClient] = useState<valueProps | null>(null);
  const [preview, setPreview] = useState<ArrayBuffer | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const convertToPng = async (heicfile: File) => {
    console.log(heicfile);
    //setLoading(true);
    heic2any({
      blob: heicfile,
      toType: "image/png",
      quality: 0.1,
    })
      .then((res) => {
        const url = URL.createObjectURL(res);
        // console.log(url);
        // const img = new Image();
        // img.src = url;

        // img.onload = function () {
        //   const metadata = img.exifdata;
        //   console.log(metadata);
        // };
        console.log("rendered");
        setPreview(url);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const applyAllHandler = async () => {
    let newFiles = props.allFile.map((file) => {
      return {
        ...file,
        client: client,
      };
    });
    console.log(newFiles);
    props.setAllFile([...newFiles]);
  };

  const applyOneHandler = () => {
    let newFiles = props.allFile;
    if (props.selected !== null) {
      newFiles[props.selected].client = client;
    }
    console.log(newFiles);
    props.setAllFile([...newFiles]);
  };

  useEffect(() => {
    if (props.selected !== null) {
      if (props.allFile[props.selected].client !== null) {
        console.log("selected" + props.allFile[props.selected].client?.name);
        setClient(props.allFile[props.selected].client);
      }
      if (props.allFile[props.selected].file.type === "image/heic") {
        convertToPng(props.allFile[props.selected].file)
          .then((res) => {
            console.log("Uploading");
            setLoading(true);
          })
          .catch((err) => console.log(err));
      } else {
        setLoading(false);
        setPreview(props.allFile[props.selected].imageBuffer);
      }
    } else {
      console.log("reseted");
    }
  }, [props.selected]);

  return (
    <div>
      {props.selected !== null && props.allFile.length > 0 ? (
        <>
          <div className="image-viewer-cont">
            <div className="image-preview-cont">
              {props.inputMode === "img" ? (
                <div>
                  {loading ? (
                    <Skeleton className=" w-[100%] h-[32vh]" />
                  ) : (
                    <img src={preview} alt="" />
                  )}
                  <DialogPreview preview={preview} />
                </div>
              ) : (
                <div className="email-display-cont">
                  <Mail className="w-[100%]" size={56} />
                  <h1 className=" mt-3">Cannot Preview the Email</h1>
                </div>
              )}
              <h1>
                {props.selected !== null &&
                  props.allFile[props.selected].file.name}
              </h1>
              <p>{formatBytes(props.allFile[props.selected].file.size)}</p>
              <p>
                {props.selected !== null &&
                  format(
                    getDateTimeZone(
                      props.allFile[props.selected].file.lastModified,
                      props.timeZone
                    ),
                    "dd LLLL uuuu kk:mm"
                  )}
              </p>
            </div>
            <div className="form-edit-image">
              <h1>Edit Info</h1>
              <div className="flex gap-4 my-2">
                <Label className=" m-[6px] w-[100px]">Client : </Label>
                <Combobox
                  setClient={setClient}
                  client={
                    props.selected !== null
                      ? props.allFile[props.selected].client
                      : null
                  }
                  selected={props.selected}
                />
              </div>
              <div className="form-apply-button">
                <Button
                  style={{ width: "50%" }}
                  onClick={applyOneHandler}
                  disabled={client == null ? true : false}
                >
                  Apply on this file
                </Button>
                <Button
                  style={{ width: "50%" }}
                  onClick={applyAllHandler}
                  disabled={client == null ? true : false}
                >
                  Apply on All files
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="image-viewer-cont h-[74vh] mt-4">
          <h1 className="preview-no-selected">
            Select / Edit the file to{" "}
            {props.inputMode === "img"
              ? "Preview the Images"
              : "Edit The Client Email"}
          </h1>
        </div>
      )}
    </div>
  );
}

export default ImageForm;
