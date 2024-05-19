import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  FileButton,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useRef, useState } from "react";

import { IoMdClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
export const BasicInfo = ({ step, setStep }) => {
  const resetRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const storedBasicInfo = localStorage.getItem("basicInfo");
  const basicInfo = storedBasicInfo ? JSON.parse(storedBasicInfo) : {};

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: basicInfo.name,
      phone: basicInfo.phone,
      photo: basicInfo.photo,
      photoURL: basicInfo.photoURL,
      address: basicInfo.address,
      bank: basicInfo.bank,
      bankNumber: basicInfo.bankNumber,
      accountName: basicInfo.accountName,
    },

    validate: {},
  });

  const handleFileChange = (file) => {
    if (file) {
      form.setValues({ photo: file.name });

      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValues({ photoURL: e.target.result });
      };

      reader.readAsDataURL(file);
    } else {
      form.setValues({ photo: "", photoURL: "" });
    }
  };

  const clearFile = () => {
    form.setValues({ photo: "", photoURL: "" });
    resetRef.current?.();
  };

  const handleSubmit = (values) => {
    setLoading(true);

    localStorage.setItem("basicInfo", JSON.stringify(values));

    const next = step + 1;
    localStorage.setItem("step", next);
    setStep(next);
    setLoading(false);
  };

  return (
    <Box>
      <Title order={3}>Basic Information</Title>
      <Box>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={6} c="dimmed">
            Fill your company information.
          </Title>
          <Divider my={10} />
          {form.getValues().photo && form.getValues().photoURL && (
            <Avatar src={form.getValues().photoURL} size={100} my={10} />
          )}
          <Group>
            <FileButton
              resetRef={resetRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button variant="filled" color="red" size="xs" {...props}>
                  Upload Logo
                </Button>
              )}
            </FileButton>
            <Group>
              <Text size="xs" c="dimmed">
                {form.getValues().photo
                  ? form.getValues().photo.length > 18
                    ? form.getValues().photo.slice(0, 15) + "..."
                    : form.getValues().photo
                  : "No file selected"}
              </Text>
              {form.getValues().photo && form.getValues().photoURL && (
                <ActionIcon onClick={clearFile} size="xs" variant="default">
                  <IoMdClose size="10px" />
                </ActionIcon>
              )}
            </Group>
          </Group>
          <Text mt={20} fw={700} c="dimmed" size="xs">
            Information
          </Text>
          <Divider mb={10} />
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

          <Text mt={20} fw={700} c="dimmed" size="xs">
            Bank Account
          </Text>
          <Divider mb={10} />

          <TextInput
            my={10}
            withAsterisk
            label="Bank"
            placeholder="Bank"
            key={form.key("bank")}
            {...form.getInputProps("bank")}
          />

          <TextInput
            my={10}
            withAsterisk
            label="Bank Number"
            placeholder="Bank Number"
            key={form.key("bankNumber")}
            {...form.getInputProps("bankNumber")}
          />

          <TextInput
            my={10}
            withAsterisk
            label="Account Name"
            placeholder="Account Name"
            key={form.key("accountName")}
            {...form.getInputProps("accountName")}
          />

          <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit" color="red" fullWidth>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
};
