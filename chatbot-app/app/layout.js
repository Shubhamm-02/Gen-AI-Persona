import "./globals.css";

export const metadata = {
  title: "ScalerMind -- Persona-Based AI Chatbot",
  description:
    "Chat with AI personas of Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra from Scaler Academy. Get career advice, technical guidance, and learning strategies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
