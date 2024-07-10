import { Request, Response } from "express";
import destroyFile from "../utils/deleteFile";

export const fileUpload = async (req: Request, res: Response) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;
  res.send({ url: serverUrl + "/" + req.file?.filename });
};

export const deleteFile = async (req: Request, res: Response) => {
  const { fileName } = req.params;
  //file-1715154024306-7524-1.pdf
  const pathname = `public/${fileName}`;
  console.log(pathname);

  destroyFile(pathname);
  res.send({ message: "delete successfull" });
};
