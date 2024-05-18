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

    setStep(step + 1);
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
