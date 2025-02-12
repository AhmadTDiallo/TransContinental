import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: {
      default: "#f5f5f5",
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAdminRoute && <Navbar />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}