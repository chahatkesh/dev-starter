import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AccountCreatedProps {
  userName: string;
  loginUrl: string;
}

export const AccountCreatedEmail = ({
  userName,
  loginUrl,
}: AccountCreatedProps) => (
  <Html>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Preview>Welcome - Your account has been created</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Heading style={h1}>Welcome</Heading>

          <Text style={text}>Hi {userName},</Text>

          <Text style={text}>
            Your account has been created successfully. You can now log in and
            start using the platform.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Log In
            </Button>
          </Section>

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

export default AccountCreatedEmail;

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
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "500",
  lineHeight: "1",
  padding: "14px 28px",
  textDecoration: "none",
};

const footerText = {
  color: "#6b6b6b",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0 0",
};
