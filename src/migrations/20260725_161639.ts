import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'editor', 'enquiry-manager');
  CREATE TYPE "public"."enum_media_category" AS ENUM('Project', 'Company', 'Team', 'Certification', 'Website', 'Document');
  CREATE TYPE "public"."enum_projects_gallery_layout" AS ENUM('standard', 'wide', 'portrait');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_gallery_layout" AS ENUM('standard', 'wide', 'portrait');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'site-visit-planned', 'proposal-in-progress', 'proposal-sent', 'won', 'lost', 'closed', 'spam');
  CREATE TYPE "public"."enum_enquiries_priority" AS ENUM('low', 'normal', 'high', 'urgent');
  CREATE TYPE "public"."enum_enquiries_email_notification_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"active" boolean DEFAULT true,
  	"profile_image_id" integer,
  	"phone" varchar,
  	"last_login_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"caption" varchar,
  	"photographer" varchar,
  	"project_id" integer,
  	"category" "enum_media_category",
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_gallery_url" varchar,
  	"sizes_gallery_width" numeric,
  	"sizes_gallery_height" numeric,
  	"sizes_gallery_mime_type" varchar,
  	"sizes_gallery_filesize" numeric,
  	"sizes_gallery_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "project_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"display_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "projects_construction_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"alt_override" varchar,
  	"display_order" numeric DEFAULT 0,
  	"layout" "enum_projects_gallery_layout" DEFAULT 'standard'
  );
  
  CREATE TABLE "projects_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before_id" integer,
  	"after_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"short_summary" varchar,
  	"category_id" integer,
  	"location" varchar,
  	"district" varchar,
  	"year" varchar,
  	"status" "enum_projects_status" DEFAULT 'completed',
  	"client_type" varchar,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"published_at" timestamp(3) with time zone,
  	"scope_of_work" varchar,
  	"contract_type" varchar,
  	"built_up_area" varchar,
  	"duration" varchar,
  	"start_date" timestamp(3) with time zone,
  	"completion_date" timestamp(3) with time zone,
  	"project_value_value" varchar,
  	"project_value_display_publicly" boolean DEFAULT false,
  	"architect_consultant" varchar,
  	"execution_responsibilities" varchar,
  	"quality_control" varchar,
  	"safety_information" varchar,
  	"overview" jsonb,
  	"challenge" jsonb,
  	"execution_approach" jsonb,
  	"outcome" jsonb,
  	"quality_and_safety" jsonb,
  	"additional_notes" jsonb,
  	"cover_image_id" integer,
  	"hero_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_projects_v_version_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_construction_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"caption" varchar,
  	"alt_override" varchar,
  	"display_order" numeric DEFAULT 0,
  	"layout" "enum__projects_v_version_gallery_layout" DEFAULT 'standard',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"before_id" integer,
  	"after_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_short_summary" varchar,
  	"version_category_id" integer,
  	"version_location" varchar,
  	"version_district" varchar,
  	"version_year" varchar,
  	"version_status" "enum__projects_v_version_status" DEFAULT 'completed',
  	"version_client_type" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_published_at" timestamp(3) with time zone,
  	"version_scope_of_work" varchar,
  	"version_contract_type" varchar,
  	"version_built_up_area" varchar,
  	"version_duration" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_completion_date" timestamp(3) with time zone,
  	"version_project_value_value" varchar,
  	"version_project_value_display_publicly" boolean DEFAULT false,
  	"version_architect_consultant" varchar,
  	"version_execution_responsibilities" varchar,
  	"version_quality_control" varchar,
  	"version_safety_information" varchar,
  	"version_overview" jsonb,
  	"version_challenge" jsonb,
  	"version_execution_approach" jsonb,
  	"version_outcome" jsonb,
  	"version_quality_and_safety" jsonb,
  	"version_additional_notes" jsonb,
  	"version_cover_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "services_relevant_project_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"short_description" varchar,
  	"full_description" jsonb,
  	"icon" varchar,
  	"cover_image_id" integer,
  	"typical_scope" jsonb,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_services_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_relevant_project_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_description" varchar,
  	"version_full_description" jsonb,
  	"version_icon" varchar,
  	"version_cover_image_id" integer,
  	"version_typical_scope" jsonb,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "sectors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"icon" varchar,
  	"display_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sectors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "capabilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"detailed_description" jsonb,
  	"icon" varchar,
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"person_name" varchar,
  	"designation" varchar,
  	"organisation" varchar,
  	"client_type" varchar,
  	"image_id" integer,
  	"related_project_id" integer,
  	"is_placeholder" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_text" varchar,
  	"version_person_name" varchar,
  	"version_designation" varchar,
  	"version_organisation" varchar,
  	"version_client_type" varchar,
  	"version_image_id" integer,
  	"version_related_project_id" integer,
  	"version_is_placeholder" boolean DEFAULT true,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "certifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"issuing_authority" varchar,
  	"registration_number" varchar,
  	"issue_date" timestamp(3) with time zone,
  	"expiry_date" timestamp(3) with time zone,
  	"document_id" integer,
  	"logo_id" integer,
  	"show_details_publicly" boolean DEFAULT false,
  	"publicly_visible" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"organisation" varchar,
  	"project_type" varchar NOT NULL,
  	"project_location" varchar,
  	"district" varchar,
  	"estimated_budget" varchar,
  	"expected_start_date" timestamp(3) with time zone,
  	"message" varchar NOT NULL,
  	"source_page" varchar,
  	"related_project_id" integer,
  	"related_service_id" integer,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"assigned_administrator_id" integer,
  	"priority" "enum_enquiries_priority" DEFAULT 'normal',
  	"internal_notes" varchar,
  	"last_contacted_at" timestamp(3) with time zone,
  	"consent_confirmed" boolean DEFAULT false NOT NULL,
  	"tracking_utm_source" varchar,
  	"tracking_utm_medium" varchar,
  	"tracking_utm_campaign" varchar,
  	"tracking_utm_term" varchar,
  	"tracking_utm_content" varchar,
  	"tracking_referrer" varchar,
  	"email_notification_status" "enum_enquiries_email_notification_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"project_categories_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"capabilities_id" integer,
  	"testimonials_id" integer,
  	"certifications_id" integer,
  	"enquiries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar
  );
  
  CREATE TABLE "site_settings_email_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_footer_navigation_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_footer_navigation_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_company_name" varchar,
  	"short_company_name" varchar,
  	"tagline" varchar,
  	"company_description" varchar,
  	"contractor_classification" varchar,
  	"logo_id" integer,
  	"alternate_logo_id" integer,
  	"favicon_id" integer,
  	"whatsapp_number" varchar,
  	"office_address" varchar,
  	"google_maps_u_r_l" varchar,
  	"business_hours" varchar,
  	"enquiry_notification_email" varchar,
  	"registration_details_contractor_registration" varchar,
  	"registration_details_gst_number" varchar,
  	"registration_details_display_publicly" boolean DEFAULT false,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"primary_c_t_a_new_tab" boolean DEFAULT false,
  	"footer_description" varchar,
  	"footer_c_t_a_eyebrow" varchar,
  	"footer_c_t_a_heading" varchar,
  	"footer_c_t_a_label" varchar,
  	"footer_c_t_a_url" varchar,
  	"footer_c_t_a_new_tab" boolean DEFAULT false,
  	"copyright_text" varchar,
  	"footer_registration_text" varchar,
  	"announcement_visible" boolean DEFAULT false,
  	"announcement_message" varchar,
  	"announcement_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"production_u_r_l" varchar,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"number" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_email_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"email" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_navigation_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_footer_navigation_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_full_company_name" varchar,
  	"version_short_company_name" varchar,
  	"version_tagline" varchar,
  	"version_company_description" varchar,
  	"version_contractor_classification" varchar,
  	"version_logo_id" integer,
  	"version_alternate_logo_id" integer,
  	"version_favicon_id" integer,
  	"version_whatsapp_number" varchar,
  	"version_office_address" varchar,
  	"version_google_maps_u_r_l" varchar,
  	"version_business_hours" varchar,
  	"version_enquiry_notification_email" varchar,
  	"version_registration_details_contractor_registration" varchar,
  	"version_registration_details_gst_number" varchar,
  	"version_registration_details_display_publicly" boolean DEFAULT false,
  	"version_primary_c_t_a_label" varchar,
  	"version_primary_c_t_a_url" varchar,
  	"version_primary_c_t_a_new_tab" boolean DEFAULT false,
  	"version_footer_description" varchar,
  	"version_footer_c_t_a_eyebrow" varchar,
  	"version_footer_c_t_a_heading" varchar,
  	"version_footer_c_t_a_label" varchar,
  	"version_footer_c_t_a_url" varchar,
  	"version_footer_c_t_a_new_tab" boolean DEFAULT false,
  	"version_copyright_text" varchar,
  	"version_footer_registration_text" varchar,
  	"version_announcement_visible" boolean DEFAULT false,
  	"version_announcement_message" varchar,
  	"version_announcement_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_production_u_r_l" varchar,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "homepage_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "homepage_why_section_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "homepage_construction_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_accent" varchar,
  	"hero_supporting_text" varchar,
  	"hero_image_id" integer,
  	"hero_video_id" integer,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_url" varchar,
  	"primary_c_t_a_new_tab" boolean DEFAULT false,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_url" varchar,
  	"secondary_c_t_a_new_tab" boolean DEFAULT false,
  	"introductory_statement" varchar,
  	"why_section_eyebrow" varchar,
  	"why_section_heading" varchar,
  	"why_section_introduction" varchar,
  	"why_section_image_id" integer,
  	"final_c_t_a_heading" varchar,
  	"final_c_t_a_supporting_text" varchar,
  	"final_c_t_a_label" varchar,
  	"final_c_t_a_url" varchar,
  	"final_c_t_a_new_tab" boolean DEFAULT false,
  	"section_visibility_statistics" boolean DEFAULT true,
  	"section_visibility_projects" boolean DEFAULT true,
  	"section_visibility_services" boolean DEFAULT true,
  	"section_visibility_why" boolean DEFAULT true,
  	"section_visibility_process" boolean DEFAULT true,
  	"section_visibility_sectors" boolean DEFAULT true,
  	"section_visibility_testimonials" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"verified" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_why_section_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_construction_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_accent" varchar,
  	"version_hero_supporting_text" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_video_id" integer,
  	"version_primary_c_t_a_label" varchar,
  	"version_primary_c_t_a_url" varchar,
  	"version_primary_c_t_a_new_tab" boolean DEFAULT false,
  	"version_secondary_c_t_a_label" varchar,
  	"version_secondary_c_t_a_url" varchar,
  	"version_secondary_c_t_a_new_tab" boolean DEFAULT false,
  	"version_introductory_statement" varchar,
  	"version_why_section_eyebrow" varchar,
  	"version_why_section_heading" varchar,
  	"version_why_section_introduction" varchar,
  	"version_why_section_image_id" integer,
  	"version_final_c_t_a_heading" varchar,
  	"version_final_c_t_a_supporting_text" varchar,
  	"version_final_c_t_a_label" varchar,
  	"version_final_c_t_a_url" varchar,
  	"version_final_c_t_a_new_tab" boolean DEFAULT false,
  	"version_section_visibility_statistics" boolean DEFAULT true,
  	"version_section_visibility_projects" boolean DEFAULT true,
  	"version_section_visibility_services" boolean DEFAULT true,
  	"version_section_visibility_why" boolean DEFAULT true,
  	"version_section_visibility_process" boolean DEFAULT true,
  	"version_section_visibility_sectors" boolean DEFAULT true,
  	"version_section_visibility_testimonials" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"services_id" integer,
  	"sectors_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "about_page_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_introduction" varchar,
  	"hero_image_id" integer,
  	"company_introduction" jsonb,
  	"history" jsonb,
  	"mission" jsonb,
  	"vision" jsonb,
  	"leadership_content" jsonb,
  	"regional_experience" jsonb,
  	"quality_commitment" jsonb,
  	"safety_commitment" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_about_page_v_version_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_introduction" varchar,
  	"version_hero_image_id" integer,
  	"version_company_introduction" jsonb,
  	"version_history" jsonb,
  	"version_mission" jsonb,
  	"version_vision" jsonb,
  	"version_leadership_content" jsonb,
  	"version_regional_experience" jsonb,
  	"version_quality_commitment" jsonb,
  	"version_safety_commitment" jsonb,
  	"version_cta_label" varchar,
  	"version_cta_url" varchar,
  	"version_cta_new_tab" boolean DEFAULT false,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_about_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "contact_page_enquiry_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "contact_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_introduction" varchar,
  	"hero_image_id" integer,
  	"office_heading" varchar,
  	"office_information" jsonb,
  	"map_embed_u_r_l" varchar,
  	"form_supporting_text" varchar,
  	"whatsapp_c_t_a_label" varchar,
  	"whatsapp_c_t_a_url" varchar,
  	"whatsapp_c_t_a_new_tab" boolean DEFAULT false,
  	"whatsapp_c_t_a_message" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_canonical_u_r_l" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_page_v_version_enquiry_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_introduction" varchar,
  	"version_hero_image_id" integer,
  	"version_office_heading" varchar,
  	"version_office_information" jsonb,
  	"version_map_embed_u_r_l" varchar,
  	"version_form_supporting_text" varchar,
  	"version_whatsapp_c_t_a_label" varchar,
  	"version_whatsapp_c_t_a_url" varchar,
  	"version_whatsapp_c_t_a_new_tab" boolean DEFAULT false,
  	"version_whatsapp_c_t_a_message" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_materials" ADD CONSTRAINT "projects_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_construction_methods" ADD CONSTRAINT "projects_construction_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_before_after" ADD CONSTRAINT "projects_before_after_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_before_after" ADD CONSTRAINT "projects_before_after_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_before_after" ADD CONSTRAINT "projects_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_project_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_materials" ADD CONSTRAINT "_projects_v_version_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_construction_methods" ADD CONSTRAINT "_projects_v_version_construction_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_before_after" ADD CONSTRAINT "_projects_v_version_before_after_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_before_after" ADD CONSTRAINT "_projects_v_version_before_after_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_before_after" ADD CONSTRAINT "_projects_v_version_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_category_id_project_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_relevant_project_types" ADD CONSTRAINT "services_relevant_project_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_capabilities" ADD CONSTRAINT "_services_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_relevant_project_types" ADD CONSTRAINT "_services_v_version_relevant_project_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sectors" ADD CONSTRAINT "sectors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sectors_rels" ADD CONSTRAINT "sectors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sectors_rels" ADD CONSTRAINT "sectors_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_related_project_id_projects_id_fk" FOREIGN KEY ("version_related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_related_project_id_projects_id_fk" FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_related_service_id_services_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_administrator_id_users_id_fk" FOREIGN KEY ("assigned_administrator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capabilities_fk" FOREIGN KEY ("capabilities_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk" FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_phone_numbers" ADD CONSTRAINT "site_settings_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_email_addresses" ADD CONSTRAINT "site_settings_email_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_navigation_groups_links" ADD CONSTRAINT "site_settings_footer_navigation_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_navigation_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_navigation_groups" ADD CONSTRAINT "site_settings_footer_navigation_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_alternate_logo_id_media_id_fk" FOREIGN KEY ("alternate_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_phone_numbers" ADD CONSTRAINT "_site_settings_v_version_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_email_addresses" ADD CONSTRAINT "_site_settings_v_version_email_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_links" ADD CONSTRAINT "_site_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_navigation_groups_links" ADD CONSTRAINT "_site_settings_v_version_footer_navigation_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_footer_navigation_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_navigation_groups" ADD CONSTRAINT "_site_settings_v_version_footer_navigation_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_alternate_logo_id_media_id_fk" FOREIGN KEY ("version_alternate_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_statistics" ADD CONSTRAINT "homepage_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_section_points" ADD CONSTRAINT "homepage_why_section_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_construction_process" ADD CONSTRAINT "homepage_construction_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_why_section_image_id_media_id_fk" FOREIGN KEY ("why_section_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_statistics" ADD CONSTRAINT "_homepage_v_version_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_why_section_points" ADD CONSTRAINT "_homepage_v_version_why_section_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_construction_process" ADD CONSTRAINT "_homepage_v_version_construction_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_why_section_image_id_media_id_fk" FOREIGN KEY ("version_why_section_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_timeline" ADD CONSTRAINT "about_page_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_values" ADD CONSTRAINT "_about_page_v_version_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_timeline" ADD CONSTRAINT "_about_page_v_version_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_rels" ADD CONSTRAINT "_about_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_rels" ADD CONSTRAINT "_about_page_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_enquiry_categories" ADD CONSTRAINT "contact_page_enquiry_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_faqs" ADD CONSTRAINT "contact_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_enquiry_categories" ADD CONSTRAINT "_contact_page_v_version_enquiry_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_faqs" ADD CONSTRAINT "_contact_page_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_profile_image_idx" ON "users" USING btree ("profile_image_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_project_idx" ON "media" USING btree ("project_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_gallery_sizes_gallery_filename_idx" ON "media" USING btree ("sizes_gallery_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "project_categories_slug_idx" ON "project_categories" USING btree ("slug");
  CREATE INDEX "project_categories_display_order_idx" ON "project_categories" USING btree ("display_order");
  CREATE INDEX "project_categories_active_idx" ON "project_categories" USING btree ("active");
  CREATE INDEX "project_categories_updated_at_idx" ON "project_categories" USING btree ("updated_at");
  CREATE INDEX "project_categories_created_at_idx" ON "project_categories" USING btree ("created_at");
  CREATE INDEX "projects_materials_order_idx" ON "projects_materials" USING btree ("_order");
  CREATE INDEX "projects_materials_parent_id_idx" ON "projects_materials" USING btree ("_parent_id");
  CREATE INDEX "projects_construction_methods_order_idx" ON "projects_construction_methods" USING btree ("_order");
  CREATE INDEX "projects_construction_methods_parent_id_idx" ON "projects_construction_methods" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_media_idx" ON "projects_gallery" USING btree ("media_id");
  CREATE INDEX "projects_before_after_order_idx" ON "projects_before_after" USING btree ("_order");
  CREATE INDEX "projects_before_after_parent_id_idx" ON "projects_before_after" USING btree ("_parent_id");
  CREATE INDEX "projects_before_after_before_idx" ON "projects_before_after" USING btree ("before_id");
  CREATE INDEX "projects_before_after_after_idx" ON "projects_before_after" USING btree ("after_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_category_idx" ON "projects" USING btree ("category_id");
  CREATE INDEX "projects_location_idx" ON "projects" USING btree ("location");
  CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");
  CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");
  CREATE INDEX "projects_display_order_idx" ON "projects" USING btree ("display_order");
  CREATE INDEX "projects_published_at_idx" ON "projects" USING btree ("published_at");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_seo_seo_image_idx" ON "projects" USING btree ("seo_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "projects_rels_sectors_id_idx" ON "projects_rels" USING btree ("sectors_id");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  CREATE INDEX "_projects_v_version_materials_order_idx" ON "_projects_v_version_materials" USING btree ("_order");
  CREATE INDEX "_projects_v_version_materials_parent_id_idx" ON "_projects_v_version_materials" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_construction_methods_order_idx" ON "_projects_v_version_construction_methods" USING btree ("_order");
  CREATE INDEX "_projects_v_version_construction_methods_parent_id_idx" ON "_projects_v_version_construction_methods" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_media_idx" ON "_projects_v_version_gallery" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_before_after_order_idx" ON "_projects_v_version_before_after" USING btree ("_order");
  CREATE INDEX "_projects_v_version_before_after_parent_id_idx" ON "_projects_v_version_before_after" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_before_after_before_idx" ON "_projects_v_version_before_after" USING btree ("before_id");
  CREATE INDEX "_projects_v_version_before_after_after_idx" ON "_projects_v_version_before_after" USING btree ("after_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_category_idx" ON "_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_projects_v_version_version_location_idx" ON "_projects_v" USING btree ("version_location");
  CREATE INDEX "_projects_v_version_version_status_idx" ON "_projects_v" USING btree ("version_status");
  CREATE INDEX "_projects_v_version_version_featured_idx" ON "_projects_v" USING btree ("version_featured");
  CREATE INDEX "_projects_v_version_version_display_order_idx" ON "_projects_v" USING btree ("version_display_order");
  CREATE INDEX "_projects_v_version_version_published_at_idx" ON "_projects_v" USING btree ("version_published_at");
  CREATE INDEX "_projects_v_version_version_cover_image_idx" ON "_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_image_idx" ON "_projects_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_rels_services_id_idx" ON "_projects_v_rels" USING btree ("services_id");
  CREATE INDEX "_projects_v_rels_sectors_id_idx" ON "_projects_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");
  CREATE INDEX "services_capabilities_order_idx" ON "services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "services_capabilities" USING btree ("_parent_id");
  CREATE INDEX "services_relevant_project_types_order_idx" ON "services_relevant_project_types" USING btree ("_order");
  CREATE INDEX "services_relevant_project_types_parent_id_idx" ON "services_relevant_project_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_cover_image_idx" ON "services" USING btree ("cover_image_id");
  CREATE INDEX "services_featured_idx" ON "services" USING btree ("featured");
  CREATE INDEX "services_display_order_idx" ON "services" USING btree ("display_order");
  CREATE INDEX "services_active_idx" ON "services" USING btree ("active");
  CREATE INDEX "services_seo_seo_image_idx" ON "services" USING btree ("seo_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_projects_id_idx" ON "services_rels" USING btree ("projects_id");
  CREATE INDEX "_services_v_version_capabilities_order_idx" ON "_services_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_services_v_version_capabilities_parent_id_idx" ON "_services_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_relevant_project_types_order_idx" ON "_services_v_version_relevant_project_types" USING btree ("_order");
  CREATE INDEX "_services_v_version_relevant_project_types_parent_id_idx" ON "_services_v_version_relevant_project_types" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_cover_image_idx" ON "_services_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_services_v_version_version_featured_idx" ON "_services_v" USING btree ("version_featured");
  CREATE INDEX "_services_v_version_version_display_order_idx" ON "_services_v" USING btree ("version_display_order");
  CREATE INDEX "_services_v_version_version_active_idx" ON "_services_v" USING btree ("version_active");
  CREATE INDEX "_services_v_version_seo_version_seo_image_idx" ON "_services_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_projects_id_idx" ON "_services_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "sectors_slug_idx" ON "sectors" USING btree ("slug");
  CREATE INDEX "sectors_image_idx" ON "sectors" USING btree ("image_id");
  CREATE INDEX "sectors_display_order_idx" ON "sectors" USING btree ("display_order");
  CREATE INDEX "sectors_active_idx" ON "sectors" USING btree ("active");
  CREATE INDEX "sectors_updated_at_idx" ON "sectors" USING btree ("updated_at");
  CREATE INDEX "sectors_created_at_idx" ON "sectors" USING btree ("created_at");
  CREATE INDEX "sectors_rels_order_idx" ON "sectors_rels" USING btree ("order");
  CREATE INDEX "sectors_rels_parent_idx" ON "sectors_rels" USING btree ("parent_id");
  CREATE INDEX "sectors_rels_path_idx" ON "sectors_rels" USING btree ("path");
  CREATE INDEX "sectors_rels_projects_id_idx" ON "sectors_rels" USING btree ("projects_id");
  CREATE INDEX "capabilities_image_idx" ON "capabilities" USING btree ("image_id");
  CREATE INDEX "capabilities_display_order_idx" ON "capabilities" USING btree ("display_order");
  CREATE INDEX "capabilities_active_idx" ON "capabilities" USING btree ("active");
  CREATE INDEX "capabilities_updated_at_idx" ON "capabilities" USING btree ("updated_at");
  CREATE INDEX "capabilities_created_at_idx" ON "capabilities" USING btree ("created_at");
  CREATE INDEX "testimonials_image_idx" ON "testimonials" USING btree ("image_id");
  CREATE INDEX "testimonials_related_project_idx" ON "testimonials" USING btree ("related_project_id");
  CREATE INDEX "testimonials_featured_idx" ON "testimonials" USING btree ("featured");
  CREATE INDEX "testimonials_display_order_idx" ON "testimonials" USING btree ("display_order");
  CREATE INDEX "testimonials_active_idx" ON "testimonials" USING btree ("active");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_image_idx" ON "_testimonials_v" USING btree ("version_image_id");
  CREATE INDEX "_testimonials_v_version_version_related_project_idx" ON "_testimonials_v" USING btree ("version_related_project_id");
  CREATE INDEX "_testimonials_v_version_version_featured_idx" ON "_testimonials_v" USING btree ("version_featured");
  CREATE INDEX "_testimonials_v_version_version_display_order_idx" ON "_testimonials_v" USING btree ("version_display_order");
  CREATE INDEX "_testimonials_v_version_version_active_idx" ON "_testimonials_v" USING btree ("version_active");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_autosave_idx" ON "_testimonials_v" USING btree ("autosave");
  CREATE INDEX "certifications_document_idx" ON "certifications" USING btree ("document_id");
  CREATE INDEX "certifications_logo_idx" ON "certifications" USING btree ("logo_id");
  CREATE INDEX "certifications_publicly_visible_idx" ON "certifications" USING btree ("publicly_visible");
  CREATE INDEX "certifications_display_order_idx" ON "certifications" USING btree ("display_order");
  CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
  CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
  CREATE UNIQUE INDEX "enquiries_reference_idx" ON "enquiries" USING btree ("reference");
  CREATE INDEX "enquiries_related_project_idx" ON "enquiries" USING btree ("related_project_id");
  CREATE INDEX "enquiries_related_service_idx" ON "enquiries" USING btree ("related_service_id");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_assigned_administrator_idx" ON "enquiries" USING btree ("assigned_administrator_id");
  CREATE INDEX "enquiries_priority_idx" ON "enquiries" USING btree ("priority");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_project_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("project_categories_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_sectors_id_idx" ON "payload_locked_documents_rels" USING btree ("sectors_id");
  CREATE INDEX "payload_locked_documents_rels_capabilities_id_idx" ON "payload_locked_documents_rels" USING btree ("capabilities_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_certifications_id_idx" ON "payload_locked_documents_rels" USING btree ("certifications_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_phone_numbers_order_idx" ON "site_settings_phone_numbers" USING btree ("_order");
  CREATE INDEX "site_settings_phone_numbers_parent_id_idx" ON "site_settings_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX "site_settings_email_addresses_order_idx" ON "site_settings_email_addresses" USING btree ("_order");
  CREATE INDEX "site_settings_email_addresses_parent_id_idx" ON "site_settings_email_addresses" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_navigation_groups_links_order_idx" ON "site_settings_footer_navigation_groups_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_navigation_groups_links_parent_id_idx" ON "site_settings_footer_navigation_groups_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_navigation_groups_order_idx" ON "site_settings_footer_navigation_groups" USING btree ("_order");
  CREATE INDEX "site_settings_footer_navigation_groups_parent_id_idx" ON "site_settings_footer_navigation_groups" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_alternate_logo_idx" ON "site_settings" USING btree ("alternate_logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_seo_seo_image_idx" ON "site_settings" USING btree ("seo_image_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_phone_numbers_order_idx" ON "_site_settings_v_version_phone_numbers" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_phone_numbers_parent_id_idx" ON "_site_settings_v_version_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_email_addresses_order_idx" ON "_site_settings_v_version_email_addresses" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_email_addresses_parent_id_idx" ON "_site_settings_v_version_email_addresses" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_social_links_order_idx" ON "_site_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_links_parent_id_idx" ON "_site_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_navigation_groups_links_order_idx" ON "_site_settings_v_version_footer_navigation_groups_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_navigation_groups_links_parent_id_idx" ON "_site_settings_v_version_footer_navigation_groups_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_footer_navigation_groups_order_idx" ON "_site_settings_v_version_footer_navigation_groups" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_navigation_groups_parent_id_idx" ON "_site_settings_v_version_footer_navigation_groups" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version_alternate_logo_idx" ON "_site_settings_v" USING btree ("version_alternate_logo_id");
  CREATE INDEX "_site_settings_v_version_version_favicon_idx" ON "_site_settings_v" USING btree ("version_favicon_id");
  CREATE INDEX "_site_settings_v_version_seo_version_seo_image_idx" ON "_site_settings_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");
  CREATE INDEX "homepage_statistics_order_idx" ON "homepage_statistics" USING btree ("_order");
  CREATE INDEX "homepage_statistics_parent_id_idx" ON "homepage_statistics" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_section_points_order_idx" ON "homepage_why_section_points" USING btree ("_order");
  CREATE INDEX "homepage_why_section_points_parent_id_idx" ON "homepage_why_section_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_construction_process_order_idx" ON "homepage_construction_process" USING btree ("_order");
  CREATE INDEX "homepage_construction_process_parent_id_idx" ON "homepage_construction_process" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_hero_video_idx" ON "homepage" USING btree ("hero_video_id");
  CREATE INDEX "homepage_why_section_why_section_image_idx" ON "homepage" USING btree ("why_section_image_id");
  CREATE INDEX "homepage_seo_seo_image_idx" ON "homepage" USING btree ("seo_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_projects_id_idx" ON "homepage_rels" USING btree ("projects_id");
  CREATE INDEX "homepage_rels_services_id_idx" ON "homepage_rels" USING btree ("services_id");
  CREATE INDEX "homepage_rels_sectors_id_idx" ON "homepage_rels" USING btree ("sectors_id");
  CREATE INDEX "homepage_rels_testimonials_id_idx" ON "homepage_rels" USING btree ("testimonials_id");
  CREATE INDEX "_homepage_v_version_statistics_order_idx" ON "_homepage_v_version_statistics" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_statistics_parent_id_idx" ON "_homepage_v_version_statistics" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_why_section_points_order_idx" ON "_homepage_v_version_why_section_points" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_why_section_points_parent_id_idx" ON "_homepage_v_version_why_section_points" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_construction_process_order_idx" ON "_homepage_v_version_construction_process" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_construction_process_parent_id_idx" ON "_homepage_v_version_construction_process" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_version_hero_video_idx" ON "_homepage_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_homepage_v_version_why_section_version_why_section_imag_idx" ON "_homepage_v" USING btree ("version_why_section_image_id");
  CREATE INDEX "_homepage_v_version_seo_version_seo_image_idx" ON "_homepage_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_projects_id_idx" ON "_homepage_v_rels" USING btree ("projects_id");
  CREATE INDEX "_homepage_v_rels_services_id_idx" ON "_homepage_v_rels" USING btree ("services_id");
  CREATE INDEX "_homepage_v_rels_sectors_id_idx" ON "_homepage_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_homepage_v_rels_testimonials_id_idx" ON "_homepage_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_timeline_order_idx" ON "about_page_timeline" USING btree ("_order");
  CREATE INDEX "about_page_timeline_parent_id_idx" ON "about_page_timeline" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_seo_seo_image_idx" ON "about_page" USING btree ("seo_image_id");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE INDEX "about_page_rels_order_idx" ON "about_page_rels" USING btree ("order");
  CREATE INDEX "about_page_rels_parent_idx" ON "about_page_rels" USING btree ("parent_id");
  CREATE INDEX "about_page_rels_path_idx" ON "about_page_rels" USING btree ("path");
  CREATE INDEX "about_page_rels_media_id_idx" ON "about_page_rels" USING btree ("media_id");
  CREATE INDEX "_about_page_v_version_values_order_idx" ON "_about_page_v_version_values" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_values_parent_id_idx" ON "_about_page_v_version_values" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_timeline_order_idx" ON "_about_page_v_version_timeline" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_timeline_parent_id_idx" ON "_about_page_v_version_timeline" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_hero_version_hero_image_idx" ON "_about_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_about_page_v_version_seo_version_seo_image_idx" ON "_about_page_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE INDEX "_about_page_v_autosave_idx" ON "_about_page_v" USING btree ("autosave");
  CREATE INDEX "_about_page_v_rels_order_idx" ON "_about_page_v_rels" USING btree ("order");
  CREATE INDEX "_about_page_v_rels_parent_idx" ON "_about_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_about_page_v_rels_path_idx" ON "_about_page_v_rels" USING btree ("path");
  CREATE INDEX "_about_page_v_rels_media_id_idx" ON "_about_page_v_rels" USING btree ("media_id");
  CREATE INDEX "contact_page_enquiry_categories_order_idx" ON "contact_page_enquiry_categories" USING btree ("_order");
  CREATE INDEX "contact_page_enquiry_categories_parent_id_idx" ON "contact_page_enquiry_categories" USING btree ("_parent_id");
  CREATE INDEX "contact_page_faqs_order_idx" ON "contact_page_faqs" USING btree ("_order");
  CREATE INDEX "contact_page_faqs_parent_id_idx" ON "contact_page_faqs" USING btree ("_parent_id");
  CREATE INDEX "contact_page_hero_hero_image_idx" ON "contact_page" USING btree ("hero_image_id");
  CREATE INDEX "contact_page_seo_seo_image_idx" ON "contact_page" USING btree ("seo_image_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "_contact_page_v_version_enquiry_categories_order_idx" ON "_contact_page_v_version_enquiry_categories" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_enquiry_categories_parent_id_idx" ON "_contact_page_v_version_enquiry_categories" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_faqs_order_idx" ON "_contact_page_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_faqs_parent_id_idx" ON "_contact_page_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_hero_version_hero_image_idx" ON "_contact_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_contact_page_v_version_seo_version_seo_image_idx" ON "_contact_page_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_autosave_idx" ON "_contact_page_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "project_categories" CASCADE;
  DROP TABLE "projects_materials" CASCADE;
  DROP TABLE "projects_construction_methods" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_before_after" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_materials" CASCADE;
  DROP TABLE "_projects_v_version_construction_methods" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_before_after" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "services_capabilities" CASCADE;
  DROP TABLE "services_relevant_project_types" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_capabilities" CASCADE;
  DROP TABLE "_services_v_version_relevant_project_types" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "sectors" CASCADE;
  DROP TABLE "sectors_rels" CASCADE;
  DROP TABLE "capabilities" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "certifications" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_phone_numbers" CASCADE;
  DROP TABLE "site_settings_email_addresses" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  DROP TABLE "site_settings_footer_navigation_groups_links" CASCADE;
  DROP TABLE "site_settings_footer_navigation_groups" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_phone_numbers" CASCADE;
  DROP TABLE "_site_settings_v_version_email_addresses" CASCADE;
  DROP TABLE "_site_settings_v_version_social_links" CASCADE;
  DROP TABLE "_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_navigation_groups_links" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_navigation_groups" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "homepage_statistics" CASCADE;
  DROP TABLE "homepage_why_section_points" CASCADE;
  DROP TABLE "homepage_construction_process" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_statistics" CASCADE;
  DROP TABLE "_homepage_v_version_why_section_points" CASCADE;
  DROP TABLE "_homepage_v_version_construction_process" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_timeline" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_rels" CASCADE;
  DROP TABLE "_about_page_v_version_values" CASCADE;
  DROP TABLE "_about_page_v_version_timeline" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_about_page_v_rels" CASCADE;
  DROP TABLE "contact_page_enquiry_categories" CASCADE;
  DROP TABLE "contact_page_faqs" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "_contact_page_v_version_enquiry_categories" CASCADE;
  DROP TABLE "_contact_page_v_version_faqs" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_projects_gallery_layout";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_gallery_layout";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_enquiries_priority";
  DROP TYPE "public"."enum_enquiries_email_notification_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";`)
}
