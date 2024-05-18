import "@mantine/core/styles.css";

import { Anchor, Box, Button, Container, Grid, Group } from "@mantine/core";

import { MdReceipt } from "react-icons/md";
import { Route, Routes } from "react-router-dom";
import { Create } from "./pages/Create";

function App() {
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
          <Routes>
            <Route path="/" element={<Create />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
