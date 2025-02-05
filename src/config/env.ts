import { config } from "dotenv";
import { z } from "zod"; // Zod is a TypeScript-first schema declaration and validation library. - https://zod.dev/

config({ path: ".env" });

// Schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string(),
});

// Function to validate environment variables
const validateEnv = () => {
  try {
    console.log("Validating environment variables");
    const env = {
      DATABASE_URL: process.env.DATABASE_URL,
      // CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
    };
    const parsed = envSchema.parse(env);
    console.log("Environment variables validated successfully");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join("."));
      console.log("Invalid environment variables", { error: { missingVars } });
      throw new Error(
        `❌ Invalid environment variables: ${missingVars.join(", ")}. Please check your .env file`
      );
    }
    throw error;
  }
};

export const env = validateEnv();
