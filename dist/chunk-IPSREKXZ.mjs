import {
  UploadImageToStorage
} from "./chunk-KY6VS4RU.mjs";
import {
  R2StorageProvider
} from "./chunk-D7BEHAO5.mjs";

// src/routes/upload-image.ts
var MAXIMUM_FILE_SIZE_IN_BYTES = 1024 * 1024 * 4;
async function uploadImageRoute(app) {
  app.post("/uploads", async (request, reply) => {
    const uploadedFile = await request.file({
      limits: { fileSize: MAXIMUM_FILE_SIZE_IN_BYTES }
    });
    if (!uploadedFile) {
      return reply.status(400).send({ message: "Invalid file provided." });
    }
    const { filename, file: contentStream, mimetype } = uploadedFile;
    const storageProvider = new R2StorageProvider();
    const uploadImageToStorage = new UploadImageToStorage(storageProvider);
    const { url } = await uploadImageToStorage.execute({
      name: filename,
      contentStream,
      contentType: mimetype
    });
    if (uploadedFile.file.truncated) {
      return reply.status(400).send({
        message: `File size must be a maximum of 4MB..`
      });
    }
    await reply.status(201).send({ url });
  });
}

export {
  uploadImageRoute
};
