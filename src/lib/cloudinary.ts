// Cloudinary upload helper (server-side only)
// Add your Cloudinary credentials to .env to enable image/video uploads

export async function uploadToCloudinary(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; publicId: string } | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dhhbw2ycg";
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "shreekrishna";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Cloudinary upload error:", err);
      return null;
    }

    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName === "your_cloud_name") {
    return false;
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await generateSHA1(str);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body: formData }
    );

    return res.ok;
  } catch {
    return false;
  }
}

async function generateSHA1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
