import { initializeFirestore } from "firebase/firestore";
import type { FunctionComponent, ReactNode } from "react";
import { FirestoreProvider, useInitFirestore } from "reactfire";

export const Firestore: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { status, data: firestoreInstance } = useInitFirestore(
    // eslint-disable-next-line @typescript-eslint/require-await
    async (firebaseApp) => {
      const db = initializeFirestore(firebaseApp, {});

      return db;
    },
  );

  if (status === "loading") {
    return <>Loading</>;
  }

  return (
    <>
      <FirestoreProvider sdk={firestoreInstance}>{children}</FirestoreProvider>
    </>
  );
};
