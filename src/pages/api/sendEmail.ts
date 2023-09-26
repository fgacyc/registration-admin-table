import type { NextApiRequest, NextApiResponse } from "next";
import mailjet from "node-mailjet";
import { env } from "@/env.mjs";

const sendEmailAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const { to, recipientName } = req.body as {
    to: string;
    recipientName: string;
  };

  const mailjetClient = mailjet.apiConnect(
    env.MAILJET_API_PUBLIC_KEY,
    env.MAILJET_API_SECRET_KEY,
  );

  const sendEmail = async () => {
    const emailData = {
      Messages: [
        {
          From: { Email: "info@fgacyc.com", Name: "CYC Leaders Retreat 2023" },
          To: [
            {
              Email: String(to),
              Name: String(recipientName),
            },
          ],
          Subject: String(recipientName),
          TextPart: "Hello Again!",
        },
      ],
    };

    const result = await mailjetClient
      .post("send", { version: "v3.1", output: "json" })
      .request(emailData);
    return result;
  };

  //   res.status(200).json({ message: "Hi" });

  try {
    const result = await sendEmail();
    console.log(result);
    res
      .status(result.response.status)
      .json({ message: result.response.statusText });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default sendEmailAPI;
