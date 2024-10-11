SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '7a932fb1-c929-4f86-a372-80ead557bddd', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"demo@gmail.com","user_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","user_phone":""}}', '2024-10-10 12:12:04.609984+00', ''),
	('00000000-0000-0000-0000-000000000000', '9081fa24-09c1-4b72-ae74-493d01c910ce', '{"action":"user_signedup","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-10-10 12:12:41.909802+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', 'authenticated', 'authenticated', 'demo@gmail.com', '$2a$10$uvM.XKfg2X9gkfL5qWRIzOtHa2PlQZz7hC5je0bxYdcJWZgx098u2', '2024-10-10 12:12:41.917719+00', NULL, '', '2024-10-10 12:12:05.440135+00', '', NULL, '', '', NULL, '2024-10-10 12:12:41.939849+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-10 12:12:04.543913+00', '2024-10-10 12:12:41.987462+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', '{"sub": "a9ab3ecf-2c82-43d0-9a91-85960f43d3c0", "email": "demo@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-10 12:12:04.593837+00', '2024-10-10 12:12:04.594135+00', '2024-10-10 12:12:04.594135+00', 'e5e6853e-ea72-4de0-b861-d73d43226266');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('6e0b315d-393a-4d6b-9a62-98fc898b9963', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', '2024-10-10 12:12:41.941009+00', '2024-10-10 12:12:41.941009+00', NULL, 'aal1', NULL, NULL, 'node', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('6e0b315d-393a-4d6b-9a62-98fc898b9963', '2024-10-10 12:12:41.99018+00', '2024-10-10 12:12:41.99018+00', 'otp', '6b21eeea-622e-4a0a-a29f-bc731e2c650e');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'V-tyKBxuc0YR9UhZUsUW5Q', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', false, '2024-10-10 12:12:41.967236+00', '2024-10-10 12:12:41.967236+00', NULL, '6e0b315d-393a-4d6b-9a62-98fc898b9963');


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
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "created_at", "username", "supabase_user", "avatar_url") VALUES
	('ada43f4b-d555-4695-85fd-fabde447867f', '2024-10-10 12:12:04.984691+00', '@tester ', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', 'https://avatar.iran.liara.run/public/boy?username=@tester');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "created_at", "created_by", "author_name", "content", "mood") VALUES
	('f2368213-93c4-4f48-b7b2-7e232ab5c91a', '2024-10-10 16:53:43.38508+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My first Post', 'confused'),
	('d0cd2444-4039-43ad-bc74-3a5394b9ac8a', '2024-10-10 16:54:21.912643+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My second post', 'sad'),
	('8c8d7735-d60e-423c-937d-c80160d91fe8', '2024-10-10 16:55:45.422931+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My third post', 'happy'),
	('c9621430-1abd-4da2-b0af-7cb69cc317e5', '2024-10-10 23:42:49.119566+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My fourth post', 'neutral');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
