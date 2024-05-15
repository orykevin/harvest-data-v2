import React from "react";
import "./Inputbar.css";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";

interface propsInterface {
  inputMode: string;
  setInputMode: React.Dispatch<React.SetStateAction<string>>;
}

function Inputbar(props: propsInterface) {
  return (
    <div className="input-bar-container">
      <div className="input-file">
        <Label className="input-title">Image Uploader</Label>
        <Button
          onClick={() => props.setInputMode("img")}
          style={{ background: props.inputMode == "img" ? "#2196f3" : "" }}
        >
          {" "}
          Open Image Uploader{" "}
        </Button>
        <Label className="input-title">Email Uploader</Label>
        <Button
          onClick={() => props.setInputMode("eml")}
          style={{ background: props.inputMode == "eml" ? "#2196f3" : "" }}
        >
          {" "}
          Open Email Uploader{" "}
        </Button>
      </div>
    </div>
  );
}

export default Inputbar;
