SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict BfyFgMBfxlgdmgDSKn06edOviMydBCmiMEswTzXI5DVVs0MGXfEufUOejcxR0yc

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '0dd49c96-4fa2-456b-a4a6-b2786424991e', 'authenticated', 'authenticated', 'sheldonhhall@gmail.com', '$2a$10$0XLDaW27H5BPGrL4EJa.auMaKSUNDzjPVeCPd/OdtICYtVXautQwe', '2026-01-19 16:23:27.873127+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-20 12:41:20.929556+00', '{"role": "guardian", "provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-19 16:23:27.846062+00', '2026-01-20 12:41:20.960951+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4adc8121-4169-44a4-afe6-da2fd5dcf587', 'authenticated', 'authenticated', 'jreid@mrgs.edu.tt', '$2a$10$KW7gx4gcAwBm3froYkviw.BLLV3HoDxhzwJ649OfxWerPxnLV407K', '2026-01-20 20:54:48.115553+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-03-19 14:19:32.447371+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-20 20:54:48.082669+00', '2026-03-19 14:19:32.451094+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('0dd49c96-4fa2-456b-a4a6-b2786424991e', '0dd49c96-4fa2-456b-a4a6-b2786424991e', '{"sub": "0dd49c96-4fa2-456b-a4a6-b2786424991e", "email": "sheldonhhall@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-19 16:23:27.862289+00', '2026-01-19 16:23:27.862355+00', '2026-01-19 16:23:27.862355+00', '3b7a14bf-dc8c-4b50-9d40-492a32a23017'),
	('4adc8121-4169-44a4-afe6-da2fd5dcf587', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '{"sub": "4adc8121-4169-44a4-afe6-da2fd5dcf587", "email": "jreid@mrgs.edu.tt", "email_verified": false, "phone_verified": false}', 'email', '2026-01-20 20:54:48.103188+00', '2026-01-20 20:54:48.103261+00', '2026-01-20 20:54:48.103261+00', '0fa9728f-0b08-4ed5-87b9-41eec9af1530');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('76835dc9-d46f-41de-bcd9-7ebd12ff9782', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-01-26 00:32:42.487201+00', '2026-01-26 00:32:42.487201+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '190.6.231.155', NULL, NULL, NULL, NULL, NULL),
	('e162e4e5-b589-42b0-9568-699c7e3d6738', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-01-22 19:26:52.810492+00', '2026-01-26 00:54:38.851957+00', NULL, 'aal1', NULL, '2026-01-26 00:54:38.851837', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '190.6.231.155', NULL, NULL, NULL, NULL, NULL),
	('076fad67-c98e-4e18-b76d-2a00f1211dcf', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-01-27 09:34:36.658705+00', '2026-01-27 09:34:36.658705+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1', '181.118.39.161', NULL, NULL, NULL, NULL, NULL),
	('b7a13c62-1152-408c-9e9f-1594d1747859', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-01-27 09:48:36.857461+00', '2026-01-27 09:48:36.857461+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1', '181.118.39.161', NULL, NULL, NULL, NULL, NULL),
	('d1061a92-d489-402d-a767-998069ab8d9c', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-03-19 00:22:01.238197+00', '2026-03-19 13:03:37.132366+00', NULL, 'aal1', NULL, '2026-03-19 13:03:37.132238', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL),
	('5f337b30-641f-46cb-9a00-65a5b79684e3', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-03-19 13:05:57.625669+00', '2026-03-19 14:04:37.667209+00', NULL, 'aal1', NULL, '2026-03-19 14:04:37.667075', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL),
	('6d36edf4-0d3e-4ac7-affe-1cbc58da67f7', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-02-15 21:35:55.95804+00', '2026-02-16 07:20:35.09992+00', NULL, 'aal1', NULL, '2026-02-16 07:20:35.099807', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL),
	('c084284d-3d9f-4146-90d5-266f694904bb', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-02-17 21:52:46.564455+00', '2026-02-18 01:01:56.804094+00', NULL, 'aal1', NULL, '2026-02-18 01:01:56.803375', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '190.58.9.5', NULL, NULL, NULL, NULL, NULL),
	('ba0f9211-edca-47af-b9e1-28326f10c925', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-03-19 14:19:24.766216+00', '2026-03-19 14:19:24.766216+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL),
	('f0bb1878-2ba6-4b32-b8e7-812f0dfe229a', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-02-17 19:16:24.940753+00', '2026-02-23 01:48:34.59546+00', NULL, 'aal1', NULL, '2026-02-23 01:48:34.590771', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1', '181.118.53.228', NULL, NULL, NULL, NULL, NULL),
	('3cef8493-cf79-4e01-9362-6eb5ac95c83b', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-03-19 00:17:15.316191+00', '2026-03-19 00:17:15.316191+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL),
	('04f4f2f1-5363-4fce-9e42-f24e8f6fc3a1', '4adc8121-4169-44a4-afe6-da2fd5dcf587', '2026-03-19 14:19:32.447475+00', '2026-03-19 14:19:32.447475+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '190.83.209.16', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('76835dc9-d46f-41de-bcd9-7ebd12ff9782', '2026-01-26 00:32:42.526417+00', '2026-01-26 00:32:42.526417+00', 'password', '7a6cbda3-1563-4d36-9820-c15cc636e78c'),
	('b7a13c62-1152-408c-9e9f-1594d1747859', '2026-01-27 09:48:36.895722+00', '2026-01-27 09:48:36.895722+00', 'password', '9aac7850-a243-4e96-ab72-d1c4a0ec2c78'),
	('6d36edf4-0d3e-4ac7-affe-1cbc58da67f7', '2026-02-15 21:35:55.991472+00', '2026-02-15 21:35:55.991472+00', 'password', 'b425525f-a18d-41d0-a732-0875f569b472'),
	('c084284d-3d9f-4146-90d5-266f694904bb', '2026-02-17 21:52:46.609421+00', '2026-02-17 21:52:46.609421+00', 'password', '679a494b-e4bb-4573-8140-451d06aeff8d'),
	('3cef8493-cf79-4e01-9362-6eb5ac95c83b', '2026-03-19 00:17:15.434277+00', '2026-03-19 00:17:15.434277+00', 'password', '40f4775f-5177-48cd-9f30-2fc8a21f204d'),
	('5f337b30-641f-46cb-9a00-65a5b79684e3', '2026-03-19 13:05:57.687638+00', '2026-03-19 13:05:57.687638+00', 'password', '67d15f72-707d-4c78-88bd-49c53d4de61b'),
	('e162e4e5-b589-42b0-9568-699c7e3d6738', '2026-01-22 19:26:52.860279+00', '2026-01-22 19:26:52.860279+00', 'password', '4b6affcf-721e-479f-8453-d5b6f6b5ec3c'),
	('076fad67-c98e-4e18-b76d-2a00f1211dcf', '2026-01-27 09:34:36.739208+00', '2026-01-27 09:34:36.739208+00', 'password', 'dd93bb25-bcdc-4481-8ef9-d8d3c7fd494d'),
	('f0bb1878-2ba6-4b32-b8e7-812f0dfe229a', '2026-02-17 19:16:25.034501+00', '2026-02-17 19:16:25.034501+00', 'password', '575dbbf2-c7d8-4fac-b047-55b2314b428e'),
	('d1061a92-d489-402d-a767-998069ab8d9c', '2026-03-19 00:22:01.276691+00', '2026-03-19 00:22:01.276691+00', 'password', '21e4cbcc-aa75-4e1e-9b27-be6186203719'),
	('ba0f9211-edca-47af-b9e1-28326f10c925', '2026-03-19 14:19:24.831517+00', '2026-03-19 14:19:24.831517+00', 'password', 'caffbe65-253d-4fdb-a1af-e67c3d6f01e4'),
	('04f4f2f1-5363-4fce-9e42-f24e8f6fc3a1', '2026-03-19 14:19:32.451403+00', '2026-03-19 14:19:32.451403+00', 'password', 'c20a791d-be8d-420a-9aaa-9b443d86bc35');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 342, 'hzghvzuzsc66', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-01-26 00:32:42.505469+00', '2026-01-26 00:32:42.505469+00', NULL, '76835dc9-d46f-41de-bcd9-7ebd12ff9782'),
	('00000000-0000-0000-0000-000000000000', 346, 'fzs7frkgsh44', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-15 21:35:55.970984+00', '2026-02-15 22:34:05.020668+00', NULL, '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 350, '6f3lkq2h3lci', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 01:29:34.989326+00', '2026-02-16 02:28:05.087416+00', 'uqspkiyzqrwp', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 354, 'ns2eeso75ez3', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 05:23:35.047209+00', '2026-02-16 06:22:05.223444+00', 'krhltgpyswgs', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 358, 'n3estqdy4a5t', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-17 21:52:46.587911+00', '2026-02-18 01:01:56.752682+00', NULL, 'c084284d-3d9f-4146-90d5-266f694904bb'),
	('00000000-0000-0000-0000-000000000000', 362, 'yob3xybifs7e', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-03-19 00:17:15.377973+00', '2026-03-19 00:17:15.377973+00', NULL, '3cef8493-cf79-4e01-9362-6eb5ac95c83b'),
	('00000000-0000-0000-0000-000000000000', 366, 'dqrbjoavlpkh', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 03:18:44.389444+00', '2026-03-19 04:17:02.899746+00', 'z3gwlc7t6zga', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 370, 'im75wrrabpqs', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 07:12:25.165336+00', '2026-03-19 08:10:55.119502+00', 'wxagy7zqhq3e', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 374, '6oh4bxxmdf5q', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 11:06:25.232973+00', '2026-03-19 12:05:27.179962+00', '3ujn5nbg5fqi', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 378, 'hhtm3yt32f5u', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-03-19 14:04:37.63637+00', '2026-03-19 14:04:37.63637+00', 'kephazdzrel5', '5f337b30-641f-46cb-9a00-65a5b79684e3'),
	('00000000-0000-0000-0000-000000000000', 343, 'wrbtzcohksuo', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-01-26 00:54:38.825228+00', '2026-01-26 00:54:38.825228+00', 'oyts3rwudcfs', 'e162e4e5-b589-42b0-9568-699c7e3d6738'),
	('00000000-0000-0000-0000-000000000000', 347, '7vx37arteau5', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-15 22:34:05.046708+00', '2026-02-15 23:32:34.931248+00', 'fzs7frkgsh44', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 351, 'h4llfd4bcs7n', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 02:28:05.105184+00', '2026-02-16 03:26:35.044622+00', '6f3lkq2h3lci', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 355, 'sxxfmzkyayaj', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 06:22:05.235098+00', '2026-02-16 07:20:35.054236+00', 'ns2eeso75ez3', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 359, 'yqqsws7c3rjr', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-02-18 01:01:56.773473+00', '2026-02-18 01:01:56.773473+00', 'n3estqdy4a5t', 'c084284d-3d9f-4146-90d5-266f694904bb'),
	('00000000-0000-0000-0000-000000000000', 363, 'txfbe7jzw6at', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 00:22:01.256562+00', '2026-03-19 01:20:26.072283+00', NULL, 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 367, 'huyrrrtyl6yi', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 04:17:02.907567+00', '2026-03-19 05:15:33.14634+00', 'dqrbjoavlpkh', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 371, '7jnocnietetd', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 08:10:55.138512+00', '2026-03-19 09:09:25.127909+00', 'im75wrrabpqs', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 375, 'cwiae3plh6kq', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 12:05:27.203593+00', '2026-03-19 13:03:37.078703+00', '6oh4bxxmdf5q', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 379, 'wtuj33ynafyb', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-03-19 14:19:24.804897+00', '2026-03-19 14:19:24.804897+00', NULL, 'ba0f9211-edca-47af-b9e1-28326f10c925'),
	('00000000-0000-0000-0000-000000000000', 380, 'hki2mpe4kqfg', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-03-19 14:19:32.448765+00', '2026-03-19 14:19:32.448765+00', NULL, '04f4f2f1-5363-4fce-9e42-f24e8f6fc3a1'),
	('00000000-0000-0000-0000-000000000000', 344, 'ok67jzxvlkwi', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-01-27 09:34:36.697846+00', '2026-01-27 09:34:36.697846+00', NULL, '076fad67-c98e-4e18-b76d-2a00f1211dcf'),
	('00000000-0000-0000-0000-000000000000', 348, '6dsniwptzq6k', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-15 23:32:34.94225+00', '2026-02-16 00:31:05.164201+00', '7vx37arteau5', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 352, 'kxz43whxj22u', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 03:26:35.058013+00', '2026-02-16 04:25:05.083934+00', 'h4llfd4bcs7n', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 356, 'sv4j5fuk5w3j', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-02-16 07:20:35.072481+00', '2026-02-16 07:20:35.072481+00', 'sxxfmzkyayaj', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 360, 'urg35qer2oqj', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-18 09:35:37.828075+00', '2026-02-23 01:48:34.501577+00', 'wm6nv7tdjqee', 'f0bb1878-2ba6-4b32-b8e7-812f0dfe229a'),
	('00000000-0000-0000-0000-000000000000', 364, 'hv3rkalhg2j5', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 01:20:26.09343+00', '2026-03-19 02:19:53.259157+00', 'txfbe7jzw6at', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 368, 'oxfgzmd2nomq', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 05:15:33.171471+00', '2026-03-19 06:13:54.965934+00', 'huyrrrtyl6yi', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 372, 'amrjsydhdyqs', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 09:09:25.143007+00', '2026-03-19 10:07:55.010784+00', '7jnocnietetd', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 376, 'kuoanj345hf2', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-03-19 13:03:37.10437+00', '2026-03-19 13:03:37.10437+00', 'cwiae3plh6kq', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 341, 'oyts3rwudcfs', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-01-22 19:26:52.833889+00', '2026-01-26 00:54:38.804883+00', NULL, 'e162e4e5-b589-42b0-9568-699c7e3d6738'),
	('00000000-0000-0000-0000-000000000000', 345, 'louxr4yvw2rb', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-01-27 09:48:36.87943+00', '2026-01-27 09:48:36.87943+00', NULL, 'b7a13c62-1152-408c-9e9f-1594d1747859'),
	('00000000-0000-0000-0000-000000000000', 349, 'uqspkiyzqrwp', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 00:31:05.185712+00', '2026-02-16 01:29:34.974896+00', '6dsniwptzq6k', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 353, 'krhltgpyswgs', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-16 04:25:05.097003+00', '2026-02-16 05:23:35.033783+00', 'kxz43whxj22u', '6d36edf4-0d3e-4ac7-affe-1cbc58da67f7'),
	('00000000-0000-0000-0000-000000000000', 357, 'wm6nv7tdjqee', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-02-17 19:16:24.986451+00', '2026-02-18 09:35:37.79451+00', NULL, 'f0bb1878-2ba6-4b32-b8e7-812f0dfe229a'),
	('00000000-0000-0000-0000-000000000000', 361, 'uxoaqiwpo5fs', '4adc8121-4169-44a4-afe6-da2fd5dcf587', false, '2026-02-23 01:48:34.541962+00', '2026-02-23 01:48:34.541962+00', 'urg35qer2oqj', 'f0bb1878-2ba6-4b32-b8e7-812f0dfe229a'),
	('00000000-0000-0000-0000-000000000000', 365, 'z3gwlc7t6zga', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 02:19:53.280252+00', '2026-03-19 03:18:44.371024+00', 'hv3rkalhg2j5', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 369, 'wxagy7zqhq3e', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 06:13:54.976417+00', '2026-03-19 07:12:25.14719+00', 'oxfgzmd2nomq', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 373, '3ujn5nbg5fqi', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 10:07:55.023777+00', '2026-03-19 11:06:25.215195+00', 'amrjsydhdyqs', 'd1061a92-d489-402d-a767-998069ab8d9c'),
	('00000000-0000-0000-0000-000000000000', 377, 'kephazdzrel5', '4adc8121-4169-44a4-afe6-da2fd5dcf587', true, '2026-03-19 13:05:57.659087+00', '2026-03-19 14:04:37.612351+00', NULL, '5f337b30-641f-46cb-9a00-65a5b79684e3');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."activity_logs" ("id", "type", "description", "metadata", "created_at") VALUES
	('287589ab-bbeb-4c0c-a471-3fb8ac3a37ee', 'payment_verified', 'Bank transfer matched for Marcus Williams - Term 1 Fees', '{"amount": 3500, "student": "Marcus Williams", "payment_item": "Term 1 Fees 2026/27"}', '2026-01-12 18:54:53.015663+00'),
	('dc2b0ff0-371d-4059-a6e4-cdc72c95e3ac', 'payment_verified', 'Bank transfer matched for Aaliyah Mohammed - Term 1 Fees', '{"amount": 3500, "student": "Aaliyah Mohammed", "payment_item": "Term 1 Fees 2026/27"}', '2026-01-12 18:54:53.015663+00'),
	('a4b73fce-bc31-4a74-8044-0f2fea42bb88', 'receipt_uploaded', 'Receipt uploaded for Ethan Rampersad - Term 1 Fees', '{"amount": 3500, "student": "Ethan Rampersad", "payment_item": "Term 1 Fees 2026/27"}', '2026-01-12 18:54:53.015663+00'),
	('54837f83-8baa-4ea9-96f8-c034f57c9657', 'receipt_uploaded', 'Receipt uploaded for Sophia Charles - Term 1 Fees', '{"amount": 3500, "student": "Sophia Charles", "payment_item": "Term 1 Fees 2026/27"}', '2026-01-12 18:54:53.015663+00'),
	('f5762b44-bdfa-46b1-a9c5-d24f254f2a3a', 'reminder_sent', 'Payment reminder sent to 4 guardians', '{"count": 4, "payment_item": "Term 1 Fees 2026/27"}', '2026-01-12 18:54:53.015663+00'),
	('760080ef-6ce2-4320-a1aa-a31bcb2ddf57', 'payment_item_created', 'Created new payment item: Art Club - Term 1', '{"amount": 250, "payment_item": "Art Club - Term 1"}', '2026-01-12 18:54:53.015663+00'),
	('7fcb424e-62ff-4782-acf8-7b5d344343cd', 'transaction_matched', 'Bank transaction matched to Art Club payment', '{"amount": 250, "student": "Aaliyah Mohammed"}', '2026-01-12 18:54:53.015663+00');


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."teachers" ("id", "first_name", "last_name", "email", "phone", "created_at") VALUES
	('7e903d7e-8ad1-41e9-9b86-1dce09a60930', 'Sarah', 'Johnson', 'sarah.johnson@mrgs.edu.tt', '868-555-0101', '2026-01-12 22:55:32.633615+00'),
	('83adfe6d-ce7e-4794-be2d-32243e12bd4a', 'Michael', 'Chen', 'michael.chen@mrgs.edu.tt', '868-555-0102', '2026-01-12 22:55:32.633615+00'),
	('a2eec386-3654-4856-9ac3-c22c619817b1', 'Priya', 'Sharma', 'priya.sharma@mrgs.edu.tt', '868-555-0103', '2026-01-12 22:55:32.633615+00'),
	('7550060f-b8ef-4f1a-9d00-e286091adc4a', 'David', 'Martinez', 'david.martinez@mrgs.edu.tt', '868-555-0104', '2026-01-12 22:55:32.633615+00'),
	('cc474c66-6909-4bb4-b4e8-48c6098f5905', 'Jennifer', 'Williams', 'jennifer.williams@mrgs.edu.tt', '868-555-0105', '2026-01-12 22:55:32.633615+00'),
	('134dc093-194e-45e0-9902-d47ceee90b26', 'Rajesh', 'Patel', 'rajesh.patel@mrgs.edu.tt', '868-555-0106', '2026-01-12 22:55:32.633615+00'),
	('b9624d1b-0a72-47d6-a15b-b5f86817f88d', 'Michelle', 'Lee', 'michelle.lee@mrgs.edu.tt', '868-555-0107', '2026-01-12 22:55:32.633615+00'),
	('d3830f79-4c19-42f5-a5e6-f1f5456a712d', 'Kevin', 'Brown', 'kevin.brown@mrgs.edu.tt', '868-555-0108', '2026-01-12 22:55:32.633615+00'),
	('55c0b303-3a20-45fc-a179-523c8bfcd970', 'Amanda', 'Davis', 'amanda.davis@mrgs.edu.tt', '868-555-0109', '2026-01-12 22:55:32.633615+00'),
	('acfed260-0e83-4258-927f-220d13026b6a', 'Carlos', 'Rodriguez', 'carlos.rodriguez@mrgs.edu.tt', '868-555-0110', '2026-01-12 22:55:32.633615+00'),
	('74b05162-bb69-40f7-aaef-c5ee30c67ab4', 'Test', 'Teacher', 'test.teacher@mrgs.edu.tt', '868 324 3432', '2026-01-13 16:04:39.560192+00');


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."classes" ("id", "grade", "section", "teacher_id", "created_at") VALUES
	('91633268-30b1-4c57-a6f1-0871e8621e1a', 'Standard 1', 'A', '7e903d7e-8ad1-41e9-9b86-1dce09a60930', '2026-01-12 22:55:32.633615+00'),
	('628986b1-2ef9-4a4f-8b40-973b1fc75a5d', 'Standard 1', 'B', '83adfe6d-ce7e-4794-be2d-32243e12bd4a', '2026-01-12 22:55:32.633615+00'),
	('ee3cf13b-6149-482a-a66f-d96380d5c7f5', 'Standard 2', 'A', 'a2eec386-3654-4856-9ac3-c22c619817b1', '2026-01-12 22:55:32.633615+00'),
	('e563e251-cef1-40ba-b850-43dd63674ebc', 'Standard 2', 'B', '7550060f-b8ef-4f1a-9d00-e286091adc4a', '2026-01-12 22:55:32.633615+00'),
	('cc4ebce2-a496-467b-95c4-ba6a0ebdd6e9', 'Standard 3', 'A', 'cc474c66-6909-4bb4-b4e8-48c6098f5905', '2026-01-12 22:55:32.633615+00'),
	('f52228f0-de2b-4bb9-a485-ff838a50ee8b', 'Standard 3', 'B', '134dc093-194e-45e0-9902-d47ceee90b26', '2026-01-12 22:55:32.633615+00'),
	('3228e33a-17ff-45a8-825c-54b88ff5e5a5', 'Standard 4', 'A', 'b9624d1b-0a72-47d6-a15b-b5f86817f88d', '2026-01-12 22:55:32.633615+00'),
	('7a16fa1b-83ac-40ce-8b45-8cf935b1310f', 'Standard 4', 'B', 'd3830f79-4c19-42f5-a5e6-f1f5456a712d', '2026-01-12 22:55:32.633615+00'),
	('00b8ab7f-1f1c-486a-a903-4a9635a1a481', 'Standard 5', 'A', '55c0b303-3a20-45fc-a179-523c8bfcd970', '2026-01-12 22:55:32.633615+00'),
	('3ae3ec96-1702-45a9-911c-cd9a035061ce', 'Standard 5', 'B', 'acfed260-0e83-4258-927f-220d13026b6a', '2026-01-12 22:55:32.633615+00');


--
-- Data for Name: guardians; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."guardians" ("id", "first_name", "last_name", "phone", "email", "whatsapp", "created_at", "access_token", "user_role") VALUES
	('a1111111-1111-1111-1111-111111111111', 'Patricia', 'Williams', '868-555-0101', 'patricia.williams@email.com', '868-555-0101', '2026-01-12 18:53:49.744841+00', '536c1276fba8466ba204f45ece7c2d86', 'guardian'),
	('a1111111-1111-1111-1111-111111111112', 'Michael', 'Williams', '868-555-0102', 'michael.williams@email.com', '868-555-0102', '2026-01-12 18:53:49.744841+00', '7c148b80d63342da8b57844b0da1e494', 'guardian'),
	('a2222222-2222-2222-2222-222222222221', 'Fatima', 'Mohammed', '868-555-0201', 'fatima.mohammed@email.com', '868-555-0201', '2026-01-12 18:53:49.744841+00', '71319ca03a4e40ffb28e3969877dee4a', 'guardian'),
	('a2222222-2222-2222-2222-222222222222', 'Ahmed', 'Mohammed', '868-555-0202', 'ahmed.mohammed@email.com', '868-555-0202', '2026-01-12 18:53:49.744841+00', '23a6f8fa81f940d3a25d7500058e13a4', 'guardian'),
	('a3333333-3333-3333-3333-333333333331', 'Priya', 'Singh', '868-555-0301', 'priya.singh@email.com', '868-555-0301', '2026-01-12 18:53:49.744841+00', '28a6024de9cd47f485077a2e11b8fbbe', 'guardian'),
	('a3333333-3333-3333-3333-333333333332', 'Rajesh', 'Singh', '868-555-0302', 'rajesh.singh@email.com', '868-555-0302', '2026-01-12 18:53:49.744841+00', '530f0e2ebf924428836e5f81aa51d5f4', 'guardian'),
	('a4444444-4444-4444-4444-444444444441', 'Michelle', 'Baptiste', '868-555-0401', 'michelle.baptiste@email.com', '868-555-0401', '2026-01-12 18:53:49.744841+00', 'fd6273b67a1c47479475ab601a74b6c9', 'guardian'),
	('a4444444-4444-4444-4444-444444444442', 'Andre', 'Baptiste', '868-555-0402', 'andre.baptiste@email.com', '868-555-0402', '2026-01-12 18:53:49.744841+00', '07aebab148c54ba2a35fcabc9c5be980', 'guardian'),
	('a5555555-5555-5555-5555-555555555551', 'Sunita', 'Rampersad', '868-555-0501', 'sunita.rampersad@email.com', '868-555-0501', '2026-01-12 18:53:49.744841+00', 'edc8fc4b101145f782b965ed162d0628', 'guardian'),
	('a6666666-6666-6666-6666-666666666661', 'Jennifer', 'Charles', '868-555-0601', 'jennifer.charles@email.com', '868-555-0601', '2026-01-12 18:53:49.744841+00', '864971ce39d34d74829b8fd45faa5fee', 'guardian'),
	('a6666666-6666-6666-6666-666666666662', 'David', 'Charles', '868-555-0602', 'david.charles@email.com', '868-555-0602', '2026-01-12 18:53:49.744841+00', 'edeb4be5ca5f4a09aae549bc9b005c5b', 'guardian'),
	('a7777777-7777-7777-7777-777777777771', 'Kavita', 'Ramkissoon', '868-555-0701', 'kavita.ramkissoon@email.com', '868-555-0701', '2026-01-12 18:53:49.744841+00', '721b5b05a4ba4ad6a037ca04c4891444', 'guardian'),
	('a7777777-7777-7777-7777-777777777772', 'Anil', 'Ramkissoon', '868-555-0702', 'anil.ramkissoon@email.com', '868-555-0702', '2026-01-12 18:53:49.744841+00', 'f6eebed85a9549af8c5276ed780ded36', 'guardian'),
	('a8888888-8888-8888-8888-888888888881', 'Karen', 'Joseph', '868-555-0801', 'karen.joseph@email.com', '868-555-0801', '2026-01-12 18:53:49.744841+00', 'a4692e0504324f069c57583d275a2c5b', 'guardian'),
	('a9999999-9999-9999-9999-999999999991', 'Anita', 'Persad', '868-555-0901', 'anita.persad@email.com', '868-555-0901', '2026-01-12 18:53:49.744841+00', '078f87e9e16140efad189fa36243d782', 'guardian'),
	('a9999999-9999-9999-9999-999999999992', 'Ravi', 'Persad', '868-555-0902', 'ravi.persad@email.com', '868-555-0902', '2026-01-12 18:53:49.744841+00', '7f936efbe66e4091a9375f10452d420b', 'guardian'),
	('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'Lisa', 'George', '868-555-1001', 'lisa.george@email.com', '868-555-1001', '2026-01-12 18:53:49.744841+00', '8bf4f0ae62424f4da7d327dac750f5d3', 'guardian'),
	('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'Christopher', 'George', '868-555-1002', 'christopher.george@email.com', '868-555-1002', '2026-01-12 18:53:49.744841+00', '0bb3567330864563af8f1bfe22c7535e', 'guardian'),
	('c47646ff-42c1-4beb-b0da-d52665b4c036', 'Sheldon', 'Hall', '18686847126', 'sheldonhhall@gmail.com', '18686847126', '2026-01-19 14:17:38.58403+00', 'qogq4c9bihq', 'guardian'),
	('50f1552f-2721-4239-be85-ef24e9d10ffd', 'Josanne', 'Reid', '868 364 3235', 'josanne.reid@gmail.com', '868 364 3235', '2026-01-20 02:23:30.238609+00', 'x9e3xq261y', 'guardian');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_items" ("id", "category", "title", "description", "amount", "due_date", "status", "bank_transfer_enabled", "wipay_enabled", "whatsapp_notifications", "email_notifications", "created_at", "cash_enabled", "file_url", "is_mandatory", "max_capacity", "location", "schedule", "icon_url") VALUES
	('18d75a6d-8ea8-468a-8c3a-e00eab408578', 'Club', 'Art with Ms. Mohammed (Infants 2 - Grade 1)', 'Art encompasses a wide range of creative disciplines that encourage self-expression, imagination, and skill development. Art encourages students to explore their thoughts, emotions, and ideas through visual mediums. Students will learn fundamental artistic skills such as drawing, painting, composition, and perspective.', 400, '2026-01-30', 'Active', true, true, true, true, '2026-01-16 13:06:38.650459+00', true, NULL, false, 25, 'At school', '[{"day": "Thursday", "endTime": "15:30", "startTime": "14:30"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768568797148-zx6q5p.jpg'),
	('e702eefc-caec-4e41-b072-93d919da0553', 'Club', 'Chess (Infants 2- Grade 5)', 'Learn to play Chess with Coach Adrian Atwell.

Sign up to learn the fun and exciting game of chess. This opportunity to acquire the strategic skill of moving 16 pieces across a checkered board alongside an opponent.', 450, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:17:27.257873+00', true, NULL, false, 30, 'At school', NULL, 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768569446565-epo3up.jpg'),
	('51651e05-085f-4cd9-8948-e694ec51d18b', 'Club', ' Brownies & Guides (Infants 2 - Grade 5)', 'Brownies & Junior Guides, aims to empower girls, build leadership skills, promote community service, and foster friendships in a supportive environment. Students participate in a variety of activities that promote personal development, teamwork, and confidence building', 250, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:14:55.838647+00', true, NULL, false, 100, 'At school', '[{"day": "Friday", "endTime": "16:00", "startTime": "14:45"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768569294870-wvxv7a.webp'),
	('8f064123-124f-480c-a6a0-e7ff6e444a11', 'Club', 'Craft (Junior) - (Infants 2 - Grade 1)', 'Craft as an extracurricular activity encompasses a wide range of hands-on creative projects that involve making objects by hand. Students will learn specific crafting techniques such as cutting, stitching, painting, and assembling. Completing craft projects requires patience, perseverance, and attention to detail.', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:28:54.246907+00', true, NULL, false, 20, 'At school', '[{"day": "Thursday", "endTime": "12:40", "startTime": "12:00"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768570133118-m00nlt.png'),
	('61df837a-2d41-4791-8443-8ebddb01ebb2', 'Club', ' Art (Grades 2 - 5)', 'Art encompasses a wide range of creative disciplines that encourage self-expression, imagination, and skill development. Art encourages students to explore their thoughts, emotions, and ideas through visual mediums. Students will learn fundamental artistic skills such as drawing, painting, composition, and perspective.', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-15 20:42:08.776227+00', true, NULL, false, 25, 'At school', '[{"day": "Wednesday", "endTime": "15:30", "startTime": "14:30"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768509727040-oi87eq.jpg'),
	('349d69e3-face-476f-b1de-3fbf00a875f3', 'Club', 'Ballet', 'Ballet promotes physical fitness, artistic expression, discipline, and personal growth. It provides a structured and enriching environment where students can develop lifelong skills, appreciation for the arts, and potential pathways in professional dance or related fields

Students learn classical ballet techniques such as positions, movements (plié, tendu, relevé, etc.), and ballet vocabulary (e.g., arabesque, pirouette).Practicing at the ballet barre to develop strength, flexibility, balance, and correct body alignment.

Ballet instills discipline, concentration, and dedication through regular practice and attention to detail. Mastering ballet techniques and performing on stage builds confidence, self-esteem, and poise.', 500, '2026-01-30', 'Active', true, true, true, true, '2026-01-16 13:09:10.800247+00', true, NULL, false, 25, 'At school', NULL, 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768569095721-5jkqq7.jpg'),
	('d1011cb7-2239-4a5f-972f-870b7ed25311', 'Club', 'Craft (Senior) - (Grade 2 - Grade 5)', 'Craft as an extracurricular activity encompasses a wide range of hands-on creative projects that involve making objects by hand. Students will learn specific crafting techniques such as cutting, stitching, painting, and assembling. Completing craft projects requires patience, perseverance, and attention to detail.', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:31:03.982759+00', true, NULL, false, 20, 'At school', '[{"day": "Friday", "endTime": "12:40", "startTime": "12:00"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768570262899-rp6zb.jpg'),
	('872b4410-48c3-4c1c-80f0-20c1331d7d08', 'Club', 'Cricket (Grades 1 - 5)', 'Cricket offers students the opportunity to engage in a dynamic team sport that combines athleticism, strategy, and camaraderie. Students learn various batting strokes, footwork, timing, and shot selection. They will learn catching, throwing, and field placement strategies.', 500, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:33:14.600204+00', true, NULL, false, 24, 'At school', '[{"day": "Monday", "endTime": "14:45", "startTime": "14:45"}, {"day": "Wednesday", "endTime": "15:45", "startTime": "14:45"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768570393190-nap1g.png'),
	('a5ba7893-eaa3-450f-9c98-f30d5c705926', 'Club', 'Gymnastics (Grades 1 - Grades 5)', 'Gymnastics enhances strength, flexibility, agility, coordination, and overall physical conditioning. Participants learn specific gymnastic skills and techniques, progressing from basic moves to more advanced maneuvers. The sport requires dedication, practice, and concentration, fostering discipline and focus in participants.', 650, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:39:38.407526+00', true, NULL, false, 20, 'At school', NULL, 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768570777290-7sktxq.jpg'),
	('656d02f9-acd3-400c-a2a9-0dc0ebd0d109', 'Club', 'Basketball', '', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:13:35.840202+00', true, NULL, false, 30, 'At school', '[{"day": "Thursday", "endTime": "16:00", "startTime": "14:45"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768569214410-7q6y6.webp'),
	('19e58e53-5245-407b-b7f5-d63872b3f2d8', 'Club', 'Choir (Infants 2 - Grade 5)', 'Mr. Joseph and Mr. Davis are the artistic directors of this fantastic choir. Join the music festival champions as they sing their hearts out. Choirs provide an outlet for artistic expression, allowing students to interpret and convey emotions through music. Choirs promote collaboration among members, fostering friendships and a sense of community through shared musical experiences.', 350, '2026-01-30', 'Active', true, true, true, true, '2026-01-16 12:53:27.241496+00', true, NULL, false, 20, 'At school', '[{"day": "Monday", "endTime": "12:40", "startTime": "12:00"}, {"day": "Friday", "endTime": "12:40", "startTime": "12:00"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768568005392-mdokp.jpg'),
	('af13c852-bce7-47b9-be5b-c678406c47bd', 'Club', 'Gymnastics (Grades 1 - Grades 5)', 'Gymnastics enhances strength, flexibility, agility, coordination, and overall physical conditioning. Participants learn specific gymnastic skills and techniques, progressing from basic moves to more advanced maneuvers. The sport requires dedication, practice, and concentration, fostering discipline and focus in participants.', 650, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:39:41.854782+00', true, NULL, false, 20, 'At school', NULL, 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768570780725-jym81g.jpg'),
	('65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'Club', 'Legion of Mary', 'In keeping with the ethos of the Founder, Frank Duff, and his ministry of personal contact or friendship, our legionaries seek to be a visible expression and instrument of Mary’s love for everyone.

Meetings are held weekly in our chapel. Here, our legionaries pray the rosary and discuss the good deeds done over the past week. These good deeds include helping friends at school, assisting with chores at home, and spending time with older relatives and younger siblings.

Once a year, they attend the Acies Ceremony, the central and annual function of the Legion, and take part in the annual Corpus Christi Walk as well as the Poor Man’s Dinner.', 0, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:44:44.088022+00', true, NULL, true, 0, 'At school', '[{"day": "Tuesday", "endTime": "12:40", "startTime": "12:00"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768571083543-jaaq1.jpg'),
	('39a8f7a9-6793-4611-a570-a6122bfb3c66', 'Club', 'Young Einstein''s (Grades 2 - Grade 5)', 'Young Einstein engage and challenge young students in various fields of science, mathematics, engineering, and technology (STEM). There are problem-solving activities and competitions that develop reasoning, logic, and critical thinking skills.', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:56:16.299986+00', true, NULL, false, 30, 'At school', '[{"day": "Wednesday", "endTime": "12:45", "startTime": "12:00"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768571774687-ykp4nk.jpg'),
	('71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'Term Fees', 'Term 2 (2025 - 2026 School Year)', 'Welcome to a new term', 6000, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:49:39.323263+00', true, NULL, true, 0, 'At school', NULL, 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768571377984-sp9wfm.jpg'),
	('b5947e4d-3484-42ac-9e06-180444d01817', 'Club', 'Craft (Infants 1)', 'Craft as an extracurricular activity encompasses a wide range of hands-on creative projects that involve making objects by hand. Students will learn specific crafting techniques such as cutting, stitching, painting, and assembling. Completing craft projects requires patience, perseverance, and attention to detail.', 400, '2026-01-31', 'Active', true, true, true, true, '2026-01-16 13:25:29.004384+00', true, NULL, false, 20, 'At school', '[{"day": "Wednesday", "endTime": "15:15", "startTime": "14:15"}]', 'https://rbmzhlesphzhsebsbefo.supabase.co/storage/v1/object/public/payment-item-icons/1768569927695-rrduto.jpg');


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."students" ("id", "first_name", "last_name", "created_at", "class_id", "student_id", "date_of_birth") VALUES
	('11111111-1111-1111-1111-111111111111', 'Marcus', 'Williams', '2026-01-12 18:53:49.744841+00', 'cc4ebce2-a496-467b-95c4-ba6a0ebdd6e9', 'STU00001', '2010-01-01'),
	('22222222-2222-2222-2222-222222222222', 'Aaliyah', 'Mohammed', '2026-01-12 18:53:49.744841+00', '3ae3ec96-1702-45a9-911c-cd9a035061ce', 'STU00002', '2010-01-01'),
	('33333333-3333-3333-3333-333333333333', 'Joshua', 'Singh', '2026-01-12 18:53:49.744841+00', 'ee3cf13b-6149-482a-a66f-d96380d5c7f5', 'STU00003', '2010-01-01'),
	('44444444-4444-4444-4444-444444444444', 'Gabrielle', 'Baptiste', '2026-01-12 18:53:49.744841+00', '3228e33a-17ff-45a8-825c-54b88ff5e5a5', 'STU00004', '2010-01-01'),
	('55555555-5555-5555-5555-555555555555', 'Ethan', 'Rampersad', '2026-01-12 18:53:49.744841+00', '628986b1-2ef9-4a4f-8b40-973b1fc75a5d', 'STU00005', '2010-01-01'),
	('66666666-6666-6666-6666-666666666666', 'Sophia', 'Charles', '2026-01-12 18:53:49.744841+00', 'f52228f0-de2b-4bb9-a485-ff838a50ee8b', 'STU00006', '2010-01-01'),
	('77777777-7777-7777-7777-777777777777', 'Isaiah', 'Ramkissoon', '2026-01-12 18:53:49.744841+00', '00b8ab7f-1f1c-486a-a903-4a9635a1a481', 'STU00007', '2010-01-01'),
	('88888888-8888-8888-8888-888888888888', 'Maya', 'Joseph', '2026-01-12 18:53:49.744841+00', 'e563e251-cef1-40ba-b850-43dd63674ebc', 'STU00008', '2010-01-01'),
	('99999999-9999-9999-9999-999999999999', 'Daniel', 'Persad', '2026-01-12 18:53:49.744841+00', '7a16fa1b-83ac-40ce-8b45-8cf935b1310f', 'STU00009', '2010-01-01'),
	('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Isabella', 'George', '2026-01-12 18:53:49.744841+00', '91633268-30b1-4c57-a6f1-0871e8621e1a', 'STU00010', '2010-01-01'),
	('15b39018-d038-4c6c-bbc0-bd4a021428c0', 'Test', 'User', '2026-01-13 16:03:38.515375+00', 'cc4ebce2-a496-467b-95c4-ba6a0ebdd6e9', 'STU00011', '2020-01-01'),
	('ad667a08-a515-4972-b381-e619756a13f2', 'Sean', 'Hall', '2026-01-19 17:05:54.115452+00', '3ae3ec96-1702-45a9-911c-cd9a035061ce', 'STU00012', '2018-01-01'),
	('877f6a43-503e-4938-b954-291ee3eadca4', 'Shelly', 'Hall', '2026-01-19 17:07:00.351114+00', 'cc4ebce2-a496-467b-95c4-ba6a0ebdd6e9', 'STU00013', '2020-12-12'),
	('c85372dc-a7af-4b39-9a21-23c7d11f1351', 'Norah', 'Reid', '2026-01-20 02:23:39.107539+00', 'cc4ebce2-a496-467b-95c4-ba6a0ebdd6e9', 'STU00014', '2014-10-05'),
	('5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', 'Blair', 'Reid', '2026-01-20 02:24:55.644702+00', '7a16fa1b-83ac-40ce-8b45-8cf935b1310f', 'STU00015', '2020-06-08');


--
-- Data for Name: payment_item_students; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_item_students" ("id", "payment_item_id", "student_id", "created_at") VALUES
	('2f9843db-f660-4941-8132-afcb610f62e6', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '22222222-2222-2222-2222-222222222222', '2026-01-16 12:53:27.477413+00'),
	('12219a44-b933-4650-b5e1-41d3a978d843', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '99999999-9999-9999-9999-999999999999', '2026-01-16 12:53:27.477413+00'),
	('a2512e18-6ea9-47b7-aa70-d7bf1fae1258', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '55555555-5555-5555-5555-555555555555', '2026-01-16 12:53:27.477413+00'),
	('85e4689f-95ec-48a8-af4b-d21d5c742f6a', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '44444444-4444-4444-4444-444444444444', '2026-01-16 12:53:27.477413+00'),
	('697d150b-0726-4ec7-b834-a39e2e8c17ea', '19e58e53-5245-407b-b7f5-d63872b3f2d8', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 12:53:27.477413+00'),
	('918f1f2f-610d-49fc-aac2-682e23c31984', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '77777777-7777-7777-7777-777777777777', '2026-01-16 12:53:27.477413+00'),
	('b69865d9-34bd-4966-932c-d4de8c547e69', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '33333333-3333-3333-3333-333333333333', '2026-01-16 12:53:27.477413+00'),
	('2ade0292-141c-4c18-bf33-abcaf5072c6c', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '11111111-1111-1111-1111-111111111111', '2026-01-16 12:53:27.477413+00'),
	('440b4759-4017-44a9-8055-cf14c1624770', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '88888888-8888-8888-8888-888888888888', '2026-01-16 12:53:27.477413+00'),
	('f1807414-9d49-46ef-9eac-4e4ff9e7cc51', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '66666666-6666-6666-6666-666666666666', '2026-01-16 12:53:27.477413+00'),
	('2b4eba67-fd6f-4cca-be88-99a68be02b89', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 12:53:27.477413+00'),
	('285e27dc-c789-4a86-bd52-3df2b524e2b5', '61df837a-2d41-4791-8443-8ebddb01ebb2', '22222222-2222-2222-2222-222222222222', '2026-01-15 20:42:09.257726+00'),
	('27d603bc-d3c1-468c-8e8c-b252de73402d', '349d69e3-face-476f-b1de-3fbf00a875f3', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:09:11.017685+00'),
	('f3dcf162-5b3f-41ea-8638-4c56a53badfe', '349d69e3-face-476f-b1de-3fbf00a875f3', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:09:11.017685+00'),
	('0a874b9c-4e59-4541-8091-01925208272c', '349d69e3-face-476f-b1de-3fbf00a875f3', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:09:11.017685+00'),
	('f8629395-aa34-4343-85f8-19d03352c4b8', '349d69e3-face-476f-b1de-3fbf00a875f3', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:09:11.017685+00'),
	('e4c4874b-ccd3-4b8e-9859-2248e261fe79', '349d69e3-face-476f-b1de-3fbf00a875f3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:09:11.017685+00'),
	('f43b404f-d0a9-45d5-a189-f1ed628a4657', '349d69e3-face-476f-b1de-3fbf00a875f3', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:09:11.017685+00'),
	('a7128573-2f99-4f27-adbd-fbf761d8590b', '349d69e3-face-476f-b1de-3fbf00a875f3', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:09:11.017685+00'),
	('aad9bb13-f50c-40d1-9f9e-9e867387174e', '61df837a-2d41-4791-8443-8ebddb01ebb2', '88888888-8888-8888-8888-888888888888', '2026-01-15 20:42:09.257726+00'),
	('0835d427-e693-403d-86d1-0b774bbf6a5e', '61df837a-2d41-4791-8443-8ebddb01ebb2', '66666666-6666-6666-6666-666666666666', '2026-01-15 20:42:09.257726+00'),
	('8d74aa17-88c2-494f-8a16-e8aa6687b000', '61df837a-2d41-4791-8443-8ebddb01ebb2', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-15 20:42:09.257726+00'),
	('18f13455-0c1b-4c08-bb0b-7fb4d72a68a6', '61df837a-2d41-4791-8443-8ebddb01ebb2', '99999999-9999-9999-9999-999999999999', '2026-01-16 12:01:08.786911+00'),
	('d8e452d7-98e7-4c0f-9ded-a34a1b182a68', '61df837a-2d41-4791-8443-8ebddb01ebb2', '55555555-5555-5555-5555-555555555555', '2026-01-16 12:01:08.786911+00'),
	('4e6d657b-b0d2-4f44-9240-62434e3b23a9', '61df837a-2d41-4791-8443-8ebddb01ebb2', '44444444-4444-4444-4444-444444444444', '2026-01-16 12:01:08.786911+00'),
	('2eeeb99c-954e-45e9-b73f-b2a3610be625', '61df837a-2d41-4791-8443-8ebddb01ebb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 12:01:08.786911+00'),
	('ed2b8af9-36de-4674-acbd-a3efb8a1bff9', '61df837a-2d41-4791-8443-8ebddb01ebb2', '77777777-7777-7777-7777-777777777777', '2026-01-16 12:01:08.786911+00'),
	('d9b2d537-98f6-4a37-b98a-b82dadbe631d', '61df837a-2d41-4791-8443-8ebddb01ebb2', '33333333-3333-3333-3333-333333333333', '2026-01-16 12:01:08.786911+00'),
	('bd19a2c3-f948-43b9-8737-252bb3cf9954', '61df837a-2d41-4791-8443-8ebddb01ebb2', '11111111-1111-1111-1111-111111111111', '2026-01-16 12:01:08.786911+00'),
	('52f4a0cf-0fc3-4931-9b1a-8976667aef89', '349d69e3-face-476f-b1de-3fbf00a875f3', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:09:11.017685+00'),
	('6676f52a-317c-4bec-81e9-5aee34f2e162', '349d69e3-face-476f-b1de-3fbf00a875f3', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:09:11.017685+00'),
	('eff209e7-a729-4007-ae0b-993b6467cacd', '349d69e3-face-476f-b1de-3fbf00a875f3', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:09:11.017685+00'),
	('2ac2db82-1962-4bc2-8130-189d738be659', '349d69e3-face-476f-b1de-3fbf00a875f3', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:09:11.017685+00'),
	('2d505586-6f7f-4378-924e-86911542749f', '51651e05-085f-4cd9-8948-e694ec51d18b', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:14:56.060054+00'),
	('3a817fc7-935c-410e-9111-c353a67a4c50', '51651e05-085f-4cd9-8948-e694ec51d18b', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:14:56.060054+00'),
	('652199d4-7b90-4c71-b10e-526e7602a9f8', '51651e05-085f-4cd9-8948-e694ec51d18b', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:14:56.060054+00'),
	('45880ac3-d879-44f0-b2ae-861174a0f2b8', '51651e05-085f-4cd9-8948-e694ec51d18b', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:14:56.060054+00'),
	('7d069f84-4c63-4883-aebf-7945e1152ff7', '51651e05-085f-4cd9-8948-e694ec51d18b', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:14:56.060054+00'),
	('c78f8b02-93a8-4c2e-8cc8-c976e1e13bb8', '51651e05-085f-4cd9-8948-e694ec51d18b', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:14:56.060054+00'),
	('ae4651ff-6753-492a-8052-c218a90ee5ed', '51651e05-085f-4cd9-8948-e694ec51d18b', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:14:56.060054+00'),
	('36fe5bf8-8b41-4441-b9e8-70d245d8cdce', '51651e05-085f-4cd9-8948-e694ec51d18b', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:14:56.060054+00'),
	('de19dd3c-ea7b-4dd9-a3f8-09948ec0466a', '51651e05-085f-4cd9-8948-e694ec51d18b', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:14:56.060054+00'),
	('afdc4d23-682d-4eab-becb-8a22a9700bbf', '51651e05-085f-4cd9-8948-e694ec51d18b', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:14:56.060054+00'),
	('f7d7eb2f-b9e2-43a7-b878-0586340b0cda', '51651e05-085f-4cd9-8948-e694ec51d18b', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:14:56.060054+00'),
	('633314a3-f1c7-4eae-8042-af55a025025b', 'b5947e4d-3484-42ac-9e06-180444d01817', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:25:29.270311+00'),
	('a40d5540-5644-40ee-80c3-d22816b60b80', 'b5947e4d-3484-42ac-9e06-180444d01817', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:25:29.270311+00'),
	('add5cbd9-6de8-437c-9db2-46a1327a8baf', 'b5947e4d-3484-42ac-9e06-180444d01817', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:25:29.270311+00'),
	('5f76e3d5-457a-4a0d-9c02-a2b46772dd05', 'b5947e4d-3484-42ac-9e06-180444d01817', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:25:29.270311+00'),
	('43a48a2a-2546-45c1-95f2-009afacb4e28', 'b5947e4d-3484-42ac-9e06-180444d01817', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:25:29.270311+00'),
	('94cd9763-fefe-429a-9ef1-d5dfd8d7f24f', 'b5947e4d-3484-42ac-9e06-180444d01817', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:25:29.270311+00'),
	('f05d29fd-67bb-4852-a618-d305b66c9f4e', 'b5947e4d-3484-42ac-9e06-180444d01817', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:25:29.270311+00'),
	('746359cd-b277-4cf5-aafe-35648247ac5d', 'b5947e4d-3484-42ac-9e06-180444d01817', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:25:29.270311+00'),
	('74c09709-d540-42df-9db6-42646a1bca44', 'b5947e4d-3484-42ac-9e06-180444d01817', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:25:29.270311+00'),
	('1f460232-c7b9-4661-81b6-38c62ba6f714', 'b5947e4d-3484-42ac-9e06-180444d01817', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:25:29.270311+00'),
	('7bb0e6f7-dd90-4d9e-87bf-bbb57c4ac10b', 'b5947e4d-3484-42ac-9e06-180444d01817', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:25:29.270311+00'),
	('921eb21b-f9bc-4b0d-9c86-9734eeed9044', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:31:04.200931+00'),
	('1c960605-1d6d-4679-a9e5-fc97e8c49384', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:31:04.200931+00'),
	('2b27a51a-01a3-4477-8d3c-5a506bea0e7c', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:31:04.200931+00'),
	('e8014287-82e6-438a-9498-c8d43d6282fe', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:31:04.200931+00'),
	('03302190-204f-4cbc-8209-c093baa62d81', 'd1011cb7-2239-4a5f-972f-870b7ed25311', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:31:04.200931+00'),
	('f869c386-64e4-47e3-9e62-8bdabcf265df', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:31:04.200931+00'),
	('14eef130-e2a6-4d48-b39b-e36f05fbd571', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:31:04.200931+00'),
	('4a22145f-1ce4-42d1-8283-057b763200a9', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:31:04.200931+00'),
	('91d029a8-fe78-4432-8217-82bc16b758db', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:31:04.200931+00'),
	('71ee5322-67f4-4644-93fb-02ba181881b8', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:31:04.200931+00'),
	('45371c37-4609-4a0c-9903-a85254218472', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:31:04.200931+00'),
	('8225b4d2-89b0-454a-9eaf-5d518f09a3e2', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:39:38.623374+00'),
	('1ea11897-8493-4b62-9381-27ac5688cb44', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:39:38.623374+00'),
	('6d52e19a-3bf0-491d-8d18-36784b6e0e7b', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:39:38.623374+00'),
	('d195def5-33c8-4a01-8204-b060366d63a2', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:39:38.623374+00'),
	('d00759e4-76b1-4a2a-8ec2-34ad723450bb', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:39:38.623374+00'),
	('90e97c0e-11f0-4ac0-89c8-649f61bdce6a', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:39:38.623374+00'),
	('df9667e5-d762-4343-b9e2-aaa340771d25', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:39:38.623374+00'),
	('77e6f0fa-8c70-4c22-a3a7-2050d150ae75', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:39:38.623374+00'),
	('ad1b054a-384e-492f-8d95-9d23cb4b8428', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:39:38.623374+00'),
	('80e7d9d5-874e-4630-900d-a7537df1cdad', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:39:38.623374+00'),
	('974ae782-c19e-4fa9-bdc7-8a16ddc42fea', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:39:38.623374+00'),
	('eb15a7e5-9e20-4647-a77d-17a5ecae23c1', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:06:38.967911+00'),
	('6938605e-2983-4467-a1e8-c10c1ffdaf30', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:06:38.967911+00'),
	('c2d21b82-0409-4226-b5ab-0059d049e8fc', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:06:38.967911+00'),
	('2d2afe65-d5f9-4c9c-9964-fcc35d6bc397', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:06:38.967911+00'),
	('4da7d0f7-430c-45e5-8431-28045f50f36f', '18d75a6d-8ea8-468a-8c3a-e00eab408578', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:06:38.967911+00'),
	('2f199334-9ae2-4a23-b68d-f7cfd4703966', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:06:38.967911+00'),
	('4656e0f5-0023-4f96-a36c-1f8733c7e39a', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:06:38.967911+00'),
	('d35f91b6-1f52-4795-9d9e-0f0a9770fbc5', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:06:38.967911+00'),
	('34cc0bc1-a2d6-4f73-9065-9b6f8ca34e1b', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:06:38.967911+00'),
	('f1f6dc2b-bff5-479f-915d-e2ffae4d1f63', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:06:38.967911+00'),
	('7fedd13e-ab9a-43eb-b62d-81766999c751', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:06:38.967911+00'),
	('12fde51c-e260-47b8-8e0a-fa30da0c8044', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:13:36.107143+00'),
	('56606191-c880-486b-b42d-c669d7b57916', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:13:36.107143+00'),
	('dfa1db27-8c7d-4924-9f77-4ae232bad142', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:13:36.107143+00'),
	('9eb2f22d-9b33-4aa3-9e2e-c1a5e28a0931', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:13:36.107143+00'),
	('0ec79c52-e232-41dc-9f00-034cfa5bc214', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:13:36.107143+00'),
	('d1a9d571-080f-436e-90de-33c0ba74b0a1', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:13:36.107143+00'),
	('26b763da-8207-4859-9e98-7ad69132b223', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:13:36.107143+00'),
	('fe6205a3-007a-4ad0-89a0-704bb804073b', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:13:36.107143+00'),
	('febda8d4-7b9e-4ab3-b226-7c51d88aa168', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:13:36.107143+00'),
	('fb936859-cedd-425a-bd51-334790d0cc30', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:13:36.107143+00'),
	('d2f0d78a-941c-4beb-acf7-d26fe50267c9', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:13:36.107143+00'),
	('f14d505d-84c4-44f9-a2ba-8ddbcbb755c7', 'e702eefc-caec-4e41-b072-93d919da0553', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:17:27.482769+00'),
	('a2ec3e5c-228d-43bf-babc-b61d564e8f1a', 'e702eefc-caec-4e41-b072-93d919da0553', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:17:27.482769+00'),
	('246ad79a-6ee6-41f6-80b6-c0bc780fe329', 'e702eefc-caec-4e41-b072-93d919da0553', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:17:27.482769+00'),
	('1c5a2b57-54c9-48e3-8227-5bbe7e36049a', 'e702eefc-caec-4e41-b072-93d919da0553', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:17:27.482769+00'),
	('b0d505d6-7e8e-453c-a80a-398a48253283', 'e702eefc-caec-4e41-b072-93d919da0553', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:17:27.482769+00'),
	('ca5f6b61-9b44-44e1-8bfc-7ebff05a1a0d', 'e702eefc-caec-4e41-b072-93d919da0553', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:17:27.482769+00'),
	('407e18ed-3c86-4d1b-a4d5-0a0d5c2cb935', 'e702eefc-caec-4e41-b072-93d919da0553', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:17:27.482769+00'),
	('288e7424-f2c0-4e09-b63e-c1964efc6164', 'e702eefc-caec-4e41-b072-93d919da0553', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:17:27.482769+00'),
	('ebfb5b24-5ba3-43bd-986a-b6fb9a6b2fb9', 'e702eefc-caec-4e41-b072-93d919da0553', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:17:27.482769+00'),
	('a017952a-676c-41a3-b6f2-908bf18f685e', 'e702eefc-caec-4e41-b072-93d919da0553', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:17:27.482769+00'),
	('e7b61d7e-ca3e-45a0-a84e-a4a16e34427b', 'e702eefc-caec-4e41-b072-93d919da0553', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:17:27.482769+00'),
	('16220df8-34da-464c-bd65-a8164516a600', '8f064123-124f-480c-a6a0-e7ff6e444a11', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:28:54.476441+00'),
	('d5c876cb-3531-46eb-8029-59276601a0bc', '8f064123-124f-480c-a6a0-e7ff6e444a11', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:28:54.476441+00'),
	('9c462470-6f2c-4e63-b822-233cf700ae10', '8f064123-124f-480c-a6a0-e7ff6e444a11', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:28:54.476441+00'),
	('33c5e4c2-aeb4-4fec-accb-2e7c99777bc8', '8f064123-124f-480c-a6a0-e7ff6e444a11', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:28:54.476441+00'),
	('0c50c645-d699-4c2b-b618-3859569d67de', '8f064123-124f-480c-a6a0-e7ff6e444a11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:28:54.476441+00'),
	('52b733a8-ff92-4b18-80b6-8fead111061f', '8f064123-124f-480c-a6a0-e7ff6e444a11', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:28:54.476441+00'),
	('9a2c6c00-a3b9-4366-83bc-783ea4cd487e', '8f064123-124f-480c-a6a0-e7ff6e444a11', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:28:54.476441+00'),
	('d6f64b7c-f1dc-460d-87f6-635bce6b2a13', '8f064123-124f-480c-a6a0-e7ff6e444a11', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:28:54.476441+00'),
	('1224741f-66ec-4e9f-9deb-ced14e7e4e2c', '8f064123-124f-480c-a6a0-e7ff6e444a11', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:28:54.476441+00'),
	('4671dfc0-69ff-40a2-b31f-5b54550a93ea', '8f064123-124f-480c-a6a0-e7ff6e444a11', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:28:54.476441+00'),
	('f9f1f5b9-24a6-4477-b31b-5c59727219e1', '8f064123-124f-480c-a6a0-e7ff6e444a11', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:28:54.476441+00'),
	('592e5993-f336-4ec3-902f-a58575c4f3b8', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:33:14.898113+00'),
	('d94be4f3-44a0-4df0-8b87-3cae892e6b2e', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:33:14.898113+00'),
	('3b418925-bce0-4f24-b532-ab1199c80042', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:33:14.898113+00'),
	('7ba88b12-1224-46ad-afcd-bb239737c21b', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:33:14.898113+00'),
	('b83a1d49-5ff8-4d88-92ad-9a3b262c05ff', '872b4410-48c3-4c1c-80f0-20c1331d7d08', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:33:14.898113+00'),
	('e17adc18-2e70-4b7d-b1f5-b36b84ccc583', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:33:14.898113+00'),
	('78a5322a-97b5-490a-bfa6-9802b6433491', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:33:14.898113+00'),
	('997d0eea-6ed7-4ad3-a977-fa3d5bd7292b', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:33:14.898113+00'),
	('0051bd76-7497-4ac7-843a-e5096309f501', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:33:14.898113+00'),
	('e99654d3-1fb8-496c-8eee-600129f92442', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:33:14.898113+00'),
	('7a2ea3e6-5ffb-43ec-8008-e6dc2861588b', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:33:14.898113+00'),
	('2c04f66a-c25d-4c29-a3ac-127a6c806a23', 'af13c852-bce7-47b9-be5b-c678406c47bd', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:39:42.069078+00'),
	('8bd866dd-c8ac-45a0-9e9e-49a2eca56a2a', 'af13c852-bce7-47b9-be5b-c678406c47bd', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:39:42.069078+00'),
	('7302e578-67cf-492c-8e12-da6faafe1554', 'af13c852-bce7-47b9-be5b-c678406c47bd', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:39:42.069078+00'),
	('f83266c4-251f-4004-a83f-a3c75094c9ab', 'af13c852-bce7-47b9-be5b-c678406c47bd', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:39:42.069078+00'),
	('14a69807-96d6-489a-ab75-78f88064fa21', 'af13c852-bce7-47b9-be5b-c678406c47bd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:39:42.069078+00'),
	('7dc7ad22-6079-44c8-ad11-66c9a2a5eb68', 'af13c852-bce7-47b9-be5b-c678406c47bd', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:39:42.069078+00'),
	('e5339977-482b-4b09-aef7-f7d0ddedc7c2', 'af13c852-bce7-47b9-be5b-c678406c47bd', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:39:42.069078+00'),
	('f056c791-1e5d-49c2-8202-10406aeafa27', 'af13c852-bce7-47b9-be5b-c678406c47bd', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:39:42.069078+00'),
	('c8157271-d6b9-410c-936b-f2a2684cb26a', 'af13c852-bce7-47b9-be5b-c678406c47bd', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:39:42.069078+00'),
	('0e40984a-b1cf-4f26-8d45-e9db8b6a2a54', 'af13c852-bce7-47b9-be5b-c678406c47bd', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:39:42.069078+00'),
	('a5bd2344-9e46-4a2a-bb19-58c39e13c5a8', 'af13c852-bce7-47b9-be5b-c678406c47bd', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:39:42.069078+00'),
	('26351299-4b87-4696-8231-e665a94b2bb2', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:44:44.480231+00'),
	('6434dd42-4b67-4ba2-a6dc-24f9a79593f5', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:44:44.480231+00'),
	('b8ac23f9-f033-47cc-bc52-6a018acf2984', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:44:44.480231+00'),
	('0b1d413b-6b30-4220-92bb-c0e34bd7c305', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:44:44.480231+00'),
	('dedacb9a-e1d9-41a0-a645-2343cfd1f217', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:44:44.480231+00'),
	('c8fd77e8-3f11-4115-b249-4b324e98172d', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:44:44.480231+00'),
	('50367f9a-09bb-4744-9552-bbd14b69ccb6', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:44:44.480231+00'),
	('4b09f653-a7f4-4bda-bb56-7a7841f6e091', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:44:44.480231+00'),
	('6d69edc5-6b33-4d2b-9d7d-d336247f1bd7', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:44:44.480231+00'),
	('386c7723-5ecc-4bc1-b0b3-13709d1a5a12', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:44:44.480231+00'),
	('e0f12544-83fa-4379-9628-3c844f2f800b', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:44:44.480231+00'),
	('487a8e0d-3ae7-4983-af45-8c54987e52ef', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:49:39.54346+00'),
	('e58a0a93-88c2-4af6-aede-97495c9c4f10', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:49:39.54346+00'),
	('2456145a-10e0-440e-b8f2-b3584bea7811', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:49:39.54346+00'),
	('506586db-74da-46b6-94ea-d056cf6adecd', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:49:39.54346+00'),
	('93a79c8d-accb-48ff-ab22-1983386a280f', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:49:39.54346+00'),
	('0161a074-b8c1-41ac-98cd-36f92fa791b1', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:49:39.54346+00'),
	('43d3209d-5820-4d30-9682-fe5b13541650', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:49:39.54346+00'),
	('593e6fe5-a3e7-4104-ae84-5382311ce8aa', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:49:39.54346+00'),
	('1c00028d-ec17-42f8-a0be-47fcfd6f5d04', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:49:39.54346+00'),
	('fe665970-a857-44b2-b331-80503097cd2d', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:49:39.54346+00'),
	('da6c0a44-8a15-4e40-97a4-2252e93ed6a1', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:49:39.54346+00'),
	('5c4b8088-259b-45d0-97ba-098b80f8933f', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '22222222-2222-2222-2222-222222222222', '2026-01-16 13:56:16.53209+00'),
	('8c43f87e-3775-4b7d-a981-86c0ec4ba1f3', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '99999999-9999-9999-9999-999999999999', '2026-01-16 13:56:16.53209+00'),
	('6d9e196f-93a1-4dbe-a913-1541ade7af46', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '55555555-5555-5555-5555-555555555555', '2026-01-16 13:56:16.53209+00'),
	('3faf897a-d609-4c86-82e5-2d2716692dd8', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '44444444-4444-4444-4444-444444444444', '2026-01-16 13:56:16.53209+00'),
	('6339a47e-f622-4ed7-9e43-a57c0c897081', '39a8f7a9-6793-4611-a570-a6122bfb3c66', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-01-16 13:56:16.53209+00'),
	('50ef097e-17f4-4263-b9f2-c952f4983951', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '77777777-7777-7777-7777-777777777777', '2026-01-16 13:56:16.53209+00'),
	('4d670ba5-8309-4e03-bccd-79b8c469558d', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '33333333-3333-3333-3333-333333333333', '2026-01-16 13:56:16.53209+00'),
	('64a81a5d-0aad-4b0f-9da5-5a0e0bcbae93', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '11111111-1111-1111-1111-111111111111', '2026-01-16 13:56:16.53209+00'),
	('85c18068-bc55-483d-a3a7-4023161e8548', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '88888888-8888-8888-8888-888888888888', '2026-01-16 13:56:16.53209+00'),
	('069d9521-3966-4b10-afc7-19a443ea6e90', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '66666666-6666-6666-6666-666666666666', '2026-01-16 13:56:16.53209+00'),
	('b0d8ff07-6330-4e11-9977-fb79431e1c15', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '15b39018-d038-4c6c-bbc0-bd4a021428c0', '2026-01-16 13:56:16.53209+00'),
	('6ec32c6d-596f-4bc4-b2f3-9d71032cd6ff', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:07:39.011502+00'),
	('c554731b-e874-46ef-8f20-a5571c6b4675', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:07:39.011502+00'),
	('edbd8b76-9c85-48b2-bf54-d2f7068d6918', 'b5947e4d-3484-42ac-9e06-180444d01817', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:09:18.742098+00'),
	('733666d6-723d-49b4-989c-d0a4ea9096e3', 'b5947e4d-3484-42ac-9e06-180444d01817', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:09:18.742098+00'),
	('40219366-25af-4f96-bcf6-dc9b3dd84816', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:10:05.418226+00'),
	('9c42840f-3da9-420f-843b-d376fa485285', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:10:05.418226+00'),
	('3214e11f-e5da-46a3-9be0-d305929e92bc', '39a8f7a9-6793-4611-a570-a6122bfb3c66', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:10:25.873815+00'),
	('f886a884-0121-4dec-b3f6-9c4877a633df', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:10:25.873815+00'),
	('a0c94434-804e-4f4b-81e1-7f0fdcccd215', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:11:09.070027+00'),
	('c53fe3e3-6349-4e28-bc35-d2a2065e85ad', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:11:09.070027+00'),
	('a464fae9-655c-4edd-b547-af610bb53994', '51651e05-085f-4cd9-8948-e694ec51d18b', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-19 17:11:46.265823+00'),
	('efa89f01-3491-48aa-8dab-df5f55123d5b', '51651e05-085f-4cd9-8948-e694ec51d18b', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:11:46.265823+00'),
	('b483fbcc-ce44-4ae8-a419-e4399efaaaca', '39a8f7a9-6793-4611-a570-a6122bfb3c66', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:09:13.00678+00'),
	('99701c7d-04ec-4f88-aa41-86f03abec869', '39a8f7a9-6793-4611-a570-a6122bfb3c66', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:09:13.00678+00'),
	('f4d1f561-cef2-4315-9cd1-42ec9c3a108e', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:10:29.624121+00'),
	('75244e67-1e80-4d37-9a11-e3f089e471cf', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:10:29.624121+00'),
	('35acb56f-fa65-416f-9427-49dd65614bb8', 'b5947e4d-3484-42ac-9e06-180444d01817', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:10:49.4457+00'),
	('f4061fb2-9925-4b64-91f8-e89ccd46bfbe', 'b5947e4d-3484-42ac-9e06-180444d01817', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:10:49.4457+00'),
	('514b85a4-88f4-4fa0-88ae-98cb90f661f9', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:11:23.289363+00'),
	('3c1a1a12-5e70-4278-be04-5ee926955613', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:11:23.289363+00'),
	('9492a951-ce61-4de2-8771-b4ff8e9d05fc', '51651e05-085f-4cd9-8948-e694ec51d18b', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:11:57.517208+00'),
	('7dcd8bc5-db98-4423-b455-dff83a8e7335', '51651e05-085f-4cd9-8948-e694ec51d18b', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:11:57.517208+00'),
	('619a59b6-2386-47ab-b218-8510c8dd6ddd', 'e702eefc-caec-4e41-b072-93d919da0553', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:12:21.622894+00'),
	('ef8cf706-fac5-4257-a931-6961c800787c', 'e702eefc-caec-4e41-b072-93d919da0553', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:12:21.622894+00'),
	('b3aaee32-9a02-41c0-baec-268a8a6652f0', 'e702eefc-caec-4e41-b072-93d919da0553', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:12:21.622894+00'),
	('0f47008d-ea6f-4f8a-aa29-24d94e6e6159', 'e702eefc-caec-4e41-b072-93d919da0553', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:12:21.622894+00'),
	('fb59e97b-46a5-4bdb-9267-16f7a1f95a7f', '8f064123-124f-480c-a6a0-e7ff6e444a11', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:13:14.497083+00'),
	('b51cbacc-1aa7-4b9a-bd29-7a3ace94cb15', '8f064123-124f-480c-a6a0-e7ff6e444a11', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:13:14.497083+00'),
	('f3ab2c1f-5a40-422a-aa3f-9686f9d44fb9', '8f064123-124f-480c-a6a0-e7ff6e444a11', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:13:14.497083+00'),
	('b1fdbdd7-c1c1-4405-b723-07e27757e936', '8f064123-124f-480c-a6a0-e7ff6e444a11', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:13:14.497083+00'),
	('0f5d1e30-31b9-4872-9464-211bd5cb72d5', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:13:39.106994+00'),
	('52ef9e32-46a1-424f-a69b-80ca7e85723b', 'd1011cb7-2239-4a5f-972f-870b7ed25311', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:13:39.106994+00'),
	('933136e4-314d-483b-b98f-e302b95d5a1c', 'd1011cb7-2239-4a5f-972f-870b7ed25311', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:13:39.106994+00'),
	('640aae65-f5d3-4ce9-8d24-0c057784bca5', 'd1011cb7-2239-4a5f-972f-870b7ed25311', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:13:39.106994+00'),
	('56a2f16e-1938-480b-a103-e4af1191b824', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:15:31.746789+00'),
	('2a951368-7830-4f03-94fd-1357d5de30a1', '872b4410-48c3-4c1c-80f0-20c1331d7d08', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:15:31.746789+00'),
	('79c5ca86-ab32-4a10-bac3-c001fe547c0a', '872b4410-48c3-4c1c-80f0-20c1331d7d08', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:15:31.746789+00'),
	('a7b7aaa8-f888-4417-bde3-6e59716c2fce', '872b4410-48c3-4c1c-80f0-20c1331d7d08', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:15:31.746789+00'),
	('e4b22c31-7789-44e0-a14b-c16dc5de48e2', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:16:02.298721+00'),
	('c22a58f2-78a8-41e2-b726-c8eb3fdc82a7', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:16:02.298721+00'),
	('a2f67801-abb7-4a45-88cf-b77438d8a659', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:16:02.298721+00'),
	('1ab76afd-59bd-474a-aedf-011fa85aee54', 'a5ba7893-eaa3-450f-9c98-f30d5c705926', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:16:02.298721+00'),
	('7199de54-b2a0-4106-9736-a8c02035c262', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:16:32.659597+00'),
	('5cfc5c27-4d85-40fc-b209-d146abf757f5', '656d02f9-acd3-400c-a2a9-0dc0ebd0d109', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:16:32.659597+00'),
	('3532aa96-ded2-4f3a-be69-3fe59510d88c', '349d69e3-face-476f-b1de-3fbf00a875f3', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:17:01.123207+00'),
	('cd7ead8a-db0a-40a3-901d-9d971fcf12c5', '349d69e3-face-476f-b1de-3fbf00a875f3', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:17:01.123207+00'),
	('15163997-5998-4e52-9706-8f3cb72da396', '349d69e3-face-476f-b1de-3fbf00a875f3', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:17:01.123207+00'),
	('157d3eb4-82ef-45be-8cfc-15185b0b2393', '349d69e3-face-476f-b1de-3fbf00a875f3', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:17:01.123207+00'),
	('ff30019b-dd0d-4adb-8df2-158122007471', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:17:22.122609+00'),
	('f053a178-9cb0-40ab-ac90-a77b0ad24884', '18d75a6d-8ea8-468a-8c3a-e00eab408578', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:17:22.122609+00'),
	('7a3b23d5-b9f1-48bf-96cc-91182d5ea216', '18d75a6d-8ea8-468a-8c3a-e00eab408578', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:17:22.122609+00'),
	('1ce8db31-e6e1-4a01-9321-9bc04d813cbc', '18d75a6d-8ea8-468a-8c3a-e00eab408578', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:17:22.122609+00'),
	('188080a0-87a9-4577-9f32-1cbdb909456b', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:17:45.857013+00'),
	('86dc5d19-667e-4fdc-9ec5-008c58a53fd8', '19e58e53-5245-407b-b7f5-d63872b3f2d8', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:17:45.857013+00'),
	('f3e4f819-f063-481c-8a54-2d88732c3427', '19e58e53-5245-407b-b7f5-d63872b3f2d8', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:17:45.857013+00'),
	('9a69823d-f5b1-41c8-bf86-7fe407b5bfcd', '19e58e53-5245-407b-b7f5-d63872b3f2d8', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:17:45.857013+00');


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bank_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bank_transactions" ("id", "transaction_date", "reference", "amount", "description", "matched_payment_id", "created_at") VALUES
	('dd8ed86a-8954-48e8-aa9f-52d53eb77380', '2026-09-25', 'TT20260925-999', 2800.00, 'Payment received', NULL, '2026-01-12 18:54:53.015663+00'),
	('05a38ac2-0ebc-420d-b609-f0c808866254', '2026-09-27', 'TT20260927-123', 3500.00, 'Term fees', NULL, '2026-01-12 18:54:53.015663+00'),
	('881a3de2-9fbb-4757-9f10-532680da4729', '2026-09-15', 'TT20260915-001', 3500.00, 'Transfer from P. Williams', NULL, '2026-01-12 18:54:53.015663+00'),
	('28b693d8-7607-423b-8d0f-d104fd88cd18', '2026-09-18', 'TT20260918-002', 3500.00, 'Transfer from F. Mohammed', NULL, '2026-01-12 18:54:53.015663+00'),
	('1af5d6fb-5af1-4306-bf9b-d6a89922abef', '2026-09-20', 'WP20260920-1234', 3500.00, 'WiPay Payment', NULL, '2026-01-12 18:54:53.015663+00'),
	('8efee7d3-ab5c-45c4-87c3-c167bcf368ec', '2026-09-22', 'TT20260922-004', 3500.00, 'School fees payment', NULL, '2026-01-12 18:54:53.015663+00'),
	('ee4bf30f-1467-4262-9e11-99b0a0f27788', '2026-10-10', 'TT20261010-ART', 250.00, 'Art club payment', NULL, '2026-01-12 18:54:53.015663+00'),
	('123ce434-91f6-40fc-8d40-c7f4d10e92b3', '2026-10-12', 'WP20261012-5678', 250.00, 'WiPay Payment', NULL, '2026-01-12 18:54:53.015663+00');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shopping_cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shopping_cart_items" ("id", "guardian_id", "payment_item_id", "student_id", "created_at") VALUES
	('eb4883dc-5038-49f5-b228-a6e5e4d02bab', 'a2222222-2222-2222-2222-222222222222', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '22222222-2222-2222-2222-222222222222', '2026-01-20 11:42:18.750519+00'),
	('f936abb5-008c-4fa4-9e02-cdb847fcdfb0', 'a2222222-2222-2222-2222-222222222222', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '22222222-2222-2222-2222-222222222222', '2026-01-20 11:42:18.750519+00'),
	('519ea332-b2c7-4ae4-b66f-548098cb8114', '50f1552f-2721-4239-be85-ef24e9d10ffd', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:18:46.619059+00'),
	('a8a0dcdc-2b26-4c62-9b34-32f3ff8ea620', '50f1552f-2721-4239-be85-ef24e9d10ffd', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '2026-01-20 12:18:46.619059+00'),
	('c8b5b282-3141-4db5-a1fd-ec22bf2c59e3', '50f1552f-2721-4239-be85-ef24e9d10ffd', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:18:46.619059+00'),
	('0297ce29-7384-43d8-bcb4-207979d5ef5f', '50f1552f-2721-4239-be85-ef24e9d10ffd', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '2026-01-20 12:18:46.619059+00'),
	('ea273ed3-fb16-4099-a18e-ed5308a7ba4d', 'c47646ff-42c1-4beb-b0da-d52665b4c036', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:41:25.734978+00'),
	('a82e7f31-f2bf-454a-8614-0c26401e7a0c', 'c47646ff-42c1-4beb-b0da-d52665b4c036', '65ac5f82-f9bb-45a5-ab8a-d099c74f0f4b', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:41:25.734978+00'),
	('95b3e8a8-4b83-484d-80de-5e40cc29b75f', 'c47646ff-42c1-4beb-b0da-d52665b4c036', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-20 12:41:25.734978+00'),
	('552a83ae-f8fb-425b-ac81-ce5d33ee1bc7', 'c47646ff-42c1-4beb-b0da-d52665b4c036', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', 'ad667a08-a515-4972-b381-e619756a13f2', '2026-01-20 12:41:25.734978+00'),
	('de771986-ab2e-4430-91cc-683f9494aabc', 'a2222222-2222-2222-2222-222222222222', 'e702eefc-caec-4e41-b072-93d919da0553', '22222222-2222-2222-2222-222222222222', '2026-01-27 09:49:48.239962+00'),
	('194ad0df-449a-4f8f-8c5b-b2c9c1a29c7a', 'a4444444-4444-4444-4444-444444444442', '71dc5ac5-05b6-4809-b8fe-e1149b867cbd', '877f6a43-503e-4938-b954-291ee3eadca4', '2026-01-19 17:30:37.7158+00');


--
-- Data for Name: student_guardians; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."student_guardians" ("id", "student_id", "guardian_id", "relationship", "is_primary", "created_at") VALUES
	('0b144b19-06da-4ea6-8d3b-cf18897ca63d', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('d3494400-b5b7-40ca-ba2e-2395eeed62bf', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111112', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('0833685f-087f-410c-9aaf-d7eef20795b6', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222221', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('0b366090-eece-43d2-8edb-1f3b1ed1b264', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('3bdd207f-b914-4160-bfc5-d2754ada0e31', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333331', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('778d53a0-c094-4420-9b40-66e42a0d5050', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333332', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('f13eacc3-a6d0-45d7-9d9d-72993b75edf8', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444441', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('8058cb60-f8a3-4e8d-8a9b-59fb5aecf37d', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444442', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('cab89705-7693-469c-a481-6f90374a8175', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555551', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('b1d15998-7989-402d-8d1d-0c8980cff4f0', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666661', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('eda0a0e0-fcb5-43fc-b342-7dd6d6eb76db', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666662', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('a15737d1-edad-4725-9774-21536a6bf180', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777771', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('9019857a-b292-43b9-92c6-ac38f7f81955', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777772', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('6cec43db-4b93-4374-b322-e74079182563', '88888888-8888-8888-8888-888888888888', 'a8888888-8888-8888-8888-888888888881', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('27b291cf-7c24-465f-8745-ff0623f558ab', '99999999-9999-9999-9999-999999999999', 'a9999999-9999-9999-9999-999999999991', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('79bca77b-4640-4629-a61b-c9ccc67ddc61', '99999999-9999-9999-9999-999999999999', 'a9999999-9999-9999-9999-999999999992', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('142a76d0-db6b-456e-824d-c261eb0096a3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 'Mother', true, '2026-01-12 18:54:20.627858+00'),
	('d014c9ef-f6d1-46d5-a401-0939ee54fae0', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 'Father', false, '2026-01-12 18:54:20.627858+00'),
	('27b42dd5-9f7c-4290-973e-e96a213a55e7', 'ad667a08-a515-4972-b381-e619756a13f2', 'c47646ff-42c1-4beb-b0da-d52665b4c036', 'Parent', true, '2026-01-19 17:05:54.517422+00'),
	('fa98897e-e2a0-4446-9840-b0311f199f58', '877f6a43-503e-4938-b954-291ee3eadca4', 'c47646ff-42c1-4beb-b0da-d52665b4c036', 'Parent', true, '2026-01-19 17:07:00.587704+00'),
	('fb23e6b2-2e38-4fbd-b000-cc5256b444d6', 'c85372dc-a7af-4b39-9a21-23c7d11f1351', '50f1552f-2721-4239-be85-ef24e9d10ffd', 'Mother', true, '2026-01-20 02:23:39.452963+00'),
	('d3d53841-0b20-4167-8aba-23df104876fa', '5b063091-4d62-49d7-9a0f-1f6e6e06b5d0', '50f1552f-2721-4239-be85-ef24e9d10ffd', 'Mother', true, '2026-01-20 02:24:55.885353+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('payment-item-files', 'payment-item-files', NULL, '2026-01-13 16:27:57.11195+00', '2026-01-13 16:27:57.11195+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('payment-item-icons', 'payment-item-icons', NULL, '2026-01-15 00:11:45.184749+00', '2026-01-15 00:11:45.184749+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('42216e23-ce28-4fda-9d7e-f42abca3cadb', 'payment-item-files', '1768323818634-5v8pk.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 17:03:39.30994+00', '2026-01-13 17:03:39.30994+00', '2026-01-13 17:03:39.30994+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:03:40.000Z", "contentLength": 230963, "httpStatusCode": 200}', '7ff44f79-7f1a-4406-9982-ee9f792782ee', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('86d9e3d0-23aa-4336-905d-bdd1dbcadc78', 'payment-item-files', '1768324228534-t6ij3i.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 17:10:29.768264+00', '2026-01-13 17:10:29.768264+00', '2026-01-13 17:10:29.768264+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:10:30.000Z", "contentLength": 230963, "httpStatusCode": 200}', '711c5f43-6211-4ee7-a8bb-8beb577a4f3e', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('6196bb44-9a38-4c3f-be05-375c0a93f178', 'payment-item-files', '1768325282358-gpjxc.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 17:28:04.280737+00', '2026-01-13 17:28:04.280737+00', '2026-01-13 17:28:04.280737+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:28:05.000Z", "contentLength": 230963, "httpStatusCode": 200}', 'f52cd800-b268-48a5-bed6-cc597e7a7aea', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('0b6d9066-ab1f-4b56-ba93-e499f8d33b94', 'payment-item-files', '1768325284119-q017.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 17:28:04.651039+00', '2026-01-13 17:28:04.651039+00', '2026-01-13 17:28:04.651039+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:28:05.000Z", "contentLength": 230963, "httpStatusCode": 200}', '86c67104-7a6b-4c5a-ae32-d7a57efddf3e', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('61f46651-cb18-4528-ab30-bc53d5f7c63e', 'payment-item-files', '1768328983346-3g8n5.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 18:29:44.637074+00', '2026-01-13 18:29:44.637074+00', '2026-01-13 18:29:44.637074+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T18:29:45.000Z", "contentLength": 230963, "httpStatusCode": 200}', '166c53bd-b490-4442-9433-1bb179b94995', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('c4718bb5-1540-4b72-94dc-58918568017f', 'payment-item-files', '1768330021522-6inaybi.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-13 18:47:02.746588+00', '2026-01-13 18:47:02.746588+00', '2026-01-13 18:47:02.746588+00', '{"eTag": "\"f3a7c24dc5a6478408d8e55553b207d1\"", "size": 230963, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T18:47:03.000Z", "contentLength": 230963, "httpStatusCode": 200}', '666b14c0-1986-4b86-ad59-e747a8b1bb78', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('03d97a0b-cddd-4767-b027-bec5098970fa', 'payment-item-icons', '1768444132787-gezpi.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-15 02:28:53.398953+00', '2026-01-15 02:28:53.398953+00', '2026-01-15 02:28:53.398953+00', '{"eTag": "\"ac8917e302b1058177347c4fa4ab2f8d\"", "size": 33121, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-15T02:28:54.000Z", "contentLength": 33121, "httpStatusCode": 200}', 'e9f23d34-d69a-4691-a67d-c77eb17c76a9', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('f33be65a-2001-461b-a8b3-45eec2306e34', 'payment-item-icons', '1768509431387-eg0x1w.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-15 20:37:11.994038+00', '2026-01-15 20:37:11.994038+00', '2026-01-15 20:37:11.994038+00', '{"eTag": "\"ac8917e302b1058177347c4fa4ab2f8d\"", "size": 33121, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-15T20:37:12.000Z", "contentLength": 33121, "httpStatusCode": 200}', '213b32bc-f146-4733-acc9-67b49fb543f3', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('2fa099c8-b69f-4136-8723-a64cea30b4eb', 'payment-item-icons', '1768509727040-oi87eq.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-15 20:42:08.176969+00', '2026-01-15 20:42:08.176969+00', '2026-01-15 20:42:08.176969+00', '{"eTag": "\"ac8917e302b1058177347c4fa4ab2f8d\"", "size": 33121, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-15T20:42:09.000Z", "contentLength": 33121, "httpStatusCode": 200}', '67f35eb5-5a63-4acd-8729-522797c0fa82', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('e093ad0b-7355-4bfa-a1c1-56ac211aa106', 'payment-item-icons', '1768570780725-jym81g.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:39:41.375496+00', '2026-01-16 13:39:41.375496+00', '2026-01-16 13:39:41.375496+00', '{"eTag": "\"04e9d27225c6598c3266eed3d1427f27\"", "size": 36223, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:39:42.000Z", "contentLength": 36223, "httpStatusCode": 200}', '60a70c9e-f1c7-4593-9ebc-f63c53f840f3', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('395d37e9-505b-459b-aea3-59806a2055cc', 'payment-item-icons', '1768571079876-y6fsju.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:44:40.950445+00', '2026-01-16 13:44:40.950445+00', '2026-01-16 13:44:40.950445+00', '{"eTag": "\"c1bb7456fd570f5f1a08f0a8c4781f33\"", "size": 50059, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:44:41.000Z", "contentLength": 50059, "httpStatusCode": 200}', '6a585740-1d14-4bc4-9ceb-c6e45c080cdf', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('cfb0d85a-74c0-4541-a46c-ea53bfe95194', 'payment-item-icons', '1768571083543-jaaq1.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:44:43.862483+00', '2026-01-16 13:44:43.862483+00', '2026-01-16 13:44:43.862483+00', '{"eTag": "\"c1bb7456fd570f5f1a08f0a8c4781f33\"", "size": 50059, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:44:44.000Z", "contentLength": 50059, "httpStatusCode": 200}', '27a9aa44-1c8b-4432-acc5-4e72adb019af', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('0ae82d77-746a-4bfd-9d2d-9014a45ae65b', 'payment-item-icons', '1768571377984-sp9wfm.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:49:39.055167+00', '2026-01-16 13:49:39.055167+00', '2026-01-16 13:49:39.055167+00', '{"eTag": "\"e97d6fbd1cc9dba054ce12873ad3e11f\"", "size": 109495, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:49:40.000Z", "contentLength": 109495, "httpStatusCode": 200}', '31aa6078-27af-4ccb-983f-c132abb66792', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('3921d65d-dfa8-491a-ad52-53a09341bb01', 'payment-item-icons', '1768540631572-he3e08.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 05:17:12.423618+00', '2026-01-16 05:17:12.423618+00', '2026-01-16 05:17:12.423618+00', '{"eTag": "\"96497157f7e0d7f3ac214c34577134a1\"", "size": 51940, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T05:17:13.000Z", "contentLength": 51940, "httpStatusCode": 200}', '1bbfbaff-ae3c-4368-8946-f040052ab9c7', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('f9aad8af-0e7d-4bd2-8945-f43b5760e367', 'payment-item-icons', '1768566229302-v8sieb.avif', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 12:23:50.037555+00', '2026-01-16 12:23:50.037555+00', '2026-01-16 12:23:50.037555+00', '{"eTag": "\"d7cfb0913f4e8294a508fa3c4e948363\"", "size": 14997, "mimetype": "image/avif", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T12:23:50.000Z", "contentLength": 14997, "httpStatusCode": 200}', 'b408f292-ee6c-4e0d-8775-6ac396052a4a', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('2c2bebef-6d7f-41cc-a43d-b1997f17e3e0', 'payment-item-icons', '1768567763570-rvz5l8.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 12:49:24.420775+00', '2026-01-16 12:49:24.420775+00', '2026-01-16 12:49:24.420775+00', '{"eTag": "\"e97d6fbd1cc9dba054ce12873ad3e11f\"", "size": 109495, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T12:49:25.000Z", "contentLength": 109495, "httpStatusCode": 200}', '616a6ad8-d6fc-4966-a382-ba0047cd8636', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('491b7d84-0744-4121-a12b-72028db74fec', 'payment-item-icons', '1768568005392-mdokp.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 12:53:26.65946+00', '2026-01-16 12:53:26.65946+00', '2026-01-16 12:53:26.65946+00', '{"eTag": "\"96497157f7e0d7f3ac214c34577134a1\"", "size": 51940, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T12:53:27.000Z", "contentLength": 51940, "httpStatusCode": 200}', 'f64df922-e9a7-49f8-b23b-3df4d0113892', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('88f20e3c-1767-47f9-bdb4-0011277b5b8d', 'payment-item-icons', '1768568797148-zx6q5p.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:06:38.161715+00', '2026-01-16 13:06:38.161715+00', '2026-01-16 13:06:38.161715+00', '{"eTag": "\"4af0f9530f81366644cf9cfedd9fdab7\"", "size": 30708, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:06:39.000Z", "contentLength": 30708, "httpStatusCode": 200}', '90fb9889-8739-43d6-8ce5-8d2dd9542b07', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('b1cbe6ac-591a-4804-9c80-b8dddd555023', 'payment-item-icons', '1768569095721-5jkqq7.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:11:36.503624+00', '2026-01-16 13:11:36.503624+00', '2026-01-16 13:11:36.503624+00', '{"eTag": "\"17e09e16ab3da14d2b2388d148f26780\"", "size": 27119, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:11:37.000Z", "contentLength": 27119, "httpStatusCode": 200}', '0e3724a9-0118-4187-83fc-5210872e789d', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('c2b7bbcc-1582-4a7d-a8ae-6dca7d7b3cef', 'payment-item-icons', '1768569214410-7q6y6.webp', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:13:35.276304+00', '2026-01-16 13:13:35.276304+00', '2026-01-16 13:13:35.276304+00', '{"eTag": "\"340b4ce8c4163993cfc78007c706bed8\"", "size": 50736, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:13:36.000Z", "contentLength": 50736, "httpStatusCode": 200}', '16894a2a-d09e-4f33-9243-b0da3f44e4b7', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('5cc5e427-3977-4ba5-ae8e-117c7d79dfe8', 'payment-item-icons', '1768569294870-wvxv7a.webp', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:14:55.591692+00', '2026-01-16 13:14:55.591692+00', '2026-01-16 13:14:55.591692+00', '{"eTag": "\"cbd2a6b5881b4e2c2158bc9e7d09ff11\"", "size": 29282, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:14:56.000Z", "contentLength": 29282, "httpStatusCode": 200}', 'b54c8fde-9b74-41a7-9aae-525c28841fe9', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('e225684b-8846-4fd4-bf29-c7ad83719dfa', 'payment-item-icons', '1768569446565-epo3up.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:17:27.003902+00', '2026-01-16 13:17:27.003902+00', '2026-01-16 13:17:27.003902+00', '{"eTag": "\"b93a6a41a41189af288d8b16a4019155\"", "size": 22967, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:17:27.000Z", "contentLength": 22967, "httpStatusCode": 200}', 'b3b597a4-5cb6-41fd-b15a-5c97c1c8a611', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('5c61d0df-9b8d-4740-9edd-813697243abe', 'payment-item-icons', '1768569927695-rrduto.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:25:28.730378+00', '2026-01-16 13:25:28.730378+00', '2026-01-16 13:25:28.730378+00', '{"eTag": "\"bf86e343e8c715a8297b7954273961a2\"", "size": 27028, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:25:29.000Z", "contentLength": 27028, "httpStatusCode": 200}', '033bc364-262f-4303-9bc1-8f465c0db8db', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('68a4f5ef-692c-42fd-a703-1e736105e652', 'payment-item-icons', '1768570133118-m00nlt.png', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:28:53.97938+00', '2026-01-16 13:28:53.97938+00', '2026-01-16 13:28:53.97938+00', '{"eTag": "\"37060a18c246f854f3cd39a1ed5f58d4\"", "size": 43257, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:28:54.000Z", "contentLength": 43257, "httpStatusCode": 200}', 'd0b16b4f-caf5-4c6d-b886-10bf41349aac', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('6dbb18f8-5070-428e-b28e-1a849e90ec7c', 'payment-item-icons', '1768570262899-rp6zb.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:31:03.704949+00', '2026-01-16 13:31:03.704949+00', '2026-01-16 13:31:03.704949+00', '{"eTag": "\"afea3105e2749e9149d61bf402181c64\"", "size": 12286, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:31:04.000Z", "contentLength": 12286, "httpStatusCode": 200}', '457a7fe7-e013-4470-8831-c36e8729af41', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('d33cf3de-a01c-4e89-ab63-dbd153f698dd', 'payment-item-icons', '1768570393190-nap1g.png', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:33:14.273476+00', '2026-01-16 13:33:14.273476+00', '2026-01-16 13:33:14.273476+00', '{"eTag": "\"7fd02448972e33953fc6d1db23735154\"", "size": 102317, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:33:15.000Z", "contentLength": 102317, "httpStatusCode": 200}', '519fd853-e578-40e5-9499-da719f75385c', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('93bfdd47-48ed-4be1-b0fa-33ac9301feb1', 'payment-item-icons', '1768570777290-7sktxq.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:39:38.176976+00', '2026-01-16 13:39:38.176976+00', '2026-01-16 13:39:38.176976+00', '{"eTag": "\"04e9d27225c6598c3266eed3d1427f27\"", "size": 36223, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:39:39.000Z", "contentLength": 36223, "httpStatusCode": 200}', '57472ae0-a408-46c5-935a-15fb3c0e1da4', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}'),
	('4226d169-229b-4875-b1e5-5726173cdf97', 'payment-item-icons', '1768571774687-ykp4nk.jpg', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '2026-01-16 13:56:15.761398+00', '2026-01-16 13:56:15.761398+00', '2026-01-16 13:56:15.761398+00', '{"eTag": "\"c8f6dc7dfb72a2146f7d03701a81aa05\"", "size": 40854, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-01-16T13:56:16.000Z", "contentLength": 40854, "httpStatusCode": 200}', 'eac37975-5dd1-4c70-ba59-546e01a38cb9', '7ccabb5c-fc21-414f-8591-605c889b6a6b', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 380, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict BfyFgMBfxlgdmgDSKn06edOviMydBCmiMEswTzXI5DVVs0MGXfEufUOejcxR0yc

RESET ALL;
