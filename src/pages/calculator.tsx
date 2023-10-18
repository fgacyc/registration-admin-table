import { Button, Card, Checkbox, Divider, cn } from "@nextui-org/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { PinInput } from "react-input-pin-code";

const CalculatorPage = () => {
  const [isFullTimer, setIsFullTimer] = useState(false);
  const [withSpouse, setWithSpouse] = useState(false);
  const [noOvernight, setNoOvernight] = useState(false);
  const [kids4To12, setKids4To12] = useState(["0"]);
  const [kidsBelow4, setKidsBelow4] = useState(["0"]);
  const [kidsTotalFee, setKidsTotalFee] = useState(0);
  const [additionalBed, setAdditionalBed] = useState(["0"]);
  const [bedFee, setBedFee] = useState(0);
  const [subsidy, setSubsidy] = useState(false);

  const [locked, setLocked] = useState(false);

  const [overnightLocked, setOvernightLocked] = useState(false);
  const [totalFee, setTotalFee] = useState(200);

  useEffect(() => {
    if (
      !(
        withSpouse ||
        Number(kids4To12[0]) > 0 ||
        Number(kidsBelow4[0]) > 0 ||
        Number(additionalBed[0]) > 0 ||
        noOvernight ||
        subsidy
      )
    ) {
      setLocked(false);
    } else {
      setLocked(true);
    }
  }, [kids4To12, withSpouse, noOvernight, kidsBelow4, additionalBed, subsidy]);

  useEffect(() => {
    if (
      !(
        withSpouse ||
        Number(kids4To12[0]) > 0 ||
        Number(kidsBelow4[0]) > 0 ||
        Number(additionalBed[0]) > 0 ||
        isFullTimer ||
        subsidy
      )
    ) {
      setOvernightLocked(false);
    } else {
      setOvernightLocked(true);
    }
  }, [kids4To12, withSpouse, isFullTimer, kidsBelow4, additionalBed, subsidy]);

  useEffect(() => {
    setKidsTotalFee(Number(kids4To12[0]) * 75);
  }, [kids4To12]);

  useEffect(() => {
    setBedFee(Number(additionalBed[0]) * 50);
  }, [additionalBed]);

  return (
    <>
      <Head>
        <title>Calculator | Registration</title>
        <meta name="description" content="Calculator" />
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
          <p className="w-full text-center text-sm font-bold">Kids</p>
          <div className="flex w-full flex-row justify-center gap-2">
            <div className="flex flex-col items-center justify-center">
              <p className="mb-1 text-xs">Below 4</p>
              <PinInput
                values={kidsBelow4}
                onChange={(_value, _index, values) => setKidsBelow4(values)}
                containerClassName="relative inline-flex h-14 min-h-unit-10 w-full flex-col items-start justify-center gap-0 rounded-medium bg-default-100 px-3 py-2 shadow-sm outline-none !duration-150 tap-highlight-transparent transition-background data-[hover=true]:bg-default-200 group-data-[focus-visible=true]:z-10 group-data-[focus=true]:bg-default-100 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background motion-reduce:transition-none"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="mb-1 text-xs">4-12</p>
              <PinInput
                values={kids4To12}
                onChange={(_value, _index, values) => {
                  setKids4To12(values);
                }}
                containerClassName="relative inline-flex h-14 min-h-unit-10 w-full flex-col items-start justify-center gap-0 rounded-medium bg-default-100 px-3 py-2 shadow-sm outline-none !duration-150 tap-highlight-transparent transition-background data-[hover=true]:bg-default-200 group-data-[focus-visible=true]:z-10 group-data-[focus=true]:bg-default-100 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background motion-reduce:transition-none"
              />
            </div>
          </div>
          <p className="mt-2 w-full text-center text-sm font-bold">
            Additional Bed
          </p>
          <div className="flex w-full flex-row justify-center gap-2">
            <PinInput
              values={additionalBed}
              onChange={(_value, _index, values) => setAdditionalBed(values)}
              containerClassName="relative inline-flex h-14 min-h-unit-10 w-full flex-col items-start justify-center gap-0 rounded-medium bg-default-100 px-3 py-2 shadow-sm outline-none !duration-150 tap-highlight-transparent transition-background data-[hover=true]:bg-default-200 group-data-[focus-visible=true]:z-10 group-data-[focus=true]:bg-default-100 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background motion-reduce:transition-none"
            />
          </div>

          {!isFullTimer && (
            <>
              <Divider className="mt-2" />
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
                isSelected={subsidy}
                onValueChange={() => {
                  setSubsidy((prev) => !prev);
                }}
              >
                Subsidy
              </Checkbox>
            </>
          )}
        </Card>
        <Card className="w-[340px] p-4">
          <p className="w-full text-center md:text-right">
            RM
            <span className="ml-1 text-2xl font-bold text-blue-700">
              {(totalFee + kidsTotalFee + bedFee - (subsidy ? 100 : 0)).toFixed(
                2,
              )}
            </span>
          </p>
        </Card>
        <Button
          // variant="flat"
          color="secondary"
          className="w-[340px]"
          onPress={() => {
            setIsFullTimer(false);
            setNoOvernight(false);

            setKidsBelow4(["0"]);
            setKids4To12(["0"]);
            setAdditionalBed(["0"]);

            setLocked(false);
            setOvernightLocked(false);

            setTotalFee(200);

            setWithSpouse(false);
            setSubsidy(false);
          }}
        >
          Reset
        </Button>
      </main>
    </>
  );
};

export default CalculatorPage;
