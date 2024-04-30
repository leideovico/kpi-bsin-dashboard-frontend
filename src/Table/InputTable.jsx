import React from "react";
import "../Styles/styles.css";
import SafetyTable from "./SafetyTable.jsx";
import EnvironmentTable from "./EnvironmentTable.jsx";
import QualityTable from "./QualityTable.jsx";
import CostTable from "./CostTable.jsx";
import DeliveryTable from "./DeliveryTable.jsx";

const InputTable = () => {
  return (
    <div className="input-table-container">
      <SafetyTable />
      <EnvironmentTable />
      <QualityTable />
      <CostTable />
      <DeliveryTable />
    </div>
  );
};

export default InputTable;
