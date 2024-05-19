import { Box } from "@mantine/core";

import { useState } from "react";

import { BasicInfo } from "./BasicInfo";
import { RecipientInfo } from "./RecipientInfo";
import { ProductInfo } from "./ProductInfo";

export const Create = () => {
  const currentStep = localStorage.getItem("step") || 1;
  const [step, setStep] = useState(+currentStep);

  return (
    <Box>
      {step === 1 && <BasicInfo step={step} setStep={setStep} />}
      {step === 2 && <RecipientInfo step={step} setStep={setStep} />}
      {step === 3 && <ProductInfo step={step} setStep={setStep} />}
    </Box>
  );
};
