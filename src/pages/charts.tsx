import { countOccurrences, createData } from "@/utils/helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { collection } from "firebase/firestore";
import { type NextPage } from "next";
import { Bar, Pie } from "react-chartjs-2";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import autocolors from "chartjs-plugin-autocolors";
import Head from "next/head";
import { useLayoutEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  autocolors,
  ArcElement,
);

const ChartsPage: NextPage = () => {
  const firestore = useFirestore();
  const ref = collection(firestore, "registrations");
  const { status, data } = useFirestoreCollectionData(ref);
  const [isPC, setIsPC] = useState(false);

  useLayoutEffect(() => {
    const width = window.innerWidth;
    // console.log(width);
    width > 768 ? setIsPC(true) : setIsPC(false);
  }, []);

  return (
    <>
      <Head>
        <title>Charts | Registration</title>
        <meta name="description" content="Charts" />
        <link rel="icon" href="/fga.png" />
      </Head>
      <main className="flex min-h-screen flex-col gap-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-5 dark">
        {status === "success" ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="h-1/2 w-full rounded-lg bg-white p-3 md:w-1/2">
                <Bar
                  options={{
                    aspectRatio: !isPC ? 0.75 : undefined,
                    responsive: true,
                    layout: {
                      autoPadding: false,
                    },
                    scales: {
                      x: {
                        ticks: {
                          display: isPC,
                        },
                      },
                    },

                    plugins: {
                      legend: { display: false, position: "top" as const },
                      autocolors: {
                        mode: "data",
                      },
                      title: {
                        color: "#b12aff",
                        display: true,
                        text: "SERVICE LOCATION",
                      },
                      // tooltips: {
                      //   enabled: true,
                      //   mode: "label",
                      //   callbacks: {
                      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //     // @ts-ignore
                      //     title: function (tooltipItems, data) {
                      //       const idx = tooltipItems[0].index;
                      //       return "Title:" + data.labels[idx]; //do something with title
                      //     },
                      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //     // @ts-ignore
                      //     label: function (tooltipItems) {
                      //       //var idx = tooltipItems.index;
                      //       //return data.labels[idx] + ' €';
                      //       return tooltipItems.xLabel + " €";
                      //     },
                      //   },
                      // },
                    },
                  }}
                  data={createData(
                    countOccurrences(
                      data.map((a) =>
                        String(`${a.service_location} ${a.pastoral_team}`),
                      ),
                    ),
                  )}
                />
              </div>
              <div className="h-1/2 w-full rounded-lg  bg-white p-3 md:w-1/2">
                <Bar
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false, position: "top" as const },
                      autocolors: {
                        mode: "data",
                      },
                      title: {
                        color: "#b12aff",
                        display: true,
                        text: "INVITED BY",
                      },
                    },
                  }}
                  data={createData(
                    countOccurrences(data.map((a) => String(a.invited_by))),
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="h-1/2 w-full rounded-lg bg-white p-3 md:w-1/2">
                <Bar
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false, position: "top" as const },
                      autocolors: {
                        mode: "data",
                      },
                      title: {
                        color: "#b12aff",
                        display: true,
                        text: "PASTORAL TEAM",
                      },
                    },
                  }}
                  data={createData(
                    countOccurrences(
                      data.map((a) => String(a.service_location)),
                    ),
                  )}
                />
              </div>
              <div className="h-1/2 rounded-lg bg-white p-3">
                <Pie
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false, position: "top" as const },
                      autocolors: {
                        mode: "data",
                      },
                      title: {
                        color: "#b12aff",
                        display: true,
                        text: "GENDER",
                      },
                    },
                  }}
                  data={createData(
                    countOccurrences(data.map((a) => String(a.gender))),
                  )}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-white">Loading</div>
        )}
      </main>
    </>
  );
};

export default ChartsPage;
