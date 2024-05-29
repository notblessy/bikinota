import { Box, Button, Group, TextInput, Textarea, Title } from "@mantine/core";

import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const RecipientInfo = ({ step, setStep }) => {
  const [loading, setLoading] = useState(false);

  const storedRecipientInfo = localStorage.getItem("recipientInfo");
  const recipientInfo = storedRecipientInfo
    ? JSON.parse(storedRecipientInfo)
    : {};

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: recipientInfo.name,
      phone: recipientInfo.phone,
      address: recipientInfo.address,
    },

    validate: {},
  });

  const handleSubmit = (values) => {
    setLoading(true);

    if (!values.name || !values.phone) {
      setLoading(false);

      notifications.show({
        title: "Empty form",
        message: "Name or phone cannot be empty",
        color: "red",
      });

      return;
    }

    localStorage.setItem("recipientInfo", JSON.stringify(values));

    const next = step + 1;
    localStorage.setItem("step", next);
    setStep(next);

    setLoading(false);
  };

  return (
    <Box>
      <Title order={3}>Recipient Information</Title>
      <Box>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={6} c="dimmed">
            Fill recipient information.
          </Title>
          <TextInput
            my={10}
            withAsterisk
            label="Name"
            placeholder="Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <TextInput
            withAsterisk
            label="Phone"
            placeholder="Phone"
            key={form.key("phone")}
            {...form.getInputProps("phone")}
          />

          <Textarea
            mt={10}
            label="Address"
            placeholder="Address (optional)"
            key={form.key("address")}
            {...form.getInputProps("address")}
          />

          <Group justify="flex-end" mt="md" grow>
            <Button
              loading={loading}
              onClick={() => {
                localStorage.setItem("step", 1);
                setStep(1);
              }}
              variant="light"
              color="red"
            >
              Back
            </Button>
            <Button loading={loading} type="submit" color="red">
              Next
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
};
