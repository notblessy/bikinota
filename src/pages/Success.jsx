import { Box, Button, Group, Image, Text } from "@mantine/core";

import mail from "/mail.png";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const Success = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    localStorage.removeItem("productInfo");
    localStorage.removeItem("recipientInfo");
    localStorage.setItem("step", 2);

    navigate("/create");
  };

  return (
    <Box style={{ height: "calc(100vh - 150px)" }}>
      <Box px={30} mt={100} style={{ textAlign: "center" }}>
        <Image mb={10} h={150} fit="contain" src={mail} />
        <Text size="lg" fw={700} c="#E6E6E6">
          Generate Success
        </Text>
        <Group mt={20} grow>
          <Button variant="light" onClick={() => navigate("/create")}>
            Back
          </Button>
          <Button onClick={handleCreateNew}>Create New</Button>
        </Group>
      </Box>
    </Box>
  );
};
