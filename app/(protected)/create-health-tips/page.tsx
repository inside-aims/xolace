import React from "react";
import HealthTipForm from "@/components/forms/HealthTipsForm";

const CreateHealthTip = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Add Health Tip</h1>

      <div className="mt-9 mx-2">
        <HealthTipForm />
      </div>
    </>
  );
};

export default CreateHealthTip;
