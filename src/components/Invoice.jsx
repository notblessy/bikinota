import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  NumberFormatter,
  Table,
  Text,
} from "@mantine/core";

const generateInvoice = (name) => {
  let threeLetterName;

  if (name.includes(".")) {
    const parts = name.split(".");
    threeLetterName = parts[parts.length - 1].slice(0, 3).toUpperCase();
  } else {
    threeLetterName = name.slice(0, 3).toUpperCase();
  }

  const utcTimestamp = Date.now();
  const lastFourDigits = utcTimestamp.toString().slice(-4);

  const randomInt = Math.floor(100 + Math.random() * 90);

  const invoiceNumber = `${threeLetterName}-${lastFourDigits}-${randomInt}`;

  return invoiceNumber;
};

// eslint-disable-next-line react/prop-types
export const Invoice = ({ back }) => {
  const basicInfo = JSON.parse(localStorage.getItem("basicInfo"));
  const recipientInfo = JSON.parse(localStorage.getItem("recipientInfo"));
  const productInfo = JSON.parse(localStorage.getItem("productInfo"));

  const rows = productInfo.map((item, index) => (
    <Table.Tr key={`${item.name}-${index}`}>
      <Table.Td>{index + 1}</Table.Td>
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
    <Box p={20} style={{ overflow: "auto", minWidth: "50rem" }}>
      <Group justify="space-between">
        <Group>
          <Avatar src={basicInfo.photoURL} size={70} my={10} />
          <Box>
            <Text size="sm" fw={700}>
              {basicInfo.name}
            </Text>
            <Text size="xs" c="dimmed">
              {basicInfo.phone}
            </Text>
            <Text size="xs" c="dimmed">
              {basicInfo.address}
            </Text>
          </Box>
        </Group>
        <Box style={{ textAlign: "right" }}>
          <Text size="lg" fw={700}>
            INVOICE
          </Text>
          <Text size="xs">{generateInvoice(basicInfo.name)}</Text>
          <Text size="xs" c="dimmed">
            24 January 2024
          </Text>
        </Box>
      </Group>
      <Divider my={10} />
      <Box mt={20}>
        <Text size="sm" fw={700} c="dimmed">
          Invoice To
        </Text>
        <Text size="sm" fw={700}>
          {recipientInfo.name}
        </Text>
        <Text size="sm">{recipientInfo.phone}</Text>
        <Text size="sm" c="dimmed">
          {recipientInfo.address}
        </Text>
      </Box>
      <Box mt={20}>
        <Table>
          <Table.Thead style={{ background: "#ECECEC" }}>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Item</Table.Th>
              <Table.Th>Qty</Table.Th>
              <Table.Th>Rate</Table.Th>
              <Table.Th>Subtotal</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Box>
      <Group mt={20} justify="space-between" p={7}>
        <Box>
          <Text size="sm" fw={700} c="dimmed">
            Transfer to
          </Text>
          <Text size="sm" fw={700}>
            {basicInfo.bank}
          </Text>
          <Text size="sm">{basicInfo.bankNumber}</Text>
          <Text size="sm">{basicInfo.accountName}</Text>
        </Box>
        <Box>
          <Group justify="space-between" px={7}>
            <Text size="sm">Total</Text>
            <Text size="sm">
              {
                <NumberFormatter
                  prefix="Rp"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={productInfo.reduce(
                    (acc, item) => acc + item.subtotal,
                    0
                  )}
                />
              }
            </Text>
          </Group>
          <Group justify="space-between" px={7}>
            <Text size="sm">Tax</Text>
            <Text size="sm">Rp0</Text>
          </Group>
          <Group justify="space-between" px={7}>
            <Text size="sm">Discount</Text>
            <Text size="sm">Rp0</Text>
          </Group>
          <Group
            justify="space-between"
            style={{ background: "#ECECEC" }}
            p={7}
            mt={10}
          >
            <Text size="sm" fw={700}>
              Grand Total
            </Text>
            <Text size="sm" fw={700}>
              {
                <NumberFormatter
                  prefix="Rp"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={productInfo.reduce(
                    (acc, item) => acc + item.subtotal,
                    0
                  )}
                />
              }
            </Text>
          </Group>
        </Box>
      </Group>
      <Group justify="space-between" my={50}>
        <Text size="lg" fw={700} c="dimmed">
          Thank you for your purchase!
        </Text>
        <Box pr={60} style={{ textAlign: "center" }}>
          <Text size="md">{basicInfo.name}</Text>
          <Divider mt={40} />
          <Text size="xs" c="dimmed">
            Administrator
          </Text>
        </Box>
      </Group>
      <Group>
        <Button variant="light" onClick={back}>
          Back
        </Button>
        <Button>GENERATE PDF</Button>
      </Group>
    </Box>
  );
};
