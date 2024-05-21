import Autoplay from "embla-carousel-autoplay";
import {
  Box,
  Button,
  Center,
  Image,
  List,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from "@mantine/core";
import { Dots } from "../components/PatternDots";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkSharp } from "react-icons/io5";
import { BiMessageDots } from "react-icons/bi";
import { ImCoinDollar } from "react-icons/im";
import { MdBusinessCenter } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { Carousel } from "@mantine/carousel";
import { useRef } from "react";

// eslint-disable-next-line react/prop-types
export default function LandingPage() {
  const navigate = useNavigate();

  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <>
      <Carousel
        plugins={[autoplay.current]}
        withControls={false}
        slideGap="md"
        align="start"
        loop
      >
        <Carousel.Slide>
          <Box mt={30} style={{ padding: "10px 20px" }}>
            <Dots
              style={{
                left: 0,
                top: 0,
                position: "absolute",
                zIndex: -1,
                padding: 20,
              }}
            />
            <Dots
              style={{
                right: 0,
                bottom: 0,
                position: "absolute",
                padding: 20,
                zIndex: -1,
              }}
            />
            <Box style={{ zIndex: 99999 }}>
              <Text ta="center" c="red" fz={12} fw={600}>
                Bikinota
              </Text>
              <Title ta="center" order={2} c="#161617">
                Welcome to Bikinota
              </Title>
              <Box>
                <Text ta="center" c="dimmed" fz={14}>
                  Create Professional Invoices Instantly – For Free!
                </Text>
                <List
                  mt={30}
                  spacing="sm"
                  size="sm"
                  icon={
                    <ThemeIcon color="red" size={20} radius="xl">
                      <IoCheckmarkSharp color="#FFF" />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    <b>Free to Use</b> – No hidden costs or subscriptions. Use
                    Bikinota to create and manage invoices at no charge.
                  </List.Item>
                  <List.Item>
                    <b>User-Friendly</b> – Designed for simplicity and
                    efficiency.
                  </List.Item>
                  <List.Item>
                    <b>Professional Output</b> – Download your invoices in
                    high-quality PDF format, ready to send to your clients.
                  </List.Item>
                </List>
                <Center>
                  <Image
                    radius="md"
                    h={200}
                    w="auto"
                    fit="contain"
                    src="./rec.png"
                  />
                </Center>
              </Box>
            </Box>
          </Box>
        </Carousel.Slide>
        <Carousel.Slide>
          <Dots
            style={{
              left: 0,
              top: 0,
              position: "absolute",
              zIndex: -1,
              padding: 20,
            }}
          />
          <Dots
            style={{
              right: 0,
              bottom: 0,
              position: "absolute",
              padding: 20,
              zIndex: -1,
            }}
          />
          <Box style={{ zIndex: 99999 }} p={10} mb={30}>
            <Box mb={60}>
              <Title order={2} style={{ lineHeight: 1.2, margin: "0 0 10px" }}>
                A{" "}
                <Text component="span" c="#F95252" inherit>
                  simple & efficient
                </Text>{" "}
                to generate your invoices
              </Title>

              <Text c="dimmed" size="20px" fw={500}>
                Start Using Bikinota Today!
              </Text>
            </Box>

            <Timeline active={3} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<MdBusinessCenter size={12} />}
                title="Your Business"
              >
                <Text c="dimmed" size="sm">
                  Fill in your business information.
                </Text>
              </Timeline.Item>

              <Timeline.Item bullet={<BsPeople size={12} />} title="Recipient">
                <Text c="dimmed" size="sm">
                  Fill in the recipient&apos;s information.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                title="Item Details"
                bullet={<ImCoinDollar size={12} />}
              >
                <Text c="dimmed" size="sm">
                  Fill in the item you want to invoice.
                </Text>
              </Timeline.Item>

              <Timeline.Item
                title="Generate & Download"
                bullet={<BiMessageDots size={12} />}
              >
                <Text c="dimmed" size="sm">
                  <Text variant="link" component="span" inherit>
                    Instantly generate a PDF invoice and download it for free.
                  </Text>
                </Text>
              </Timeline.Item>
            </Timeline>
          </Box>
        </Carousel.Slide>
      </Carousel>
      <Button
        onClick={() => navigate("/create")}
        fullWidth
        radius={5}
        mt={15}
        size="sm"
        variant="filled"
      >
        Get Started
      </Button>
    </>
  );
}
