import "../assets/style.css";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  NumberFormatter,
  NumberInput,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export const ProductInfo = ({ setStep }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const storedProductInfo = localStorage.getItem("productInfo");

    if (storedProductInfo) {
      const productInfo = storedProductInfo
        ? JSON.parse(storedProductInfo)
        : {};

      setItems(productInfo);
    }
  }, [setItems]);

  const form = useForm({
    initialValues: {
      name: "",
      quantity: 0,
      rate: 0,
      subtotal: 0,
      createdAt: null,
    },

    validate: {},
  });

  const formEdit = useForm({
    initialValues: {
      id: "",
      name: "",
      quantity: 0,
      rate: 0,
      subtotal: 0,
      createdAt: null,
    },

    validate: {},
  });

  const handleSubmit = (values) => {
    setLoading(true);

    values.id = `${values.name}-${new Date().getTime()}`;
    values.subtotal = values.quantity * values.rate;
    values.createdAt = new Date();

    let currentItems = JSON.parse(localStorage.getItem("productInfo")) || [];
    currentItems.push(values);
    currentItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    setItems(currentItems);

    localStorage.setItem("productInfo", JSON.stringify(currentItems));

    setLoading(false);

    close();
  };

  const handleSubmitEdit = (values) => {
    setLoading(true);

    let currentItems = JSON.parse(localStorage.getItem("productInfo")) || [];
    currentItems = currentItems.filter((item) => item.id !== values.id);

    currentItems.push(values);
    currentItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    setItems(currentItems);

    localStorage.setItem("productInfo", JSON.stringify(currentItems));

    setLoading(false);

    closeEdit();
  };

  const handleRemove = () => {
    setLoading(true);

    if (selectedId) {
      let currentItems = JSON.parse(localStorage.getItem("productInfo")) || [];
      currentItems = currentItems.filter((item) => item.id !== selectedId);

      currentItems.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setItems(currentItems);

      localStorage.setItem("productInfo", JSON.stringify(currentItems));
    }

    setLoading(false);

    closeEdit();
  };

  const rows = items.map((item, index) => (
    <Table.Tr
      key={`${item.name}-${index}`}
      className="hoverable"
      onClick={() => {
        formEdit.setValues(item);
        setSelectedId(item.id);
        openEdit();
      }}
      style={{ fontSize: 12 }}
    >
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>
        {
          <NumberFormatter
            prefix="Rp"
            thousandSeparator="."
            decimalSeparator=","
            value={item.rate}
          />
        }
      </Table.Td>
      <Table.Td>
        {
          <NumberFormatter
            prefix="Rp"
            thousandSeparator="."
            decimalSeparator=","
            value={item.subtotal}
          />
        }
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Title order={3}>Products</Title>
      <Title order={6} c="dimmed" mb={20}>
        Add products to invoice.
      </Title>
      <Table>
        <Table.Thead style={{ background: "#ECECEC" }}>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Rate</Table.Th>
            <Table.Th>Subtotal</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {items.length > 0 && (
        <Group
          mt={10}
          justify="flex-end"
          p={7}
          style={{ background: "#ECECEC" }}
        >
          <Text size="sm" fw={700}>
            Grand Total
          </Text>
          <Text size="sm" fw={700}>
            {items.length > 0 ? (
              <NumberFormatter
                prefix="Rp"
                thousandSeparator="."
                decimalSeparator=","
                value={items.reduce((prev, next) => {
                  return prev + next.subtotal;
                }, 0)}
              />
            ) : (
              0
            )}
          </Text>
        </Group>
      )}
      <Group justify="flex-end" mt="md" grow>
        <Button
          loading={loading}
          onClick={() => {
            localStorage.setItem("step", 2);
            setStep(2);
          }}
          variant="light"
          color="red"
        >
          Back
        </Button>
        <Button loading={loading} onClick={open} color="red">
          Add Item
        </Button>
      </Group>
      <Divider my={20} />
      <Button
        disabled={!items || items?.length === 0}
        loading={loading}
        onClick={open}
        color="red"
        fullWidth
      >
        Generate Invoice
      </Button>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={opened}
        onClose={close}
      >
        <Container size="xs">
          <Title order={3}>Item</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={6} c="dimmed">
              Add item information.
            </Title>
            <TextInput
              my={10}
              withAsterisk
              label="Name"
              placeholder="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />

            <NumberInput
              withAsterisk
              label="Quantity"
              placeholder="Quantity"
              key={form.key("quantity")}
              {...form.getInputProps("quantity")}
            />

            <NumberInput
              leftSection={<Text size="xs">Rp</Text>}
              withAsterisk
              label="Rate"
              placeholder="Rate"
              key={form.key("rate")}
              {...form.getInputProps("rate")}
            />
            <Button
              mt={20}
              loading={loading}
              type="submit"
              color="red"
              fullWidth
            >
              Add Item
            </Button>
          </form>
        </Container>
      </Drawer>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={openedEdit}
        onClose={closeEdit}
      >
        <Container size="xs">
          <Title order={3}>Item</Title>
          <form onSubmit={formEdit.onSubmit(handleSubmitEdit)}>
            <Title order={6} c="dimmed">
              Update item information.
            </Title>
            <TextInput
              my={10}
              withAsterisk
              label="Name"
              placeholder="Name"
              key={formEdit.key("name")}
              {...formEdit.getInputProps("name")}
            />

            <NumberInput
              withAsterisk
              label="Quantity"
              placeholder="Quantity"
              key={formEdit.key("quantity")}
              {...formEdit.getInputProps("quantity")}
            />

            <NumberInput
              leftSection={<Text size="xs">Rp</Text>}
              withAsterisk
              label="Rate"
              placeholder="Rate"
              key={formEdit.key("rate")}
              {...formEdit.getInputProps("rate")}
            />
            <Group grow>
              <Button
                variant="light"
                mt={20}
                loading={loading}
                color="red"
                onClick={handleRemove}
              >
                Remove
              </Button>
              <Button mt={20} loading={loading} type="submit" color="red">
                Update
              </Button>
            </Group>
          </form>
        </Container>
      </Drawer>
    </Box>
  );
};
