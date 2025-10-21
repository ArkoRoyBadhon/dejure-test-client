"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/redux/features/lecture/class.api";
import { toast } from "sonner";
import { getVimeoUploadLink, uploadToVimeoTUS } from "@/Utils/VideoUpload";
import { Progress } from "@/components/ui/progress";

export default function ClassFormModal({
  open,
  setOpen,
  editable,
  lectureId,
  subjectTypeId,
  courseId,
}) {
  const [form, setForm] = useState({ title: "", length: "", url: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Reset form function
  const resetForm = () => {
    setForm({ title: "", length: "", url: "" });
    setVideoFile(null);
    setUploading(false);
    setUploadProgress(0);
  };

  useEffect(() => {
    if (editable) {
      setForm({
        title: editable.title,
        length: editable.length,
        url: editable.url,
      });
    } else {
      resetForm();
    }
  }, [editable, open]);

  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();

  const detectVideoLength = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    if (!videoFile && !form.url) {
      toast.error("Please select a video file");
      return;
    }

    let videoUrl = form.url;
    let length = form.length;

    if (videoFile) {
      setUploading(true);
      setUploadProgress(0);
      try {
        // Detect length again in case user changed file
        const duration = await detectVideoLength(videoFile);
        const min = Math.floor(duration / 60);
        const sec = Math.round(duration % 60);
        length = min > 0 ? `${min}min${sec > 0 ? ` ${sec}s` : ""}` : `${sec}s`;

        const { upload_link, video_uri } = await getVimeoUploadLink(videoFile);
        await new Promise((resolve, reject) => {
          uploadToVimeoTUS(
            videoFile,
            upload_link,
            () => {
              videoUrl = `https://vimeo.com${video_uri}`;
              setUploading(false);
              resolve();
            },
            (error) => {
              toast.error("Upload failed: " + error.message);
              setUploading(false);
              reject(error);
            },
            (bytesUploaded, bytesTotal) => {
              const progress = Math.round((bytesUploaded / bytesTotal) * 100);
              setUploadProgress(progress);
            }
          );
        });
      } catch (err) {
        toast.error("Something went wrong: " + err.message);
        setUploading(false);
        return;
      }
    }

    const payload = {
      ...form,
      url: videoUrl,
      length,
      subject: lectureId,
      subjectType: subjectTypeId,
      course: courseId,
    };

    try {
      if (editable) {
        await updateClass({ id: editable._id, patch: payload }).unwrap();
        toast.success("Class updated");
      } else {
        await createClass(payload).unwrap();
        toast.success("Class created");
      }
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save class");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="space-y-4">
        <DialogTitle className="font-bold text-lg text-center">
          {editable ? "Update Class" : "Add Class"}
        </DialogTitle>

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Input
          type="file"
          accept="video/*"
          onChange={async (e) => {
            const file = e.target.files?.[0] || null;
            setVideoFile(file);
            setUploadProgress(0);
            if (file) {
              const duration = await detectVideoLength(file);
              const min = Math.floor(duration / 60);
              const sec = Math.round(duration % 60);
              setForm((prev) => ({
                ...prev,
                length:
                  min > 0 ? `${min}min${sec > 0 ? ` ${sec}s` : ""}` : `${sec}s`,
              }));
            } else {
              setForm((prev) => ({ ...prev, length: "" }));
            }
          }}
          className="cursor-pointer"
        />

        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-gray-600">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {form.url && !videoFile && (
          <p className="text-sm text-green-600">✅ Uploaded: {form.url}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={creating || updating || uploading}
          className="w-full bg-yellow-200 hover:bg-yellow-100 border border-yellow-500 text-black shadow-lg"
        >
          {editable
            ? updating || uploading
              ? "Updating..."
              : "Update"
            : creating || uploading
            ? "Creating..."
            : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
