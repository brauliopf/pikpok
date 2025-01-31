export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboarded?: boolean;
      first_name: string;
    };
  }
}
