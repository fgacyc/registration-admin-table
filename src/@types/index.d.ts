import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Entry = {
  additional_bed: "true" | 1 | 2;
  additional_joining: "true" | "false";
  contact_no: string;
  nric_passport: string;
  "full_name_as_per_IC_(en)": string;
  "full_name_(chi)": string;
  date_of_birth: EpochTimeStamp;
  email: string;
  gender: "female" | "Male";
  invited_by: "Pastoral" | "Recommendation" | "Ministry";
  marital_status: "Single" | "Married" | "Divorced / Widowed";
  ministry_team?: string;
  nickname: string;
  pastoral_team: string;
  service_location: string;
  user_id: string;
  family_members?: FamilyMember[];
  NO_ID_FIELD?: string;
};

export type FamilyMember = {
  id?: number;
  relationship: "Child" | "Spouse" | "Helper";
  age: number;
  name: string;
  gender: "male" | "female";
};
