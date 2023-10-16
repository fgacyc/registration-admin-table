import { Card, Checkbox, Divider, cn } from "@nextui-org/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { PinInput } from "react-input-pin-code";

const CalculatorPage = () => {
  const [isFullTimer, setIsFullTimer] = useState(false);
  const [withSpouse, setWithSpouse] = useState(false);
  const [noOvernight, setNoOvernight] = useState(false);
  const [kids4To12, setKids4To12] = useState(["0"]);

  const [locked, setLocked] = useState(false);

  const [overnightLocked, setOvernightLocked] = useState(false);
  const [totalFee, setTotalFee] = useState(200);

  useEffect(() => {
    if (!(withSpouse || Number(kids4To12[0]) > 0 || noOvernight)) {
      setLocked(false);
    } else {
      setLocked(true);
    }
  }, [kids4To12, withSpouse, noOvernight]);

  return (
    <>
      <Head>
        <title>Calculator | Registration</title>
        <meta name="description" content="Charts" />
        <link rel="icon" href="/fga.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] dark">
        <Card className="flex w-[340px] flex-col gap-2 p-4">
          <p>Confirm the first 2 choices first</p>
          <Checkbox
            size="sm"
            classNames={{
              base: cn(
                "inline-flex m-0 w-full min-w-full bg-content1",
                "hover:bg-content2 items-center justify-start",
                "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              label: "w-full",
            }}
            isSelected={isFullTimer}
            isDisabled={locked}
            onValueChange={(e) => {
              setIsFullTimer((prev) => !prev);
              if (e && noOvernight) {
                setTotalFee((prev) => prev - 130);
                setNoOvernight(false);
                setOvernightLocked(true);
              } else if (e) {
                setTotalFee((prev) => prev - 200);
                setNoOvernight(false);
                setOvernightLocked(true);
              } else {
                setTotalFee((prev) => prev + 200);
                setOvernightLocked(false);
              }
            }}
          >
            Fulltimer<span className="ml-1 text-red-500">*</span>
          </Checkbox>
          <Checkbox
            size="sm"
            classNames={{
              base: cn(
                "inline-flex m-0 w-full min-w-full bg-content1",
                "hover:bg-content2 items-center justify-start",
                "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              label: "w-full",
            }}
            isSelected={noOvernight}
            isDisabled={overnightLocked}
            onValueChange={(e) => {
              setNoOvernight((prev) => !prev);

              if (e) {
                setTotalFee((prev) => prev - 70);
              } else {
                setTotalFee((prev) => prev + 70);
              }
            }}
          >
            No Overnight<span className="ml-1 text-red-500">*</span>
          </Checkbox>
          <Divider />
          <Checkbox
            size="sm"
            classNames={{
              base: cn(
                "inline-flex m-0 w-full min-w-full bg-content1",
                "hover:bg-content2 items-center justify-start",
                "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              label: "w-full",
            }}
            isSelected={withSpouse}
            onValueChange={(e) => {
              setWithSpouse((prev) => !prev);
              if (e && isFullTimer) {
                setTotalFee((prev) => prev + 100);
              } else if (e) {
                setTotalFee((prev) => prev + (noOvernight ? 130 : 200));
              } else if (!e && isFullTimer) {
                setTotalFee((prev) => prev - 100);
              } else setTotalFee((prev) => prev - (noOvernight ? 130 : 200));
            }}
          >
            Spouse
          </Checkbox>

          <PinInput
            values={kids4To12}
            onChange={(_value, _index, values) => setKids4To12(values)}
            containerClassName="relative inline-flex h-14 min-h-unit-10 w-full flex-col items-start justify-center gap-0 rounded-medium bg-default-100 px-3 py-2 shadow-sm outline-none !duration-150 tap-highlight-transparent transition-background data-[hover=true]:bg-default-200 group-data-[focus-visible=true]:z-10 group-data-[focus=true]:bg-default-100 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background motion-reduce:transition-none"
          />
        </Card>
        <Card className="w-[340px] p-4">
          <p className="w-full text-center md:text-right">
            RM
            <span className="ml-1 text-2xl font-bold text-blue-700">
              {totalFee.toFixed(2)}
            </span>
          </p>
        </Card>
      </main>
    </>
  );
};

export default CalculatorPage;
