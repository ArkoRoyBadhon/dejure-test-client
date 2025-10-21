import * as tus from "tus-js-client";

// Step 1: Get Vimeo upload URL
export async function getVimeoUploadLink(videoFile) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vimeo/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoName: videoFile.name,
      size: videoFile.size,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Upload ticket failed: " + errText);
  }

  const { upload_link, video_uri } = await res.json();
  return { upload_link, video_uri };
}

// Step 2: Upload to Vimeo using tus
export function uploadToVimeoTUS(
  videoFile,
  uploadLink,
  onSuccess,
  onError,
  onProgress // Added progress callback
) {
  const upload = new tus.Upload(videoFile, {
    uploadUrl: uploadLink,
    metadata: {
      filename: videoFile.name,
      filetype: videoFile.type,
    },
    onError,
    onSuccess,
    onProgress: (bytesUploaded, bytesTotal) => {
      // Call the progress callback
      if (typeof onProgress === "function") {
        onProgress(bytesUploaded, bytesTotal);
      }
    },
    // Optional: Chunk size (can help with progress updates)
    chunkSize: 5 * 1024 * 1024, // 5MB chunks
  });

  upload.start();
}