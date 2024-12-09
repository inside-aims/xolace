SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

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
	('00000000-0000-0000-0000-000000000000', '9081fa24-09c1-4b72-ae74-493d01c910ce', '{"action":"user_signedup","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-10-10 12:12:41.909802+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c779b5f-d355-4e8a-816f-b4d95f2ad6fb', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 01:44:15.891169+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a042e374-bb4e-4f9f-ba0d-c323449e4b8f', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 01:44:15.90936+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdc9973c-af32-4ddf-b1b7-8364039066ea', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 01:44:16.034026+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6312e7c-f6bf-4573-b2d8-1a9bd65de54f', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 01:44:16.26301+00', ''),
	('00000000-0000-0000-0000-000000000000', '94e3f6cf-0d38-429d-8c5c-499c5ed49019', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 02:42:47.096268+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a4901d1-4c0a-4f26-952a-1a23dc5724c5', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-11 02:42:48.991688+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f09c7ffa-abdd-43af-b919-c2c0243c13e6', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-18 11:03:27.015818+00', ''),
	('00000000-0000-0000-0000-000000000000', '456d1946-eefc-4434-8ad3-1dcb38cf74c3', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-18 12:10:47.750598+00', ''),
	('00000000-0000-0000-0000-000000000000', '611c1783-ac77-4bee-ae77-af0793a192aa', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-18 12:10:47.768381+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e992d60-aae9-45dc-b723-1be22d611f99', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-21 01:49:24.44402+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e79f34d-146d-4c59-86ab-2d8830a358bb', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-21 02:47:36.564927+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c2dca09-5193-4e49-8fb4-ca4678d90512', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-21 02:47:36.606999+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a06a25d4-e97f-4f4c-81b3-7d39ab3ff917', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-21 03:45:56.935753+00', ''),
	('00000000-0000-0000-0000-000000000000', '6de24b16-4a94-4473-b7ba-43a1eac42b71', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-21 03:45:56.946202+00', ''),
	('00000000-0000-0000-0000-000000000000', '61cbf372-691a-4588-b8b3-c43569e98366', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 19:56:53.115713+00', ''),
	('00000000-0000-0000-0000-000000000000', '0acc7496-9c10-47ac-a4a4-bdae99f5fff8', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 19:56:53.180599+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd651d88d-5bb5-459d-b6ff-7f5c6b073a08', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 19:56:53.587705+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f5cb2cd-8fd0-4ccb-a8da-f33b34360c9c', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 21:01:41.793124+00', ''),
	('00000000-0000-0000-0000-000000000000', '95168552-7d2a-4dc0-bc71-d290fc2b29b8', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 21:01:41.813777+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d247223-4e89-4b47-a136-af4048b19e0c', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-25 21:01:42.072975+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a609d653-efd2-4165-99eb-5ccb4c096777', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 18:42:53.746713+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f6266ec-8ac6-46fb-b568-6f8270b95f67', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 18:42:53.758861+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e51d6e91-cd35-461f-a337-cfee0af5fda2', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 18:42:53.869931+00', ''),
	('00000000-0000-0000-0000-000000000000', '40c263b6-110c-47ac-8550-ff6bfb639449', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 19:46:06.276683+00', ''),
	('00000000-0000-0000-0000-000000000000', '60ec9691-e6b9-407a-ae14-442913fcd7de', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 19:46:06.302031+00', ''),
	('00000000-0000-0000-0000-000000000000', '12d9ff7f-ad6a-4257-9702-47b85dbd5e42', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 22:31:02.586771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2e22ef0-ab3d-4981-9b59-e591fdbee010', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-26 22:31:02.600788+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f657249-39c3-4f94-9e92-ee84ee88a2d8', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-26 22:31:59.713914+00', ''),
	('00000000-0000-0000-0000-000000000000', '37bb2d30-2142-429e-9fb7-1cc71be0d59f', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-26 22:33:06.338951+00', ''),
	('00000000-0000-0000-0000-000000000000', '8afe5bb3-3e2c-441d-bf07-f27512803c84', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-26 22:42:16.25407+00', ''),
	('00000000-0000-0000-0000-000000000000', '70bd9f35-e985-4fc4-b907-0d1bee769949', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-26 22:43:20.015956+00', ''),
	('00000000-0000-0000-0000-000000000000', '449c39b9-fb19-4a00-ba42-f8546e24b3c1', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-26 22:43:26.050894+00', ''),
	('00000000-0000-0000-0000-000000000000', '23224399-54d9-4fb1-8021-352bce599bc4', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-26 22:43:42.264688+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e28ce43-3faf-4f30-ae89-a0d3a88f6f28', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-26 22:43:52.361555+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1323dea-3672-4255-8cf8-2197056a1df2', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-27 04:45:55.010987+00', ''),
	('00000000-0000-0000-0000-000000000000', '05a8565b-fc31-441a-b4ed-f865eb627cd8', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 05:43:58.693082+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b78388d3-733c-4527-aa7c-98925dfe493c', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 05:43:58.792874+00', ''),
	('00000000-0000-0000-0000-000000000000', '19b30f2f-7681-4cd5-99cb-7975cc6c6b03', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 22:20:24.257144+00', ''),
	('00000000-0000-0000-0000-000000000000', '635b3087-02b2-4019-9ada-30c4e364263d', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 22:20:24.270224+00', ''),
	('00000000-0000-0000-0000-000000000000', '5bf56b44-03e3-4dac-9b9e-76e4fe71fc3f', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 22:20:24.423328+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba63309b-a0f2-4cf2-95fc-505ef32180a7', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 23:18:43.357569+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e333ad99-38aa-47e5-8162-f7a35c9dc46b', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-27 23:18:43.367726+00', ''),
	('00000000-0000-0000-0000-000000000000', '267e1749-1ebc-4da6-ad53-5369716f977c', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-29 13:17:33.590721+00', ''),
	('00000000-0000-0000-0000-000000000000', '600c8c92-324d-4917-b416-074c7e8ac0bc', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-11-29 13:17:33.631674+00', ''),
	('00000000-0000-0000-0000-000000000000', '1455ff36-8125-42f2-96f8-caf6683cdc89', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-29 13:22:02.601674+00', ''),
	('00000000-0000-0000-0000-000000000000', '767a98fe-1351-4c22-a568-bb07c5a9c10f', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-29 21:07:07.232433+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b761a03-2884-470c-a550-2a3b4e553cfb', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-29 21:13:56.298047+00', ''),
	('00000000-0000-0000-0000-000000000000', '441829cb-1036-41b3-8fb5-2c733ae07b40', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-29 21:14:15.093282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5f7db5c-92f1-4707-b11e-e45ef49fda4d', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-29 21:16:43.028256+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ee9a3fe-5b8a-4afe-bdd9-355168b38eef', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-29 21:17:07.730757+00', ''),
	('00000000-0000-0000-0000-000000000000', '124c5b81-6112-4e5d-bb9a-f986a5adc016', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-11-29 21:28:50.988284+00', ''),
	('00000000-0000-0000-0000-000000000000', '10e635e4-72f3-4c20-929a-608507a3f974', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-05 04:27:38.267624+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5f0d16d-147e-49f6-8056-27c3c38ce3c6', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-12-05 04:38:17.215901+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f374fad-24a1-483b-9362-09d0bcb6704f', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-05 05:21:20.448602+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd4d9f3f7-f24b-4ef7-a569-e52e0f3e8140', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 06:19:39.448379+00', ''),
	('00000000-0000-0000-0000-000000000000', '52534b3d-761b-4f1b-ae83-f0ce54690d6f', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 06:19:39.464917+00', ''),
	('00000000-0000-0000-0000-000000000000', '947d818c-02a6-4888-ba43-0ee3379e9f5f', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 11:12:00.847355+00', ''),
	('00000000-0000-0000-0000-000000000000', '93e259d3-5ddf-4989-bdf0-94dd02abe127', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 11:12:00.89163+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e48aee28-c7e5-4a71-84a1-31d98dcd4951', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 12:10:27.652339+00', ''),
	('00000000-0000-0000-0000-000000000000', '1430fd8b-c626-41d3-8a93-9c13b55a028f', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 12:10:27.674184+00', ''),
	('00000000-0000-0000-0000-000000000000', '23fbcf2e-beea-4df4-a03e-d29a0584eacf', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 13:14:11.749635+00', ''),
	('00000000-0000-0000-0000-000000000000', '148740de-72db-49ee-809a-907fef84eb05', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 13:14:11.865086+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e03e491-82af-40d6-aa37-736585d4ff71', '{"action":"token_refreshed","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 21:18:27.500111+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd72160d-ca19-426f-a533-818c6ab978ad', '{"action":"token_revoked","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 21:18:27.523156+00', ''),
	('00000000-0000-0000-0000-000000000000', '26c7680b-4978-4d28-90c6-59b5abb65c44', '{"action":"logout","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-12-05 21:19:43.491868+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd82af1a7-3690-410d-8a19-859792f595a7', '{"action":"login","actor_id":"a9ab3ecf-2c82-43d0-9a91-85960f43d3c0","actor_username":"demo@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 08:43:47.890057+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', 'authenticated', 'authenticated', 'demo@gmail.com', '$2a$10$uvM.XKfg2X9gkfL5qWRIzOtHa2PlQZz7hC5je0bxYdcJWZgx098u2', '2024-10-10 12:12:41.917719+00', NULL, '', '2024-10-10 12:12:05.440135+00', '', NULL, '', '', NULL, '2024-12-07 08:43:47.928631+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-10-10 12:12:04.543913+00', '2024-12-07 08:43:47.985636+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('88e36a75-4d26-4f75-9f2f-12ff2c66ce1d', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', '2024-12-07 08:43:47.92965+00', '2024-12-07 08:43:47.92965+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '172.19.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('88e36a75-4d26-4f75-9f2f-12ff2c66ce1d', '2024-12-07 08:43:47.991635+00', '2024-12-07 08:43:47.991635+00', 'password', '297cdc15-09ca-470d-89a9-3556450c6808');


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
	('00000000-0000-0000-0000-000000000000', 32, 'y-QAc0pgHQDFJ8hCleD1Ig', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', false, '2024-12-07 08:43:47.963297+00', '2024-12-07 08:43:47.963297+00', NULL, '88e36a75-4d26-4f75-9f2f-12ff2c66ce1d');


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

INSERT INTO "public"."profiles" ("id", "created_at", "username", "supabase_user", "avatar_url", "is_anonymous") VALUES
	('ada43f4b-d555-4695-85fd-fabde447867f', '2024-10-10 12:12:04.984691+00', '@tester ', 'a9ab3ecf-2c82-43d0-9a91-85960f43d3c0', 'https://avatar.iran.liara.run/public/boy?username=@tester', false);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("id", "created_at", "created_by", "author_name", "content", "mood", "author_avatar_url", "expires_in_24hr", "duration", "expires_at") VALUES
	('f2368213-93c4-4f48-b7b2-7e232ab5c91a', '2024-10-10 16:53:43.38508+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My first Post', 'confused', NULL, false, NULL, NULL),
	('d0cd2444-4039-43ad-bc74-3a5394b9ac8a', '2024-10-10 16:54:21.912643+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My second post', 'sad', NULL, false, NULL, NULL),
	('8c8d7735-d60e-423c-937d-c80160d91fe8', '2024-10-10 16:55:45.422931+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My third post', 'happy', NULL, false, NULL, NULL),
	('c9621430-1abd-4da2-b0af-7cb69cc317e5', '2024-10-10 23:42:49.119566+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester', 'My fourth post', 'neutral', NULL, false, NULL, NULL),
	('e33fdd49-21f0-4ed4-aaf6-64364397d58d', '2024-10-11 02:39:45.179629+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'The sixth post from the post field ≡ƒÿü', 'neutral', NULL, false, NULL, NULL),
	('829a4ffc-311a-4844-9602-4c11a8d0dde7', '2024-10-11 02:44:55.95956+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'The seventh post from the post field ≡ƒÿÆ', 'neutral', NULL, false, NULL, NULL),
	('3cff3d27-552a-48b4-a620-bd89b64f84a8', '2024-11-21 01:50:57.482371+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'What''s going on with the button?', 'neutral', 'https://avatar.iran.liara.run/public/boy?username=@tester', false, NULL, NULL),
	('f8a106c3-cd63-4d5e-9d6b-718aa55a179e', '2024-11-21 01:54:13.166525+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'still not working', 'sad', 'https://avatar.iran.liara.run/public/boy?username=@tester', false, NULL, NULL),
	('dacb705a-e048-4bc3-8003-51f458c3e600', '2024-11-21 02:14:06.582996+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'Lets check out the shiny button', 'confused', 'https://avatar.iran.liara.run/public/boy?username=@tester', true, NULL, NULL),
	('2dbdeebc-dbba-4ffe-9777-e52b1068e844', '2024-11-27 05:28:21.748214+00', 'ada43f4b-d555-4695-85fd-fabde447867f', '@tester ', 'ssdsdsdsdjhsd shdgsgjsf kjdfhuaf adfudfjbdf djfhjdfbjdf djfhdjdf djfhdff dfdfdfddddddddddddfdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
fdfdff
fdfdfdfdfdfdf
fdfdfdfdfdfdf≡ƒÿädsdhd≡ƒ½ádssd', 'sad', 'https://avatar.iran.liara.run/public/boy?username=@tester', false, NULL, NULL);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."likes" ("id", "post_id", "user_id", "created_at") VALUES
	(1, 'dacb705a-e048-4bc3-8003-51f458c3e600', 'ada43f4b-d555-4695-85fd-fabde447867f', '2024-11-21 03:26:15.861561');


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 32, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."comments_id_seq"', 1, false);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."feedbacks_id_seq"', 1, false);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."likes_id_seq"', 1, false);


--
-- Name: likes_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."likes_id_seq1"', 2, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq"', 1, false);


--
-- Name: reports_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reports_id_seq1"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
