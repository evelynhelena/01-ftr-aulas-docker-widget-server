// src/functions/upload-image-to-storage.ts
import z from "zod";
import { Readable } from "stream";
var uploadImageToStorageRequest = z.object({
  name: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
});
var UploadImageToStorage = class {
  constructor(storage) {
    this.storage = storage;
  }
  async execute(request) {
    const { name, contentType, contentStream } = uploadImageToStorageRequest.parse(request);
    const { url } = await this.storage.uploadFileAsStream({
      path: `images/${name}`,
      contentType,
      stream: contentStream
    });
    return { url };
  }
};

export {
  UploadImageToStorage
};
