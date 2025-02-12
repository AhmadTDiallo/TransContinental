import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  return new Promise<void>((resolve) => {
    form.parse(req, (err, _fields, files) => {
      if (err) {
        console.error("Error parsing files:", err);
        res.status(500).json({ error: "Error parsing files" });
        return resolve();
      }
      const fileUrls: Record<string, any> = {};

      if (files.billOfLading) {
        if (Array.isArray(files.billOfLading)) {
          fileUrls.billOfLading = files.billOfLading.map((file) => `/uploads/${path.basename((file as any).filepath)}`);
        } else {
          fileUrls.billOfLading = [`/uploads/${path.basename((files.billOfLading as any).filepath)}`];
        }
      }
      if (files.packingList) {
        if (Array.isArray(files.packingList)) {
          fileUrls.packingList = `/uploads/${path.basename((files.packingList[0] as any).filepath)}`;
        } else {
          fileUrls.packingList = `/uploads/${path.basename((files.packingList as any).filepath)}`;
        }
      }
      if (files.commercialInvoice) {
        if (Array.isArray(files.commercialInvoice)) {
          fileUrls.commercialInvoice = `/uploads/${path.basename((files.commercialInvoice[0] as any).filepath)}`;
        } else {
          fileUrls.commercialInvoice = `/uploads/${path.basename((files.commercialInvoice as any).filepath)}`;
        }
      }
      res.status(200).json(fileUrls);
      return resolve();
    });
  });
} 