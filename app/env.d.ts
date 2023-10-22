declare namespace NodeJS {
  export interface ProcessEnv {
    BACKEND_ENDPOINT: string;
    CLOUDINARY_KEY: string;
    CLOUDINARY_SECRET: string;
    CLOUDINARY_URL: string;
    NODE_ENV: string;
    SESSION_SECRET: string;
    RESEND_API_KEY: string;
  }
}
