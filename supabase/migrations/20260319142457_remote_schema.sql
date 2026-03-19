


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_user_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
RETURN COALESCE(
current_setting('request.jwt.claims', true)::json->>'user_role',
'guardian'
);
END;
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
RETURN get_user_role() = 'admin';
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activity_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "description" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."activity_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bank_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transaction_date" "date" NOT NULL,
    "reference" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "description" "text",
    "matched_payment_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bank_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."classes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "grade" "text" NOT NULL,
    "section" "text" NOT NULL,
    "teacher_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guardians" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "whatsapp" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "access_token" "text" DEFAULT "replace"(("gen_random_uuid"())::"text", '-'::"text", ''::"text") NOT NULL,
    "user_role" "text" DEFAULT 'guardian'::"text"
);


ALTER TABLE "public"."guardians" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "payment_item_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guardian_id" "uuid" NOT NULL,
    "reference_number" "text" NOT NULL,
    "total_amount" numeric DEFAULT 0 NOT NULL,
    "payment_method" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "orders_payment_method_check" CHECK (("payment_method" = ANY (ARRAY['bank_transfer'::"text", 'wipay'::"text", 'cash'::"text"]))),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'verified'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_item_students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_item_id" "uuid",
    "student_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payment_item_students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "amount" numeric NOT NULL,
    "due_date" "date" NOT NULL,
    "status" "text" DEFAULT 'Draft'::"text",
    "bank_transfer_enabled" boolean DEFAULT true,
    "wipay_enabled" boolean DEFAULT false,
    "whatsapp_notifications" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "cash_enabled" boolean DEFAULT false,
    "file_url" "text",
    "is_mandatory" boolean DEFAULT true NOT NULL,
    "max_capacity" integer DEFAULT 0 NOT NULL,
    "location" "text" DEFAULT 'At school'::"text",
    "schedule" "jsonb",
    "icon_url" "text"
);


ALTER TABLE "public"."payment_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_item_id" "uuid" NOT NULL,
    "send_via_whatsapp" boolean DEFAULT false NOT NULL,
    "send_via_email" boolean DEFAULT false NOT NULL,
    "scheduled_datetime" timestamp with time zone NOT NULL,
    "sent" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payment_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "amount" numeric NOT NULL,
    "method" "text",
    "receipt_url" "text",
    "notes" "text",
    "submitted_at" timestamp with time zone,
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "payment_item_student_id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shopping_cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guardian_id" "uuid" NOT NULL,
    "payment_item_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shopping_cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_guardians" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid",
    "guardian_id" "uuid",
    "relationship" "text" NOT NULL,
    "is_primary" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."student_guardians" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "class_id" "uuid",
    "student_id" "text" NOT NULL,
    "date_of_birth" "date" NOT NULL
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teachers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."teachers" OWNER TO "postgres";


ALTER TABLE ONLY "public"."activity_logs"
    ADD CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_grade_section_key" UNIQUE ("grade", "section");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guardians"
    ADD CONSTRAINT "guardians_access_token_key" UNIQUE ("access_token");



ALTER TABLE ONLY "public"."guardians"
    ADD CONSTRAINT "guardians_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_reference_number_key" UNIQUE ("reference_number");



ALTER TABLE ONLY "public"."payment_item_students"
    ADD CONSTRAINT "payment_item_students_payment_item_id_student_id_key" UNIQUE ("payment_item_id", "student_id");



ALTER TABLE ONLY "public"."payment_item_students"
    ADD CONSTRAINT "payment_item_students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_items"
    ADD CONSTRAINT "payment_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_schedules"
    ADD CONSTRAINT "payment_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_id_payment_item_student_id_key" UNIQUE ("order_id", "payment_item_student_id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_cart_items"
    ADD CONSTRAINT "shopping_cart_items_guardian_id_payment_item_id_student_id_key" UNIQUE ("guardian_id", "payment_item_id", "student_id");



ALTER TABLE ONLY "public"."shopping_cart_items"
    ADD CONSTRAINT "shopping_cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_guardians"
    ADD CONSTRAINT "student_guardians_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_student_id_unique" UNIQUE ("student_id");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_activity_logs_created" ON "public"."activity_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_bank_transactions_matched" ON "public"."bank_transactions" USING "btree" ("matched_payment_id");



CREATE INDEX "idx_guardians_access_token" ON "public"."guardians" USING "btree" ("access_token");



CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");



CREATE INDEX "idx_orders_guardian_id" ON "public"."orders" USING "btree" ("guardian_id");



CREATE INDEX "idx_orders_reference_number" ON "public"."orders" USING "btree" ("reference_number");



CREATE INDEX "idx_payment_item_students_item" ON "public"."payment_item_students" USING "btree" ("payment_item_id");



CREATE INDEX "idx_payment_item_students_student" ON "public"."payment_item_students" USING "btree" ("student_id");



CREATE INDEX "idx_payment_schedules_payment_item_id" ON "public"."payment_schedules" USING "btree" ("payment_item_id");



CREATE INDEX "idx_payment_schedules_scheduled_datetime" ON "public"."payment_schedules" USING "btree" ("scheduled_datetime") WHERE ("sent" = false);



CREATE INDEX "idx_payments_order_id" ON "public"."payments" USING "btree" ("order_id");



CREATE INDEX "idx_payments_order_payment_item" ON "public"."payments" USING "btree" ("order_id", "payment_item_student_id");



CREATE INDEX "idx_payments_payment_item_student_id" ON "public"."payments" USING "btree" ("payment_item_student_id");



CREATE INDEX "idx_shopping_cart_guardian" ON "public"."shopping_cart_items" USING "btree" ("guardian_id");



CREATE INDEX "idx_shopping_cart_payment_item" ON "public"."shopping_cart_items" USING "btree" ("payment_item_id");



CREATE INDEX "idx_student_guardians_guardian" ON "public"."student_guardians" USING "btree" ("guardian_id");



CREATE INDEX "idx_student_guardians_student" ON "public"."student_guardians" USING "btree" ("student_id");



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_matched_payment_id_fkey" FOREIGN KEY ("matched_payment_id") REFERENCES "public"."payments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_payment_item_id_fkey" FOREIGN KEY ("payment_item_id") REFERENCES "public"."payment_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "public"."guardians"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_item_students"
    ADD CONSTRAINT "payment_item_students_payment_item_id_fkey" FOREIGN KEY ("payment_item_id") REFERENCES "public"."payment_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_item_students"
    ADD CONSTRAINT "payment_item_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_schedules"
    ADD CONSTRAINT "payment_schedules_payment_item_id_fkey" FOREIGN KEY ("payment_item_id") REFERENCES "public"."payment_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_payment_item_student_id_fkey" FOREIGN KEY ("payment_item_student_id") REFERENCES "public"."payment_item_students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_cart_items"
    ADD CONSTRAINT "shopping_cart_items_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "public"."guardians"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_cart_items"
    ADD CONSTRAINT "shopping_cart_items_payment_item_id_fkey" FOREIGN KEY ("payment_item_id") REFERENCES "public"."payment_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_cart_items"
    ADD CONSTRAINT "shopping_cart_items_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_guardians"
    ADD CONSTRAINT "student_guardians_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "public"."guardians"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_guardians"
    ADD CONSTRAINT "student_guardians_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE SET NULL;



CREATE POLICY "Admins can delete classes" ON "public"."classes" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can delete guardians" ON "public"."guardians" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can delete order items" ON "public"."order_items" FOR DELETE TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can delete orders" ON "public"."orders" FOR DELETE TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can delete payments" ON "public"."payments" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can delete student guardian relationships" ON "public"."student_guardians" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can delete students" ON "public"."students" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can delete teachers" ON "public"."teachers" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can insert guardians" ON "public"."guardians" FOR INSERT TO "authenticated" WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can insert order items" ON "public"."order_items" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can insert orders" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can insert student guardian relationships" ON "public"."student_guardians" FOR INSERT TO "authenticated" WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can insert students" ON "public"."students" FOR INSERT TO "authenticated" WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can manage all payments" ON "public"."payments" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."raw_app_meta_data" ->> 'role'::"text") = 'admin'::"text")))));



CREATE POLICY "Admins can update guardians" ON "public"."guardians" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can update order items" ON "public"."order_items" FOR UPDATE TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL)) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can update orders" ON "public"."orders" FOR UPDATE TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL)) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can update student guardian relationships" ON "public"."student_guardians" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can update students" ON "public"."students" FOR UPDATE TO "authenticated" USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"))) WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admins can view all order items" ON "public"."order_items" FOR SELECT TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Admins can view all orders" ON "public"."orders" FOR SELECT TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") IS NOT NULL));



CREATE POLICY "Authenticated users can create payment schedules" ON "public"."payment_schedules" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can delete payment item students" ON "public"."payment_item_students" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete payment items" ON "public"."payment_items" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete payment schedules" ON "public"."payment_schedules" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert activity logs" ON "public"."activity_logs" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert bank transactions" ON "public"."bank_transactions" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert classes" ON "public"."classes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert payment item students" ON "public"."payment_item_students" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert payment items" ON "public"."payment_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert payments" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert teachers" ON "public"."teachers" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can update bank transactions" ON "public"."bank_transactions" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update classes" ON "public"."classes" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update payment items" ON "public"."payment_items" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update payment schedules" ON "public"."payment_schedules" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update payments" ON "public"."payments" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update teachers" ON "public"."teachers" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can view activity logs" ON "public"."activity_logs" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view all payment schedules" ON "public"."payment_schedules" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view bank transactions" ON "public"."bank_transactions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view classes" ON "public"."classes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view guardians" ON "public"."guardians" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view payment item students" ON "public"."payment_item_students" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view payment items" ON "public"."payment_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view payments" ON "public"."payments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view student guardians" ON "public"."student_guardians" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view students" ON "public"."students" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view teachers" ON "public"."teachers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Guardians can create payments for their orders" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."orders" "o"
     JOIN "public"."order_items" "oi" ON (("oi"."order_id" = "o"."id")))
  WHERE (("o"."id" = "oi"."order_id") AND ("o"."guardian_id" = "auth"."uid"()) AND ("oi"."payment_item_id" IN ( SELECT "pis"."payment_item_id"
           FROM "public"."payment_item_students" "pis"
          WHERE ("pis"."id" = "payments"."payment_item_student_id"))) AND ("oi"."student_id" IN ( SELECT "pis"."student_id"
           FROM "public"."payment_item_students" "pis"
          WHERE ("pis"."id" = "payments"."payment_item_student_id")))))));



CREATE POLICY "Guardians can update payments for their orders" ON "public"."payments" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "payments"."order_id") AND ("o"."guardian_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "payments"."order_id") AND ("o"."guardian_id" = "auth"."uid"())))));



CREATE POLICY "Guardians can view payments for their orders" ON "public"."payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "payments"."order_id") AND ("o"."guardian_id" = "auth"."uid"())))));



CREATE POLICY "Public can add shopping cart items" ON "public"."shopping_cart_items" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public can remove shopping cart items" ON "public"."shopping_cart_items" FOR DELETE USING (true);



CREATE POLICY "Public can view shopping cart items" ON "public"."shopping_cart_items" FOR SELECT USING (true);



ALTER TABLE "public"."activity_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bank_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guardians" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_item_students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_schedules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_guardians" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teachers" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";


















GRANT ALL ON TABLE "public"."activity_logs" TO "anon";
GRANT ALL ON TABLE "public"."activity_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_logs" TO "service_role";



GRANT ALL ON TABLE "public"."bank_transactions" TO "anon";
GRANT ALL ON TABLE "public"."bank_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."bank_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON TABLE "public"."guardians" TO "anon";
GRANT ALL ON TABLE "public"."guardians" TO "authenticated";
GRANT ALL ON TABLE "public"."guardians" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payment_item_students" TO "anon";
GRANT ALL ON TABLE "public"."payment_item_students" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_item_students" TO "service_role";



GRANT ALL ON TABLE "public"."payment_items" TO "anon";
GRANT ALL ON TABLE "public"."payment_items" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_items" TO "service_role";



GRANT ALL ON TABLE "public"."payment_schedules" TO "anon";
GRANT ALL ON TABLE "public"."payment_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_cart_items" TO "anon";
GRANT ALL ON TABLE "public"."shopping_cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."student_guardians" TO "anon";
GRANT ALL ON TABLE "public"."student_guardians" TO "authenticated";
GRANT ALL ON TABLE "public"."student_guardians" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."teachers" TO "anon";
GRANT ALL ON TABLE "public"."teachers" TO "authenticated";
GRANT ALL ON TABLE "public"."teachers" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Admins can delete payment item files"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'payment-item-files'::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Admins can delete payment item icons"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'payment-item-icons'::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Admins can update payment item files"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'payment-item-files'::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Admins can update payment item icons"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = ''::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Admins can upload payment item files"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'payment-item-files'::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Admins can upload payment item icons"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'payment-item-icons'::text) AND (((auth.jwt() ->> 'role'::text) = 'admin'::text) OR (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text))));



  create policy "Public can view payment item files"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'payment-item-files'::text));



  create policy "Public can view payment item icons"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'payment-item-icons'::text));



