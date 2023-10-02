/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextApiRequest, NextApiResponse } from "next";
import mailjet from "node-mailjet";

const enableCORS =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Replace this with your actual origin
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );

    // Specific logic for the preflight request
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return await handler(req, res);
  };

const sendEmailAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { to, recipientName } = req.body as {
      to: string;
      recipientName: string;
    };

    console.log(to, req);

    const mailjetClient = mailjet.apiConnect(
      String(process.env.MAILJET_API_PUBLIC_KEY),
      String(process.env.MAILJET_API_SECRET_KEY),
    );

    const sendEmail = async () => {
      const emailData = {
        Messages: [
          {
            From: {
              Email: "info@fgacyc.com",
              Name: "CYC Leaders Retreat 2023",
            },
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
        .status(Number(result.response.status))
        .json({ message: result.response.statusText });
    } catch (error) {
      // console.error("Error sending email:", error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};

module.exports = enableCORS(sendEmailAPI);
