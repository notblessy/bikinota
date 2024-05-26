import "../assets/style.css";
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
  Grid,
  Group,
  Image,
  Modal,
  NumberFormatter,
  NumberInput,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { Invoice } from "../components/Invoice";
import { IoMdClose } from "react-icons/io";
import Compressor from "compressorjs";

const renderLabelOtherPayment = (payment) => {
  switch (payment.type.value) {
    case "tax":
      return (
        <Text size="12px" fw={700}>
          {payment.type.label}{" "}
          <span style={{ fontSize: "10px", color: "#858E96" }}>
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
      );
    case "discount":
      return (
        <>
          <Text size="12px" fw={700}>
            {payment.type.label}
          </Text>
          <Text size="10px" fw={400} c="dimmed">
            {payment.name} {" - "}
            <span style={{ fontSize: "10px", color: "#858E96" }}>
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
        <Text size="12px" fw={700}>
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

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

// eslint-disable-next-line react/prop-types
export const ProductInfo = ({ setStep }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [openedImage, { open: openImage, close: closeImage }] =
    useDisclosure(false);
  const [openedOther, { open: openOther, close: closeOther }] =
    useDisclosure(false);
  const [openedOtherEdit, { open: openOtherEdit, close: closeOtherEdit }] =
    useDisclosure(false);

  const resetRef = useRef(null);

  const isMobile = useMediaQuery("(max-width: 50em)");

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedOtherId, setSelectedOtherId] = useState(null);

  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedProductInfo = localStorage.getItem("productInfo");
    if (storedProductInfo) {
      const productInfo = storedProductInfo
        ? JSON.parse(storedProductInfo)
        : {};

      setItems(productInfo);
    }

    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      const images = storedImages ? JSON.parse(storedImages) : [];

      setImages(images);
    }

    const storedOtherPayments = localStorage.getItem("otherPayments");
    if (storedOtherPayments) {
      const otherPayments = storedOtherPayments
        ? JSON.parse(storedOtherPayments)
        : [];

      setOtherPayments(otherPayments);
    }
  }, [setItems, setImages, setOtherPayments]);

  const form = useForm({
    initialValues: {
      name: "",
      quantity: 0,
      description: "",
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
      description: "",
      quantity: 0,
      rate: 0,
      subtotal: 0,
      createdAt: null,
    },

    validate: {},
  });

  const formImage = useForm({
    initialValues: {
      photoURL: "",
      photo: "",
      title: "",
    },

    validate: {},
  });

  const formOther = useForm({
    initialValues: {
      name: "",
      amount: 0,
      type: {},
    },

    validate: {},
  });

  const formOtherEdit = useForm({
    initialValues: {
      id: "",
      name: "",
      amount: 0,
      type: {},
    },

    validate: {},
  });

  const itemSubtotal = items.reduce((prev, next) => {
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
    form.reset();
    close();
  };

  const handleSubmitEdit = (values) => {
    setLoading(true);

    values.subtotal = values.quantity * values.rate;

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

  const handleFileChange = (file) => {
    if (file) {
      formImage.setValues({ photo: file.name });

      new Compressor(file, {
        quality: 0.1,
        success(result) {
          const reader = new FileReader();
          reader.onload = (e) => {
            formImage.setValues({ photoURL: e.target.result });
          };

          reader.readAsDataURL(result);
        },
        error(err) {
          console.log(err.message);
        },
      });
    } else {
      formImage.setValues({ photo: "", photoURL: "" });
    }
  };

  const clearFile = () => {
    formImage.setValues({ photo: "", photoURL: "" });
    resetRef.current?.();
  };

  const handleSaveImage = (values) => {
    setLoading(true);

    values.id = `image-${Math.floor(
      Math.random() * 10000
    )}-${new Date().getTime()}`;

    const currentImages = JSON.parse(localStorage.getItem("images")) || [];
    currentImages.push(values);
    localStorage.setItem("images", JSON.stringify(currentImages));

    setImages(currentImages);

    closeImage();
    formImage.reset();
    setLoading(false);
  };

  const handleSubmitOther = (values) => {
    setLoading(true);

    const newValue = {
      id: `${values.type.value}-${new Date().getTime()}`,
      name: values.name,
      amount: values.amount,
      type: values.type,
      createdAt: new Date(),
    };

    if (values.type.value === "tax") {
      newValue.sort = 99;
    } else if (values.type.value === "discount") {
      newValue.sort = 98;
    } else {
      newValue.sort = 1;
    }

    const otherPayments =
      JSON.parse(localStorage.getItem("otherPayments")) || [];
    otherPayments.push(newValue);

    otherPayments.sort((a, b) => {
      if (a.sort === b.sort) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return a.sort - b.sort;
    });

    localStorage.setItem("otherPayments", JSON.stringify(otherPayments));
    setOtherPayments(otherPayments);

    closeOther();
    formOther.reset();
    setLoading(false);
  };

  const handleRemoveOther = () => {
    setLoading(true);

    const otherPayments =
      JSON.parse(localStorage.getItem("otherPayments")) || [];
    const newOtherPayments = otherPayments.filter(
      (payment) => payment.id !== selectedOtherId
    );
    setOtherPayments(newOtherPayments);

    localStorage.setItem("otherPayments", JSON.stringify(newOtherPayments));

    closeOtherEdit();
    setLoading(false);
  };

  const handleSubmitOtherEdit = (values) => {
    setLoading(true);

    values.id = selectedOtherId;

    let otherPayments = JSON.parse(localStorage.getItem("otherPayments")) || [];
    otherPayments = otherPayments.filter(
      (payment) => payment.id !== selectedOtherId
    );
    otherPayments.push(values);
    otherPayments.sort((a, b) => {
      if (a.sort === b.sort) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      return a.sort - b.sort;
    });
    localStorage.setItem("otherPayments", JSON.stringify(otherPayments));
    setOtherPayments(otherPayments);

    closeOtherEdit();
    formOtherEdit.reset();
    setLoading(false);
  };

  const handleRemoveImage = (id) => {
    setLoading(true);

    let images = JSON.parse(localStorage.getItem("images")) || [];
    images = images.filter((image) => image.id !== id);
    setImages(images);

    localStorage.setItem("images", JSON.stringify(images));

    setLoading(false);
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
      <Table.Td maw={200}>
        <Text fz={12}>{item.name}</Text>
        {item.description && (
          <Text fz={10} c="dimmed">
            {truncateString(item.description, 100)}
          </Text>
        )}
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
    <Box>
      <Title order={3}>Products</Title>
      <Title order={6} c="dimmed" mb={20}>
        Add products to invoice.
      </Title>
      <Text mt={20} fw={700} c="dimmed" size="xs">
        Item Details
      </Text>
      <Divider mb={10} />
      <Table>
        <Table.Thead style={{ background: "#ECECEC" }}>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Rate</Table.Th>
            <Table.Th>Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group my={10} justify="flex-end" p={7}>
        <Box style={{ width: !isMobile ? "50%" : "70%" }}>
          <Grid p={5}>
            <Grid.Col span={6}>
              <Box>
                <Text size="12px" fw={700}>
                  Subtotal
                </Text>
              </Box>
            </Grid.Col>
            <Grid.Col span={6} style={{ textAlign: "right" }}>
              <Text size="12px">
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
                <Grid
                  key={payment.id}
                  p={5}
                  className="hoverable"
                  onClick={() => {
                    formOtherEdit.setValues(payment);
                    setSelectedOtherId(payment.id);
                    openOtherEdit();
                  }}
                >
                  <Grid.Col span={6}>
                    <Box>{renderLabelOtherPayment(payment)}</Box>
                  </Grid.Col>
                  <Grid.Col span={6} style={{ textAlign: "right" }}>
                    <Text size="12px">
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
      </Group>
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
                prefix="IDR "
                thousandSeparator="."
                decimalSeparator=","
                value={grandTotal}
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
        <Button loading={loading} variant="light" onClick={openOther}>
          Other
        </Button>
        <Button loading={loading} onClick={open} color="red">
          Add Item
        </Button>
      </Group>
      <Text mt={20} fw={700} c="dimmed" size="xs">
        Additional Information (optional)
      </Text>
      <Divider mb={10} />
      <Group justify="flex-end" mt="md" grow>
        <Button variant="light" onClick={openImage}>
          Add Image
        </Button>
      </Group>
      <SimpleGrid
        cols={2}
        spacing="xs"
        verticalSpacing="xs"
        style={{ width: "100%" }}
      >
        {images &&
          images.length > 0 &&
          images.map((image, index) => (
            <Box key={index} p={10} style={{ position: "relative" }}>
              <Text size="xs" c="dimmed">
                {image.title}
              </Text>
              <Image radius="md" fit="contain" src={image.photoURL} />
              <Anchor
                className="closeButtonImage"
                underline="none"
                onClick={() => handleRemoveImage(image.id)}
              >
                X
              </Anchor>
            </Box>
          ))}
      </SimpleGrid>

      <Divider my={20} />
      <Button
        disabled={!items || items?.length === 0}
        loading={loading}
        onClick={openModal}
        color="red"
        fullWidth
      >
        Preview Invoice
      </Button>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={opened}
        onClose={close}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Container size="xs">
          <Title order={3}>Item</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Title order={6} c="dimmed">
              Add item information.
            </Title>
            <TextInput
              my={10}
              required
              withAsterisk
              label="Name"
              placeholder="Name"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />

            <Textarea
              my={10}
              minRows={3}
              maxRows={10}
              label="Description"
              placeholder="Description (optional)"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />

            <Grid my={10}>
              <Grid.Col span={3}>
                <NumberInput
                  withAsterisk
                  required
                  label="Quantity"
                  placeholder="Quantity"
                  key={form.key("quantity")}
                  {...form.getInputProps("quantity")}
                />
              </Grid.Col>
              <Grid.Col span={9}>
                <NumberInput
                  required
                  leftSection={<Text size="xs">IDR </Text>}
                  withAsterisk
                  label="Rate"
                  placeholder="Rate"
                  key={form.key("rate")}
                  {...form.getInputProps("rate")}
                />
              </Grid.Col>
            </Grid>

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
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
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

            <Textarea
              my={10}
              minRows={3}
              maxRows={10}
              label="Description"
              placeholder="Description (optional)"
              key={formEdit.key("description")}
              {...formEdit.getInputProps("description")}
            />

            <Grid my={10}>
              <Grid.Col span={3}>
                <NumberInput
                  withAsterisk
                  label="Quantity"
                  placeholder="Quantity"
                  key={formEdit.key("quantity")}
                  {...formEdit.getInputProps("quantity")}
                />
              </Grid.Col>
              <Grid.Col span={9}>
                <NumberInput
                  leftSection={<Text size="xs">IDR </Text>}
                  withAsterisk
                  label="Rate"
                  placeholder="Rate"
                  key={formEdit.key("rate")}
                  {...formEdit.getInputProps("rate")}
                />
              </Grid.Col>
            </Grid>

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
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={openedImage}
        onClose={closeImage}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Container size="xs">
          <Title order={3}>Additional Information</Title>
          <form onSubmit={formImage.onSubmit(handleSaveImage)}>
            <Title order={6} c="dimmed">
              Add additional information.
            </Title>
            <Box mt={20}>
              {formImage.getValues().photo &&
                formImage.getValues().photoURL && (
                  <Avatar
                    src={formImage.getValues().photoURL}
                    size={100}
                    my={10}
                  />
                )}
              <Group>
                <FileButton
                  resetRef={resetRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg"
                >
                  {(props) => (
                    <Button variant="filled" color="red" size="xs" {...props}>
                      Upload Image
                    </Button>
                  )}
                </FileButton>
                <Group>
                  <Text size="xs" c="dimmed">
                    {formImage.getValues().photo
                      ? formImage.getValues().photo.length > 18
                        ? formImage.getValues().photo.slice(0, 15) + "..."
                        : formImage.getValues().photo
                      : "No file selected"}
                  </Text>
                  {formImage.getValues().photo &&
                    formImage.getValues().photoURL && (
                      <ActionIcon
                        onClick={clearFile}
                        size="xs"
                        variant="default"
                      >
                        <IoMdClose size="10px" />
                      </ActionIcon>
                    )}
                </Group>
              </Group>
            </Box>
            <TextInput
              my={10}
              required
              withAsterisk
              label="Title"
              placeholder="Title"
              key={formImage.key("title")}
              {...formImage.getInputProps("title")}
            />

            <Button mt={20} loading={loading} type="submit" fullWidth>
              Add Image
            </Button>
          </form>
        </Container>
      </Drawer>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={openedOther}
        onClose={closeOther}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Container size="xs">
          <Title order={3}>Other Payment</Title>
          <form onSubmit={formOther.onSubmit(handleSubmitOther)}>
            <Title order={6} c="dimmed">
              Add other payment.
            </Title>

            <Select
              required
              label="Type"
              placeholder="Select Type"
              data={[
                { value: "tax", label: "Tax" },
                { value: "discount", label: "Discount" },
                { value: "otherDeduction", label: "Other Deduction" },
                { value: "otherAddition", label: "Other Addition" },
              ]}
              value={
                formOther.getValues()?.type?.value
                  ? formOther.getValues()?.type?.value
                  : null
              }
              clearable
              onChange={(_value, option) => {
                formOther.setValues({ type: option });
              }}
            />

            {(formOther.getValues()?.type?.value === "otherDeduction" ||
              formOther.getValues()?.type?.value === "otherAddition") && (
              <>
                <TextInput
                  my={10}
                  withAsterisk
                  label="Name"
                  placeholder="Name"
                  key={formOther.key("name")}
                  {...formOther.getInputProps("name")}
                />
                <NumberInput
                  required
                  leftSection={<Text size="xs">IDR </Text>}
                  withAsterisk
                  label="Amount"
                  placeholder="Amount"
                  key={formOther.key("amount")}
                  {...formOther.getInputProps("amount")}
                />
              </>
            )}

            {formOther.getValues()?.type?.value === "tax" && (
              <NumberInput
                required
                rightSection={<Text size="xs">%</Text>}
                withAsterisk
                label="Amount"
                placeholder="Amount"
                key={formOther.key("amount")}
                {...formOther.getInputProps("amount")}
              />
            )}

            {formOther.getValues()?.type?.value === "discount" && (
              <>
                <TextInput
                  my={10}
                  withAsterisk
                  label="Name"
                  placeholder="Name / Code"
                  key={formOther.key("name")}
                  {...formOther.getInputProps("name")}
                />
                <NumberInput
                  required
                  rightSection={<Text size="xs">%</Text>}
                  withAsterisk
                  label="Amount"
                  placeholder="Amount"
                  key={formOther.key("amount")}
                  {...formOther.getInputProps("amount")}
                />
              </>
            )}

            <Button mt={20} loading={loading} type="submit" fullWidth>
              Add Other Payment
            </Button>
          </form>
        </Container>
      </Drawer>
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={openedOtherEdit}
        onClose={closeOtherEdit}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Container size="xs">
          <Title order={3}>Other Payment</Title>
          <form onSubmit={formOtherEdit.onSubmit(handleSubmitOtherEdit)}>
            <Title order={6} c="dimmed">
              Update other payment.
            </Title>

            <Select
              required
              label="Type"
              placeholder="Select Type"
              data={[
                { value: "tax", label: "Tax" },
                { value: "discount", label: "Discount" },
                { value: "otherDeduction", label: "Other Deduction" },
                { value: "otherAddition", label: "Other Addition" },
              ]}
              value={
                formOtherEdit.getValues()?.type?.value
                  ? formOtherEdit.getValues()?.type?.value
                  : null
              }
              clearable
              onChange={(_value, option) => {
                formOtherEdit.setValues({ type: option });
              }}
            />

            {(formOtherEdit.getValues()?.type?.value === "otherDeduction" ||
              formOtherEdit.getValues()?.type?.value === "otherAddition") && (
              <>
                <TextInput
                  my={10}
                  withAsterisk
                  label="Name"
                  placeholder="Name"
                  key={formOtherEdit.key("name")}
                  {...formOtherEdit.getInputProps("name")}
                />
                <NumberInput
                  required
                  leftSection={<Text size="xs">IDR </Text>}
                  withAsterisk
                  label="Amount"
                  placeholder="Amount"
                  key={formOtherEdit.key("amount")}
                  {...formOtherEdit.getInputProps("amount")}
                />
              </>
            )}

            {formOtherEdit.getValues()?.type?.value === "tax" && (
              <NumberInput
                required
                rightSection={<Text size="xs">%</Text>}
                withAsterisk
                label="Amount"
                placeholder="Amount"
                key={formOtherEdit.key("amount")}
                {...formOtherEdit.getInputProps("amount")}
              />
            )}

            {formOtherEdit.getValues()?.type?.value === "discount" && (
              <>
                <TextInput
                  my={10}
                  withAsterisk
                  label="Name"
                  placeholder="Name / Code"
                  key={formOtherEdit.key("name")}
                  {...formOtherEdit.getInputProps("name")}
                />
                <NumberInput
                  required
                  rightSection={<Text size="xs">%</Text>}
                  withAsterisk
                  label="Amount"
                  placeholder="Amount"
                  key={formOtherEdit.key("amount")}
                  {...formOtherEdit.getInputProps("amount")}
                />
              </>
            )}

            <Group grow>
              <Button
                mt={20}
                loading={loading}
                variant="light"
                onClick={handleRemoveOther}
              >
                Remove
              </Button>
              <Button mt={20} loading={loading} type="submit">
                Update Other Payment
              </Button>
            </Group>
          </form>
        </Container>
      </Drawer>
      <Modal
        size={!isMobile && "827px"}
        opened={openedModal}
        onClose={closeModal}
        fullScreen={isMobile}
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{ backgroundOpacity: 0.1, blur: 4 }}
      >
        <Invoice back={closeModal} />
      </Modal>
    </Box>
  );
};
