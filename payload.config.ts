import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";
import { AboutPage } from "@/src/globals/AboutPage";
import { Capabilities } from "@/src/collections/Capabilities";
import { Certifications } from "@/src/collections/Certifications";
import { ContactPage } from "@/src/globals/ContactPage";
import { Enquiries } from "@/src/collections/Enquiries";
import { Homepage } from "@/src/globals/Homepage";
import { Media } from "@/src/collections/Media";
import { ProjectCategories } from "@/src/collections/ProjectCategories";
import { Projects } from "@/src/collections/Projects";
import { Sectors } from "@/src/collections/Sectors";
import { Services } from "@/src/collections/Services";
import { SiteSettings } from "@/src/globals/SiteSettings";
import { Testimonials } from "@/src/collections/Testimonials";
import { Users } from "@/src/collections/Users";
import {
  env,
  isSMTPConfigured,
  isStorageConfigured,
  validateRuntimeEnvironment,
} from "@/src/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const storageEnabled = isStorageConfigured();

const plugins = [
  s3Storage({
    enabled: storageEnabled,
    bucket: env.storage.bucket || "local-media",
    clientUploads: env.storage.clientUploads,
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename: mediaFilename, prefix }) => {
          const key = prefix ? `${prefix}/${mediaFilename}` : mediaFilename;
          return `${env.storage.publicURL}/${key}`;
        },
      },
    },
    config: {
      endpoint: env.storage.endpoint,
      region: env.storage.region,
      forcePathStyle: env.storage.forcePathStyle,
      credentials: {
        accessKeyId: env.storage.accessKeyId || "disabled",
        secretAccessKey: env.storage.secretAccessKey || "disabled",
      },
    },
  }),
];

const email = isSMTPConfigured()
  ? nodemailerAdapter({
      defaultFromAddress: env.smtp.fromEmail || "noreply@example.invalid",
      defaultFromName: env.smtp.fromName,
      transportOptions: {
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.password,
        },
      },
    })
  : undefined;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— Zum Zum Enterprises",
      description: "Zum Zum Enterprises content administration",
    },
  },
  collections: [
    Users,
    Media,
    ProjectCategories,
    Projects,
    Services,
    Sectors,
    Capabilities,
    Testimonials,
    Certifications,
    Enquiries,
  ],
  globals: [SiteSettings, Homepage, AboutPage, ContactPage],
  cors: [env.serverURL],
  csrf: [env.serverURL],
  db: postgresAdapter({
    pool: { connectionString: env.databaseURI },
    migrationDir: path.resolve(dirname, "src/migrations"),
    push: process.env.NODE_ENV !== "production",
  }),
  editor: lexicalEditor(),
  email,
  onInit: async () => {
    validateRuntimeEnvironment();
  },
  plugins,
  secret: env.payloadSecret,
  serverURL: env.serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
