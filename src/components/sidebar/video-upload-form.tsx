import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { uploadVideoToS3 } from "../../lib/s3";
import { useToast } from "@/hooks/use-toast";
import { createVideo } from "@/db/mutations";

const VideoUploadForm: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async (event: React.FormEvent) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    let response;
    let video;
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);

      response = await uploadVideoToS3(formData);

      if (response.success) {
        // Actions confirmation
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

        // Add video to application DB
        video = await createVideo({
          title: selectedFile.name || "untitled",
          s3Key: response?.filename || "default_s3key",
          userId: "87c56f5f-e7fe-4938-9d83-7130c3f2d2ce",
        });
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
      console.log("VIDEO", video);
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
        <textarea
          id="notes"
          placeholder="Add notes about the video..."
        ></textarea>
      </div>
    </div>
  );
};

export default VideoUploadForm;
