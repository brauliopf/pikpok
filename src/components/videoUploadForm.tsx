"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { uploadVideoToS3 } from "../lib/s3";
import { useToast } from "@/hooks/use-toast";
import { createVideo } from "@/db/mutations/videos";
import { generateVideoMetadata } from "@/app/actions";
import { updateRecommendations } from "@/app/actions";

const VideoUploadForm: React.FC = () => {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  /**
   * Upload file to s3, add row to videos in app DB and adds video to processing queue on Redis
   */
  const handleUpload = async (event: React.FormEvent) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: `Please select a file first. ${event}`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to S3
      const formData = new FormData();
      formData.append("video", selectedFile);

      const response = await uploadVideoToS3(formData);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.error || "Upload failed",
          variant: "destructive",
        });
        throw new Error(response.error || "Upload failed");
      }

      // Add video to application DB
      const video = await createVideo({
        title: selectedFile.name || "untitled",
        s3Key: response?.filename || "default_s3Key",
        clerkId: user?.id || "",
      });

      // Create video metadata
      generateVideoMetadata({
        id: video.data.id,
        s3_key: video.data.s3Key,
      }).then(() => updateRecommendations());

      // Provide feedback
      if (response.success) {
        toast({
          title: "Success",
          description: "Video uploaded successfully",
        });
        setSelectedFile(null);

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        // Error Feedback
        toast({
          title: "Error",
          description: response.error || "Upload failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <input
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleFileChange}
          className=""
          disabled={uploading}
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className=""
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </div>

      <div>
        <h3>Selected File Details</h3>
        <p>
          <strong>Title:</strong>{" "}
          {selectedFile ? selectedFile.name : "No file selected"}
        </p>
        <p>
          <strong>Size:</strong>{" "}
          {selectedFile
            ? `${(selectedFile.size / 10 ** 6).toFixed(2)} MB`
            : "––"}
        </p>
        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" placeholder="Add notes about the video..." />
      </div>
    </div>
  );
};

export default VideoUploadForm;
