import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Playfair_Display as FontPlayfair,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Playfair Display for headings
export const fontPlayfair = FontPlayfair({
  subsets: ["latin"],
  variable: "--font-playfair",
  // You can adjust weight/styles as needed
  weight: ["400", "500", "600", "700", "800"],
});
