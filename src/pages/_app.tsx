import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider } from "urql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

function MyApp({ Component, pageProps }) {
  return (
    // <Provider value={createUrqlClient}>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    // </Provider>
  );
}

export default MyApp;
