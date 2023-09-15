import { type AppType } from "next/dist/shared/lib/utils";
import { NextUIProvider } from "@nextui-org/react";
import "@/styles/globals.css";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "@/lib/firebase";
import { Firestore } from "@/lib/firebase/Firebase";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <NextUIProvider>
        <Firestore>
          <Component {...pageProps} />
        </Firestore>
      </NextUIProvider>
    </FirebaseAppProvider>
  );
};

export default MyApp;
