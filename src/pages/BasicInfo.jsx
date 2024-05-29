import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FileButton,
  Group,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Compressor from "compressorjs";
import { useEffect, useRef, useState } from "react";

import { IoMdClose } from "react-icons/io";

const generateRandomID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  const timestamp = new Date().getTime();
  return result + timestamp;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024;

// eslint-disable-next-line react/prop-types
export const BasicInfo = ({ step, setStep }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const resetRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  const storedBasicInfo = localStorage.getItem("basicInfo");
  const basicInfo = storedBasicInfo ? JSON.parse(storedBasicInfo) : {};

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("additionalNotes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

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

  const formNotes = useForm({
    mode: "uncontrolled",
    initialValues: {
      notes: "",
    },

    validate: {},
  });

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        notifications.show({
          title: "File size is too large",
          message: "Cannot upload file larger than 1MB",
          color: "red",
        });

        resetRef.current?.();
        return;
      }

      form.setValues({ photo: file.name });

      new Compressor(file, {
        quality: 0.2,
        success(result) {
          const reader = new FileReader();
          reader.onload = (e) => {
            form.setValues({ photoURL: e.target.result });
          };

          reader.readAsDataURL(result);
        },
        error(err) {
          console.log(err.message);
        },
      });
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

  const handleSubmitNotes = (values) => {
    setLoading(true);

    values.id = generateRandomID();
    values.createdAt = new Date();

    let savedNotes = JSON.parse(localStorage.getItem("additionalNotes"));
    if (savedNotes) {
      savedNotes.push(values);
      savedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setNotes(savedNotes);
    } else {
      savedNotes = [values];
      setNotes([values]);
    }

    localStorage.setItem("additionalNotes", JSON.stringify(savedNotes));

    formNotes.reset();
    setLoading(false);
  };

  const handleRemoveNotes = (id) => {
    setLoading(true);

    let savedNotes = JSON.parse(localStorage.getItem("additionalNotes"));
    savedNotes = savedNotes.filter((note) => note.id !== id);
    setNotes(savedNotes);

    localStorage.setItem("additionalNotes", JSON.stringify(savedNotes));

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

          <Group justify="flex-end" mt="md" grow>
            <Button loading={loading} onClick={open} variant="light">
              Additional Notes
            </Button>
            <Button loading={loading} type="submit" color="red">
              Submit
            </Button>
          </Group>
        </form>
      </Box>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Container size="xs">
          <Title order={3}>Additional Notes</Title>
          <form onSubmit={formNotes.onSubmit(handleSubmitNotes)}>
            <Title order={6} c="dimmed" mb={20}>
              Fill if you have additional notes.
            </Title>

            {notes &&
              notes.length > 0 &&
              notes.map((note) => (
                <Box mb={20} key={note.id} style={{ position: "relative" }}>
                  <Text
                    size="xs"
                    c="#8B8B8B"
                    style={{
                      background: "#F5F5F5",
                      padding: "10px 15px",
                      borderRadius: 5,
                    }}
                  >
                    {note.notes}
                  </Text>
                  <Anchor
                    className="closeButton"
                    underline="none"
                    onClick={() => handleRemoveNotes(note.id)}
                  >
                    X
                  </Anchor>
                </Box>
              ))}

            <Textarea
              mt={20}
              withAsterisk
              label="Notes"
              placeholder="Notes"
              key={formNotes.key("notes")}
              {...formNotes.getInputProps("notes")}
            />

            <Group my={10} justify="flex-end" mt="md" grow>
              <Button loading={loading} variant="light" onClick={close}>
                Dismiss
              </Button>
              <Button loading={loading} type="submit">
                Add Notes
              </Button>
            </Group>
          </form>
        </Container>
      </Drawer>
    </Box>
  );
};
