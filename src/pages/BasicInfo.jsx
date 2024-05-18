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
import { useEffect, useRef, useState } from "react";

import { IoMdClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
export const BasicInfo = ({ step, setStep }) => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const resetRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      phone: "",
      photo: "",
      address: "",
    },

    validate: {},
  });

  useEffect(() => {
    const basicInfo = localStorage.getItem("basicInfo");
    if (basicInfo) {
      const value = JSON.parse(basicInfo);

      form.setValues({
        name: value.name,
        phone: value.phone,
        address: value.address,
        photo: value.photo,
        photoURL: value.photoURL,
      });

      setStep(2);
    }
  }, [form, setStep]);

  const handleFileChange = (file) => {
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileURL(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      setFileURL("");
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileURL(null);
    resetRef.current?.();
  };

  const handleSubmit = (values) => {
    setLoading(true);

    if (file) {
      values.photo = file.name;
      values.photoURL = fileURL;
    }

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
          {file && fileURL && <Avatar src={fileURL} size={100} my={10} />}
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
                {file
                  ? file.name.length > 18
                    ? file.name.slice(0, 15) + "..."
                    : file.name
                  : "No file selected"}
              </Text>
              {file && fileURL && (
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
