import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary environment variables. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadProductImageToCloudinary({
  buffer,
  contentType,
}: {
  buffer: Buffer;
  contentType: string;
}) {
  configureCloudinary();

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "luxe-commerce/products",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        tags: ["luxe-commerce", "product"],
        context: {
          source: "luxe-commerce-admin",
          contentType,
        },
      },
      (error: unknown, result?: { secure_url?: string }) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload did not return a secure URL."));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}
