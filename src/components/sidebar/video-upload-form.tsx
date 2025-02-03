import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignIn, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { uploadVideoToS3 } from "../../lib/s3";
import { useToast } from "@/hooks/use-toast";

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

    try {
      const formData = new FormData();
      formData.append("video", selectedFile);

      const response = await uploadVideoToS3(formData);

      if (response.success) {
        console.log("RESPOSTA SUCCESS!!!", response);
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

  return user ? (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>File Upload</DialogTitle>
        <DialogDescription>Select Video to Upload (.mp4)</DialogDescription>
      </DialogHeader>

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
    </DialogContent>
  ) : (
    <DialogContent>
      <div style={{ display: "none" }}>
        <DialogHeader>
          <DialogTitle>Login Form</DialogTitle>
          <DialogDescription>Login to upload your content</DialogDescription>
        </DialogHeader>
      </div>
      <div className="justify-center">
        <SignIn />
      </div>
    </DialogContent>
  );
};

export default VideoUploadForm;
