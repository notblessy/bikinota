import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  List,
  NumberFormatter,
  SimpleGrid,
  Table,
  Text,
} from "@mantine/core";
import { isSafari } from "react-device-detect";
import { CiCircleChevRight } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { usePDF } from "react-to-pdf";

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

const renderLabelOtherPayment = (payment) => {
  switch (payment.type.value) {
    case "tax":
      return (
        <>
          <Text size="14px" fw={700}>
            {payment.type.label}{" "}
            <span style={{ fontSize: "12px", color: "#858E96" }}>
              {
                <NumberFormatter
                  suffix="%"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={payment.amount}
                />
              }
            </span>
          </Text>
        </>
      );
    case "discount":
      return (
        <>
          <Text size="14px" fw={700}>
            {payment.type.label}
          </Text>
          <Text size="12px" fw={400} c="dimmed">
            {payment.name} {" - "}
            <span style={{ fontSize: "12px", color: "#858E96" }}>
              {
                <NumberFormatter
                  suffix="%"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={payment.amount}
                />
              }
            </span>
          </Text>
        </>
      );
    default:
      return (
        <Text size="14px" fw={700}>
          {payment.name}
        </Text>
      );
  }
};

const renderTotalOtherPayment = (payment, totalTax, totalDiscount) => {
  switch (payment.type.value) {
    case "tax":
      return (
        <NumberFormatter
          prefix="IDR "
          thousandSeparator="."
          decimalSeparator=","
          value={totalTax}
        />
      );
    case "discount":
      return (
        <NumberFormatter
          allowNegative={false}
          prefix="- IDR "
          thousandSeparator="."
          decimalSeparator=","
          value={totalDiscount}
        />
      );
    default:
      return (
        <NumberFormatter
          allowNegative={false}
          prefix="- IDR "
          thousandSeparator="."
          decimalSeparator=","
          value={payment.amount}
        />
      );
  }
};

// eslint-disable-next-line react/prop-types
export const Invoice = ({ back }) => {
  const navigate = useNavigate();

  const basicInfo = JSON.parse(localStorage.getItem("basicInfo"));
  const recipientInfo = JSON.parse(localStorage.getItem("recipientInfo"));
  const productInfo = JSON.parse(localStorage.getItem("productInfo"));
  const additionalNotes = JSON.parse(localStorage.getItem("additionalNotes"));
  const images = JSON.parse(localStorage.getItem("images"));
  const otherPayments = JSON.parse(localStorage.getItem("otherPayments")) || [];

  const invoiceNo = generateInvoice(basicInfo.name);

  const itemSubtotal = productInfo?.reduce((prev, next) => {
    return prev + next.subtotal;
  }, 0);

  const otherPaymentTotal = otherPayments.reduce((prev, next) => {
    if (next.type.value === "otherDeduction") {
      return prev - next.amount;
    } else if (next.type.value === "otherAddition") {
      return prev + next.amount;
    }

    return prev;
  }, 0);

  let grandTotal = itemSubtotal + otherPaymentTotal;

  const totalDiscount = otherPayments.reduce((prev, next) => {
    if (next.type.value === "discount") {
      prev = (next.amount / 100) * grandTotal;
      return prev;
    }

    return prev;
  }, 0);

  grandTotal = grandTotal - totalDiscount;

  const totalTax = otherPayments.reduce((prev, next) => {
    if (next.type.value === "tax") {
      prev = (next.amount / 100) * grandTotal;
      return prev;
    }

    return prev;
  }, 0);

  grandTotal = grandTotal + totalTax;

  const { toPDF, targetRef } = usePDF({
    filename: `${basicInfo.name} - ${invoiceNo}.pdf`,
    method: isSafari ? "save" : "open",
    page: {
      margin: 10,
    },
  });

  const rows = productInfo.map((item, index) => (
    <Table.Tr key={`${item.name}-${index}`}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td maw={200}>
        <Text fz={14}>{item.name}</Text>
        <Text fz={10} c="dimmed">
          {item.description}
        </Text>
      </Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>
        {
          <NumberFormatter
            prefix="IDR "
            thousandSeparator="."
            decimalSeparator=","
            value={item.rate}
          />
        }
      </Table.Td>
      <Table.Td>
        {
          <NumberFormatter
            prefix="IDR "
            thousandSeparator="."
            decimalSeparator=","
            value={item.subtotal}
          />
        }
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box p={20} style={{ overflow: "auto" }}>
      <Box ref={targetRef}>
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
            <Text size="xs">{invoiceNo}</Text>
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
                <Table.Th>Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Box>
        <Group mt={20} justify="space-between" p={7}>
          <Box>
            <Text size="sm" fw={700} c="dimmed">
              Payment Method
            </Text>
            <Text size="sm" fw={700}>
              {basicInfo.bank}
            </Text>
            <Text size="sm">{basicInfo.bankNumber}</Text>
            <Text size="sm" c="dimmed">
              {basicInfo.accountName}
            </Text>
          </Box>
          <Box style={{ width: "40%" }}>
            <Box>
              <Grid p={5}>
                <Grid.Col span={6}>
                  <Box>
                    <Text size="14px" fw={700}>
                      Subtotal
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6} style={{ textAlign: "right" }}>
                  <Text size="14px">
                    {
                      <NumberFormatter
                        prefix="IDR "
                        thousandSeparator="."
                        decimalSeparator=","
                        value={itemSubtotal}
                      />
                    }
                  </Text>
                </Grid.Col>
              </Grid>
              {otherPayments &&
                otherPayments.length > 0 &&
                otherPayments.map((payment) => {
                  return (
                    <Grid key={payment.id} style={{ padding: 5 }}>
                      <Grid.Col span={6}>
                        <Box>{renderLabelOtherPayment(payment)}</Box>
                      </Grid.Col>
                      <Grid.Col span={6} style={{ textAlign: "right" }}>
                        <Text size="14px">
                          {renderTotalOtherPayment(
                            payment,
                            totalTax,
                            totalDiscount
                          )}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  );
                })}
            </Box>
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
                    prefix="IDR "
                    thousandSeparator="."
                    decimalSeparator=","
                    value={grandTotal}
                  />
                }
              </Text>
            </Group>
          </Box>
        </Group>
        <Grid mt={50}>
          <Grid.Col span={7}>
            {additionalNotes?.length > 0 ? (
              <>
                <Text mb={10} size="sm" fw={700} c="dimmed">
                  Additional Notes
                </Text>
                <List
                  spacing="xs"
                  size="xs"
                  center
                  icon={<CiCircleChevRight color="#7D7D7D" size={14} />}
                >
                  {additionalNotes?.map((note, index) => (
                    <List.Item key={note.id + index}>{note.notes}</List.Item>
                  ))}
                </List>
              </>
            ) : (
              <Text size="lg" fw={700} c="dimmed">
                Thank you for your purchase!
              </Text>
            )}
          </Grid.Col>
          <Grid.Col offset={1} span={4} pr={60} style={{ textAlign: "center" }}>
            <Text size="md">{basicInfo.name}</Text>
            <Divider mt={40} />
            <Text size="xs" c="dimmed">
              Administrator
            </Text>
          </Grid.Col>
        </Grid>
        {images && (
          <Box mt={50}>
            <Text size="sm" fw={700} c="dimmed">
              Attachments
            </Text>
            <SimpleGrid
              cols={4}
              spacing="xs"
              verticalSpacing="xs"
              style={{ width: "100%" }}
            >
              {images.length > 0 &&
                images.map((image, index) => (
                  <Box key={index} p={10}>
                    <Text size="xs" c="dimmed">
                      {image.title}
                    </Text>
                    <Image radius="md" fit="contain" src={image.photoURL} />
                  </Box>
                ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
      <Group mt={50}>
        <Button variant="light" onClick={back}>
          Dismiss
        </Button>
        <Button
          onClick={() => {
            toPDF();
            navigate("/success");
          }}
        >
          GENERATE PDF
        </Button>
      </Group>
    </Box>
  );
};
