/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Field,
  Form,
  Formik,
  type FormikProps,
  type FormikValues,
} from "formik";
import {
  useState,
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
  type ChangeEvent,
  useRef,
  useEffect,
} from "react";
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreDocDataOnce,
  useFirestoreDocOnce,
} from "reactfire";

import { IoIosWarning } from "react-icons/io";

type InfoModalProps = {
  entryIsOpen: boolean;
  entryOnOpenChange: () => void;
  selectedEntry: string;
  setSelectedEntry: Dispatch<SetStateAction<string>>;
};

export const InfoModal: FunctionComponent<InfoModalProps> = ({
  entryIsOpen,
  entryOnOpenChange,
  selectedEntry,
  setSelectedEntry,
}) => {
  const formRef = useRef<FormikProps<FormikValues>>(null);

  const btnRef = useRef(null);

  const firestore = useFirestore();
  const ref = doc(firestore, `registrations/${String(selectedEntry)}`);

  const { status, data } = useFirestoreDocData(ref);
  const { status: famStatus, data: famData } = useFirestoreDocDataOnce(ref);

  const [famState, setFamState] = useState<
    { name: string; age: number; relationship: string; gender: string }[]
  >([]);

  useEffect(() => {
    if (famStatus !== "success") return;
    setFamState(famData.family_members);
  }, [famData, famStatus]);

  const update = (data: Record<string, string>) => {
    void updateDoc(ref, data);
  };

  const [editable, setEditable] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    id: "confirmation",
  });
  return (
    status === "success" && (
      <>
        {console.log(data)}
        <Modal
          className="z-[100] text-white dark"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          hideCloseButton
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  Confirm deletion of{" "}
                  {data?.nickname ?? data["full_name_as_per_IC_(en)"]}?
                </ModalHeader>
                <ModalBody className="flex w-full flex-col items-center">
                  <IoIosWarning color="#f5a524" size={50} />
                  <p>This action cannot be reversed. Are you sure?</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      void deleteDoc(ref);
                      setSelectedEntry("");
                      onClose();
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          className={`max-h-[80vh] overflow-y-scroll text-white dark`}
          isOpen={entryIsOpen}
          onOpenChange={entryOnOpenChange}
          backdrop="blur"
          size="3xl"
          hideCloseButton
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                y: -20,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {`${data?.["full_name_as_per_IC_(en)"]} // ${data?.nickname}`}
                </ModalHeader>
                <ModalBody className="flex flex-col gap-3">
                  <Formik
                    innerRef={formRef}
                    initialValues={{
                      "full_name_as_per_IC_(en)":
                        data?.["full_name_as_per_IC_(en)"],
                      "full_name_(chi)": data?.["full_name_(chi)"],
                      nickname: data?.nickname,
                      gender: data?.gender,
                      nric_passport: data?.nric_passport,
                      date_of_birth: data?.date_of_birth,
                      contact_no: data?.contact_no,
                      marital_status: data?.marital_status,
                      service_location: data?.service_location,
                      pastoral_team: data?.pastoral_team,
                      invited_by: data?.invited_by,
                      ministry_team: data?.ministry_team,
                      additional_joining: data?.additional_joining,
                      additional_bed: data?.additional_bed,
                      // family_members: data?.family_members,
                    }}
                    onSubmit={(values, actions) => {
                      actions.setSubmitting(true);
                      const valToPush = {
                        family_members: famState,
                        ...values,
                      };
                      console.warn(valToPush);
                      // update(values);
                      actions.setSubmitting(false);
                    }}
                  >
                    {({ values, isSubmitting, setFieldValue }) => (
                      <Form className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            name="full_name_as_per_IC_(en)"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="full_name_(chi)"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="nickname"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="gender"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="nric_passport"
                            editable={editable || isSubmitting}
                          />
                          <DateField
                            name="date_of_birth"
                            editable={editable || isSubmitting}
                            values={values}
                            //@ts-ignore
                            setFieldValue={setFieldValue}
                          />
                          <FormField
                            name="contact_no"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="marital_status"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="service_location"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="pastoral_team"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="invited_by"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="ministry_team"
                            editable={editable || isSubmitting}
                          />
                          <FormField
                            name="additional_bed"
                            editable={editable || isSubmitting}
                          />
                          {/* <FormField name="family_members" editable={editable} /> */}
                        </div>
                        {famState.length > 0 && (
                          <div className="flex flex-col items-center rounded-medium border-medium border-default-200 p-1">
                            <p>Family Members</p>
                            <div className="mt-2 flex w-full flex-col gap-2">
                              {famState
                                .sort((a, b) => a.age - b.age)
                                .map((fm, i) => (
                                  <div
                                    key={fm.name}
                                    className="flex w-full flex-row gap-1 rounded-medium border-medium border-default-400 p-1"
                                  >
                                    <FamilyMemberField
                                      editable={editable || isSubmitting}
                                      value={fm.name}
                                      label="name"
                                      key={`${fm.name}-${i}`}
                                      setFamState={setFamState}
                                      targetName={fm.name}
                                    />
                                    <FamilyMemberField
                                      editable={editable || isSubmitting}
                                      value={String(fm.age)}
                                      label="age"
                                      key={`${fm.age}-${i}`}
                                      setFamState={setFamState}
                                      targetName={fm.name}
                                    />
                                    <FamilyMemberField
                                      editable={editable || isSubmitting}
                                      value={fm.relationship}
                                      label="relationship"
                                      key={`${fm.relationship}-${i}`}
                                      setFamState={setFamState}
                                      targetName={fm.name}
                                    />
                                    <FamilyMemberField
                                      editable={editable || isSubmitting}
                                      value={fm.gender}
                                      label="gender"
                                      key={`${fm.gender}-${i}`}
                                      setFamState={setFamState}
                                      targetName={fm.name}
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                </ModalBody>
                <ModalFooter className="flex flex-row justify-between">
                  <Button
                    color="danger"
                    className="self-start"
                    variant="solid"
                    onPress={() => {
                      onOpen();
                    }}
                  >
                    Delete
                  </Button>
                  <div className="flex flex-row justify-end gap-2">
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => {
                        console.log("before", formRef.current);
                        if (!editable) {
                          setEditable(true);
                          return;
                        }

                        if (!formRef.current) return;
                        if (formRef.current.isSubmitting) return;

                        console.log(formRef.current);
                        void formRef.current.submitForm().then(() => {
                          setEditable(false);
                        });
                      }}
                    >
                      {editable ? "Submit" : "Edit"}
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      ref={btnRef}
                      onPress={() => {
                        onClose();
                        setSelectedEntry("");
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
};

const FormField = ({ name, editable }: { name: string; editable: boolean }) => {
  return (
    <Field
      as={Input}
      label={name.replaceAll("_", " ").toLocaleUpperCase()}
      type="text"
      variant="faded"
      placeholder="N/A"
      isReadOnly={!editable}
      name={name}
    />
  );
};
const DateField = ({
  name,
  editable,
  values,
  setFieldValue,
}: {
  name: string;
  editable: boolean;
  values: Record<string, string>;
  setFieldValue: (field: string, value: number) => Promise<void>;
}) => {
  return (
    <Field
      as={Input}
      label={name.replaceAll("_", " ").toLocaleUpperCase()}
      type={"date"}
      variant="faded"
      placeholder="N/A"
      isReadOnly={!editable}
      fo
      name={name}
      value={new Date(values.date_of_birth!)
        .toLocaleDateString("en-CA")
        .replaceAll("/", "-")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        void setFieldValue("date_of_birth", e.currentTarget.valueAsNumber);
      }}
    />
  );
};

const FamilyMemberField = ({
  editable,
  label,
  value,
  targetName,
  setFamState,
}: {
  targetName: string;
  value: string;
  label: string;
  editable: boolean;
  setFamState: Dispatch<
    SetStateAction<
      {
        name: string;
        age: number;
        relationship: string;
        gender: string;
      }[]
    >
  >;
}) => {
  const updateField = (
    targetName: string,
    fieldName: string,
    newValue: string | number,
  ) => {
    setFamState((prevState) => {
      const updatedData = prevState.map((member) => {
        if (member.name === targetName) {
          return { ...member, [fieldName]: newValue };
        }
        return member;
      });
      return updatedData;
    });
  };

  return (
    <Input
      isDisabled={!editable}
      defaultValue={value}
      size="sm"
      label={label.toUpperCase()}
      variant="faded"
      className={label === "gender" ? "w-52" : label === "age" ? "w-22" : ""}
      onInput={(e) => {
        updateField(value, label, e.currentTarget.value);
      }}
    />
  );
};
