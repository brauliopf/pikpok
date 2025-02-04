import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignIn } from "@clerk/nextjs";

export const LoginForm = () => {
  return (
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
