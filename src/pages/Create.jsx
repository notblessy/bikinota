import { Avatar, Box, Divider, Group, Text, Title } from "@mantine/core";

import { useEffect, useState } from "react";

import { BasicInfo } from "./BasicInfo";

export const Create = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const basicInfo = localStorage.getItem("basicInfo");
    if (basicInfo) {
      setStep(2);
    }
  }, [step]);

  return (
    <Box>
      {step === 1 && <BasicInfo step={step} setStep={setStep} />}
      {step === 2 && (
        <Box>
          <Title order={1}>Step 2: Additional Information</Title>
          <Divider />
          <Group>
            <Avatar src={localStorage.getItem("basicInfo").photoURL} />
            <Box>
              <Text>{localStorage.getItem("basicInfo").name}</Text>
              <Text>{localStorage.getItem("basicInfo").phone}</Text>
              <Text>{localStorage.getItem("basicInfo").address}</Text>
            </Box>
          </Group>
        </Box>
      )}
    </Box>
  );
};
