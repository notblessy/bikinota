import { Box } from "@mantine/core";

import { useState } from "react";

import { BasicInfo } from "./BasicInfo";
import { RecipientInfo } from "./RecipientInfo";

export const Create = () => {
  const [step, setStep] = useState(1);

  return (
    <Box>
      {step === 1 && <BasicInfo step={step} setStep={setStep} />}
      {step === 2 && <RecipientInfo step={step} setStep={setStep} />}
    </Box>
  );
};
