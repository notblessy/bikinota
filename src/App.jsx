import "@mantine/core/styles.css";

import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  FileButton,
  Grid,
  Group,
  TextInput,
  Title,
} from "@mantine/core";

import { MdReceipt } from "react-icons/md";
import { useForm } from "@mantine/form";
import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      companyLogo: "",
      companyName: "",
      adminName: "",
    },

    validate: {},
  });

  return (
    <Container size="xs">
      <Grid>
        <Grid.Col span={12}>
          <Box style={{ borderBottom: "1px solid #DEE2E6", padding: 10 }}>
            <Group justify="space-between">
              <MdReceipt color="#ED191B" size="30px" />
              <Group justify="flex-end">
                <Anchor style={{ color: "#0D0D0D" }}>Home</Anchor>
                <Anchor style={{ color: "#0D0D0D" }}>About</Anchor>
                <Button color="red" variant="light">
                  Sign Up
                </Button>
              </Group>
            </Group>
          </Box>
        </Grid.Col>
        <Grid.Col span={12}>
          <Box>
            <Title order={3} mb={20}>
              Invoice
            </Title>
            <Box>
              <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Title order={6} c="dimmed">
                  Basic Information
                </Title>
                <Divider my={10} />
                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                  {(props) => (
                    <Button variant="filled" color="red" size="xs" {...props}>
                      Upload Logo
                    </Button>
                  )}
                </FileButton>
                <TextInput
                  mt={10}
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
                <Divider mb={20} />

                <Title order={6} c="dimmed">
                  Bill To
                </Title>
                <Divider my={10} />
                <TextInput
                  withAsterisk
                  label="Bill Name"
                  placeholder="Bill Name"
                  key={form.key("billName")}
                  {...form.getInputProps("billName")}
                />

                <TextInput
                  withAsterisk
                  label="Bill Phone"
                  placeholder="Bill Phone"
                  key={form.key("billPhone")}
                  {...form.getInputProps("billPhone")}
                />

                <Group justify="flex-end" mt="md">
                  <Button type="submit" color="red" fullWidth>
                    Submit
                  </Button>
                </Group>
              </form>
            </Box>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
