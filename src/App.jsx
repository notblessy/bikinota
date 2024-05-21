import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/tiptap/styles.css";

import {
  Anchor,
  Box,
  Button,
  Container,
  Grid,
  Group,
  HoverCard,
  Text,
} from "@mantine/core";

import { MdReceipt } from "react-icons/md";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Create } from "./pages/Create";
import { Success } from "./pages/Success";
import LandingPage from "./pages/LandingPage";

function App() {
  const navigate = useNavigate();
  return (
    <Container size="xs">
      <Grid>
        <Grid.Col span={12}>
          <Box
            style={{
              borderBottom: "1px solid #DEE2E6",
              padding: 10,
              background: "#FFF",
            }}
          >
            <Group justify="space-between">
              <MdReceipt color="#ED191B" size="30px" />
              <Group justify="flex-end">
                <Anchor
                  style={{ color: "#0D0D0D" }}
                  onClick={() => navigate("/")}
                >
                  Home
                </Anchor>
                <Anchor style={{ color: "#0D0D0D" }}>About</Anchor>
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>
                    <Button color="red" variant="light">
                      Sign Up
                    </Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm" fw={600}>
                      COMING SOON!
                    </Text>
                    <Text size="sm">
                      Sign up to store your invoices history.
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            </Group>
          </Box>
        </Grid.Col>
        <Grid.Col span={12}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<Create />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
