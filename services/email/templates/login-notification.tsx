import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface LoginNotificationProps {
  userName: string;
  loginTime: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
}

export const LoginNotificationEmail = ({
  userName,
  loginTime,
  device,
  browser,
  location,
  ipAddress,
}: LoginNotificationProps) => (
  <Html>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Preview>New login to your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Heading style={h1}>New Login Detected</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            We detected a new login to your account. If this was you, you can
            safely ignore this email.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Login Details:</Text>
            <Text style={infoText}>
              <strong>Time:</strong> {loginTime}
            </Text>
            <Text style={infoText}>
              <strong>Device:</strong> {device}
            </Text>
            <Text style={infoText}>
              <strong>Browser:</strong> {browser}
            </Text>
            <Text style={infoText}>
              <strong>Location:</strong> {location}
            </Text>
            <Text style={infoText}>
              <strong>IP Address:</strong> {ipAddress}
            </Text>
          </Section>

          <Text style={warningText}>
            If you did not perform this login, please secure your account
            immediately by changing your password.
          </Text>

          <Text style={footerText}>
            Best regards,
            <br />
            The Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default LoginNotificationEmail;

// Styles
const main = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "560px",
  borderRadius: "8px",
  padding: "40px",
};

const content = {
  padding: "0",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.4",
  margin: "0 0 24px",
};

const text = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#f9f9f9",
  borderRadius: "6px",
  padding: "20px",
  margin: "24px 0",
};

const infoTitle = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const infoText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const warningText = {
  color: "#d93025",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0 16px",
  padding: "12px",
  backgroundColor: "#fef3f2",
  borderRadius: "6px",
  border: "1px solid #fee4e2",
};

const footerText = {
  color: "#999999",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0 0",
};
