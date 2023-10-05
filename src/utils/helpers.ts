export const countOccurrences = (data: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  for (const value of data) {
    if (counts.hasOwnProperty(value)) {
      counts[value]++;
    } else {
      counts[value] = 1;
    }
  }

  return counts;
};

export const createData = (data: Record<string, number>) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };
};

export const transformDataToCSV = (
  data: Record<string, Record<string, string>[] | string | number>[],
) => {
  return data.map((d) => {
    let fam = "";

    (d.family_members as Record<string, string>[]).map(
      (fm) =>
        (fam += `(${fm.name}, ${fm.relationship}, ${fm.age}, ${fm.gender})`),
    );

    return {
      full_name_en: `"${d["full_name_as_per_IC_(en)"] as string}"`,
      full_name_chi: `"${d["full_name_(chi)"] as string}"`,
      nickname: `"${d.nickname as string}"`,
      gender: d.gender === "female" ? "Female" : "Male",
      dob: `"${new Date(d.date_of_birth as string).toLocaleDateString("en-US", {
        dateStyle: "long",
      })}"`,
      email: `"${d.email as string}"`,
      contact: `"${formatPhoneNumber((d.contact_no as string).trim())}"`,
      nric_passport: `"${formatICNumber((d.nric_passport as string).trim())}"`,
      marital_status: d.marital_status,
      satellite: d.service_location,
      pastoral_team: d.pastoral_team,
      invited_by: d.invited_by,
      ministry_team: `"${d.ministry_team as string}"`,
      beds: 1 + Number(d.additional_bed === "false" ? 0 : d.additional_bed),
      family_members: d.additional_joining ? `"${fam}"` : "N/A",
    };
  });
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove "+6" if it starts with "+60"
  if (phoneNumber.startsWith("+60")) {
    phoneNumber = "0" + phoneNumber.slice(3);
  }

  // Add a "0" at the front if it doesn't start with "0"
  if (!phoneNumber.startsWith("0")) {
    phoneNumber = "0" + phoneNumber;
  }

  // Insert a "-" at index 3
  phoneNumber = phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3);

  return phoneNumber;
};

export const formatICNumber = (icNumber: string) => {
  // Remove any existing "-" characters
  icNumber = icNumber.replace(/-/g, "");

  // Check if the IC number has 12 characters
  if (icNumber.length === 12) {
    icNumber =
      icNumber.slice(0, 6) +
      "-" +
      icNumber.slice(6, 8) +
      "-" +
      icNumber.slice(8);
  }

  return icNumber;
};
