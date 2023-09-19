import { useState, type ReactNode, useMemo, useCallback } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Link,
  type Selection,
  type SortDescriptor,
  Chip,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import { VerticalDotsIcon } from "@/graphics/VerticalDotsIcon";
import { SearchIcon } from "@/graphics/SearchIcon";
import Head from "next/head";

export default function App() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "service_location",
    direction: "descending",
  });

  const [selectedFam, setSelectedFam] = useState<
    FamilyMember & { from: string }
  >({
    age: 0,
    gender: "male",
    name: "",
    relationship: "Spouse",
    from: "",
  });

  const firestore = useFirestore();
  const ref = collection(firestore, "registrations");
  const { status, data } = useFirestoreCollectionData(ref);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  type FamilyMember = {
    relationship: "Child" | "Spouse" | "Helper";
    age: number;
    name: string;
    gender: "male" | "female";
  };

  const hasSearchFilter = Boolean(filterValue);

  const columns = [
    { name: "NAME", key: "name" },
    { name: "NICKNAME", key: "nickname" },
    { name: "EMAIL", key: "email" },
    { name: "CONTACT", key: "contact_no" },
    { name: "DOB", key: "date_of_birth" },
    { name: "INVITED BY", key: "invited_by" },
    { name: "SATELLITE", key: "service_location" },
    { name: "PASTORAL TEAM", key: "pastoral_team" },
    { name: "BED(S)", key: "beds" },
    { name: "FAMILY MEMBERS", key: "fam" },
  ];

  const filteredItems = useMemo(() => {
    if (status !== "success") return [];
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          String(user["full_name_as_per_IC_(en)"])
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          String(user["full_name_(chi)"])
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          String(user.nickname)
            .toLowerCase()
            .includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [data, filterValue, hasSearchFilter, status]);

  const sortedItems = useMemo(() => {
    if (status !== "success") return;
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as string] as number;
      const second = b[sortDescriptor.column as string] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems, status]);

  const renderCell = useCallback(
    (item: Record<string, unknown>, columnKey: React.Key) => {
      const cellValue = item[columnKey as string];

      switch (columnKey) {
        case "name":
          return `${String(item["full_name_as_per_IC_(en)"])} | ${String(
            item["full_name_(chi)"],
          )}`;
        case "contact_no":
          return (
            <Link href={`tel:${String(cellValue)}`}>
              {String(cellValue).replace("-", "")}
            </Link>
          );
        case "invited_by":
          return item.invited_by === "Ministry"
            ? `${String(item.invited_by)} | ${String(item.ministry_team)}`
            : cellValue;
        case "date_of_birth":
          return new Date(item.date_of_birth as string).toLocaleDateString(
            "en-US",
            {
              dateStyle: "long",
            },
          );
        case "beds": {
          const val =
            1 +
            Number(item.additional_bed === "false" ? 0 : item.additional_bed);
          return (
            <Chip
              variant="flat"
              size="sm"
              color={val === 3 ? "danger" : val === 2 ? "warning" : "success"}
            >
              {val}
            </Chip>
          );
        }
        case "fam": {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const val: FamilyMember[] = item.family_members;

          return (
            <div className="flex max-w-[150px] flex-row gap-3 overflow-x-scroll">
              {val
                .sort((a, b) => a.age - b.age)
                .map((e, i) => (
                  <Chip
                    variant="dot"
                    color={
                      e.age < 3
                        ? "primary"
                        : e.age < 11
                        ? "success"
                        : "secondary"
                    }
                    size="sm"
                    key={i}
                    className="cursor-pointer"
                    onClick={() => {
                      onOpen();
                      setSelectedFam({
                        ...e,
                        from:
                          String(item.nickname) ||
                          String(item["full_name_as_per_IC_(en)"]),
                      });
                    }}
                  >
                    {e.name}, {e.age}
                  </Chip>
                ))}
            </div>
          );
        }
        case "actions":
          return (
            <div className="relative flex items-center justify-end gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>View</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onOpen],
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="text-white"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, onClear]);

  const bottomContent = useMemo(() => {
    if (status !== "success") return;
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems?.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, filteredItems, status]);

  return (
    <>
      <Head>
        <title>Admin | Registration</title>
        <meta name="description" content="Admin Panel" />
        <link rel="icon" href="/fga.png" />
      </Head>
      <Modal
        className={`text-white dark`}
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
              <ModalHeader className="flex flex-col gap-1">
                {selectedFam.from} / {selectedFam.name}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input
                  isReadOnly
                  label="Relationship"
                  value={selectedFam.relationship}
                  variant="faded"
                />
                <Input
                  isReadOnly
                  label="Age"
                  value={String(selectedFam.age)}
                  variant="faded"
                />
                <Input
                  isReadOnly
                  label="Gender"
                  value={selectedFam.gender}
                  variant="faded"
                  style={{ textTransform: "capitalize" }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    onClose();
                    setSelectedFam({
                      age: 0,
                      gender: "male",
                      name: "",
                      relationship: "Spouse",
                      from: "",
                    });
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 dark">
        {status === "success" ? (
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[80vh] text-white",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  allowsSorting={
                    column.key === "beds" ||
                    column.key === "date_of_birth" ||
                    column.key === "contact_no" ||
                    column.key === "email" ||
                    column.key === "fam"
                      ? false
                      : true
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
              {(item) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <TableRow key={item.user_id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(item, columnKey) as ReactNode}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div>Loading</div>
        )}
      </main>
    </>
  );
}
