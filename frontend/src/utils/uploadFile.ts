/*
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<string | null>} - The data returned from Cloudinary
 */

export const uploadFile = async (file: File): Promise<string | null> => {
  try {
    const fd = new FormData();
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    // fd.append('tags', 'browser_upload');
    fd.append("file", file);
    const resp = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      body: fd,
    });

    if (resp.status === 200) {
      return await resp.json();
    } else {
      throw new Error("Error uploading file");
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
