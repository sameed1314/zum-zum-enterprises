const localDatabaseURI =
  "postgresql://payload:payload@127.0.0.1:5432/zum_zum_enterprises";

function parseBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function validHTTPURL(value: string | undefined): boolean {
  if (!value) return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export const env = {
  databaseURI: process.env.DATABASE_URI || localDatabaseURI,
  payloadSecret:
    process.env.PAYLOAD_SECRET || "build-only-secret-runtime-validation-will-fail",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  previewSecret: process.env.PREVIEW_SECRET,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: parseBoolean(process.env.SMTP_SECURE),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME || "Zum Zum Enterprises",
  },
  storage: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "auto",
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    publicURL: process.env.S3_PUBLIC_URL?.replace(/\/$/, ""),
    forcePathStyle: parseBoolean(process.env.S3_FORCE_PATH_STYLE, true),
    clientUploads: parseBoolean(process.env.S3_CLIENT_UPLOADS, true),
  },
} as const;

export const isCMSConfigured = (): boolean =>
  Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET);

export const isSMTPConfigured = (): boolean =>
  Boolean(
    env.smtp.host &&
      env.smtp.user &&
      env.smtp.password &&
      env.smtp.fromEmail,
  );

export const isStorageConfigured = (): boolean =>
  Boolean(
    env.storage.endpoint &&
      env.storage.bucket &&
      env.storage.accessKeyId &&
      env.storage.secretAccessKey &&
      env.storage.publicURL,
  );

export function validateRuntimeEnvironment(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (!process.env.DATABASE_URI) missing.push("DATABASE_URI");
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
    missing.push("PAYLOAD_SECRET (minimum 32 characters)");
  }
  if (!validHTTPURL(process.env.NEXT_PUBLIC_SERVER_URL)) {
    missing.push("NEXT_PUBLIC_SERVER_URL (valid HTTP/HTTPS URL)");
  }
  if (!process.env.PREVIEW_SECRET || process.env.PREVIEW_SECRET.length < 24) {
    missing.push("PREVIEW_SECRET (minimum 24 characters)");
  }
  if (!isStorageConfigured()) {
    missing.push(
      "S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY and S3_PUBLIC_URL",
    );
  }
  if (env.storage.publicURL && !validHTTPURL(env.storage.publicURL)) {
    missing.push("S3_PUBLIC_URL (valid HTTP/HTTPS URL)");
  }
  if (missing.length > 0) {
    throw new Error(
      `Zum Zum CMS is missing required production configuration: ${missing.join(", ")}`,
    );
  }
}
