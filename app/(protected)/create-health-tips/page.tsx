import React from "react";
import { Metadata } from "next";
import HealthTipForm from "@/components/forms/HealthTipsForm";

export const metadata: Metadata = {
  title: 'Create Health Tip',
  description: "Create and share your health tip with a caring community offering support, advice, and encouragement for mental wellness and personal growth."
};

const CreateHealthTip = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold mt-3 text-dark100_light900">Add Health Tip</h1>

      <div className="mt-9 mx-2">
        <HealthTipForm />
      </div>
    </>
  );
};

export default CreateHealthTip;
