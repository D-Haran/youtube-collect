import UserProvider from "../context/userContext";
import { SpeedInsights } from "@vercel/speed-insights/next"

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <SpeedInsights/>
      <Component {...pageProps} />
    </UserProvider>
  );
}
