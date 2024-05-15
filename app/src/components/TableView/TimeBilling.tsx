import React from "react";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";

function TimeBilling() {
  return (
    <div className="input-time-container">
      <div>
        <h4>Create Time Billing</h4>
        <span>07/ 07 / 2023</span>
      </div>
      <Input />
      <Combobox  />
    </div>
  );
}

export default TimeBilling;
