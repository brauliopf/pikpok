export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboarded?: boolean;
      applicationName: string;
      appplicationType?: string;
    };
    firstName: string;
  }
}
