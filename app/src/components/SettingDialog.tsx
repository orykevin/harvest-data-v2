import { useState, useContext } from "react";
import settingIcon from "../../public/settings.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ipContext from "@/function/ipContext";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

function SettingDialog() {
  const { ipConfig, setIpConfig } = useContext(ipContext);

  return (
    <Dialog>
      <DialogTrigger className="icon-setting">
        <img src={settingIcon} alt="" />
      </DialogTrigger>
      <DialogContent style={{ minWidth: "55vw" }} >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex">
          <Label htmlFor="ip" style={{ padding: "12px" }}>
            IP
          </Label>
          <Input
            type="text"
            id="ip"
            placeholder="Input Custom IP"
            value={ipConfig}
            onChange={(e) => setIpConfig(e.target.value)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingDialog;
