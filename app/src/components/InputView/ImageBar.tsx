import React from "react";
import { FileInterface } from "./Inputview";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FileEdit, Trash2 } from "lucide-react";
import { formatBytes } from "@/function/getFormatByte";

interface PropsInterface {
  file: FileInterface;
  index: number;
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  deleteHandler: any;
}

function ImageBar(props: PropsInterface) {
  return (
    <div>
      <Card
        className="m-2 relative"
        style={{
          background:
            props.selected === props.index
              ? "#ececec"
              : props.file.client == null
              ? "#ffe2e2"
              : "white",
        }}
      >
        <CardContent className="flex px-4 py-2 relative justify-between card-content">
          <div>
            <h1 className="card-file-name">{props.file.file.name}</h1>
            <span className="card-file-size">
              {formatBytes(props.file.file.size)}
            </span>
          </div>
          <div className="card-button-cont">
            <Button
              size={"icon"}
              onClick={() => {
                props.setSelected(props.index);
              }}
              className="btn-comp"
            >
              <FileEdit className="card-btn-edit" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => {
                console.log("deleted");
                props.deleteHandler(props.index);
              }}
              className="btn-comp"
            >
              <Trash2 className=" card-btn-delete" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImageBar;
