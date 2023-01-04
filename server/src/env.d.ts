declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    FRONTEND_URL: string;
    JWT_SECRET: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
  }
}
