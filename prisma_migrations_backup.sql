--
-- PostgreSQL database dump
--

\restrict iNlNdI8JbykHhDOmmQnmEkGYoIoDQEE17bhkgvOhjdhaX2vm4rZGVDZ28FcCmFg

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c76a24c1-44ae-42e7-97d6-c75890f7f2fb	536594554298fef827ee538d30a61a09c770443f9d5834dfeca55db2818289b1	2026-08-13 08:23:05.24388+00	20260811061227_add_notifications	\N	\N	2026-08-13 08:23:05.222726+00	1
168f49b6-119a-48bc-9794-583c8313a8d2	e0cdac00296f30ba42c27b984ad71e5deca05444b2dd64ea36ee9a81fb5336e7	2026-08-13 08:23:04.819531+00	20260730142614_user	\N	\N	2026-08-13 08:23:04.786394+00	1
f460299e-91ba-45d4-b958-5141bfc6802d	d2f49d8c431c6d7920342be79356acd3b01d45f3ef86056de2b833e38f508786	2026-08-13 08:23:04.888184+00	20260802051030_add_session_model	\N	\N	2026-08-13 08:23:04.821043+00	1
4b4c499a-2f1e-426d-ba8c-26db09fe8dd6	f798683f0bae955936231d71133635ad87364df58188358bbb0c328238153530	2026-08-13 08:23:04.894878+00	20260803070118_session	\N	\N	2026-08-13 08:23:04.889499+00	1
6eed8e7e-6025-484f-8b38-af07aedcfeae	830e07afe6decb258be34df59fba6359b308509954a942c6a62d594e51eaedb6	2026-08-13 08:23:05.251449+00	20260811084105_add_email_notification_preference	\N	\N	2026-08-13 08:23:05.245738+00	1
387d1a0e-703b-44b8-b133-dbb963e5c157	9c758709229a8ea255a252e24ca84e858d96391dc62389cae9955c3f89188126	2026-08-13 08:23:04.93082+00	20260804051140_server	\N	\N	2026-08-13 08:23:04.896788+00	1
2759c58d-ac4c-4125-b164-e586d75005b1	48adddb37f8695203fe61b1e05ded32623e5c8869fcb06a114bdfa8d8b67f34c	2026-08-13 08:23:04.96316+00	20260804073501_server_member	\N	\N	2026-08-13 08:23:04.932047+00	1
d1372637-9e00-4407-9f2c-7b5591579345	5584e5f2ebecc5593bf7d01ffeb224dc75c43a526df441587e8b5016f9d08bb7	2026-08-13 08:23:05.00395+00	20260805065508_channel_and_category	\N	\N	2026-08-13 08:23:04.964339+00	1
f9d6c11c-64b5-4b36-8262-97e04fa97a03	73c4c725b8ded818f3796ba489c140d93a143b6743ee03278e10a2984d01c883	2026-08-13 08:23:05.270323+00	20260812023646_add_message_attachments	\N	\N	2026-08-13 08:23:05.253391+00	1
c726bb45-b7e2-4a3f-9b2a-da3f6c23bc61	2b133c8add50fd235bbe0352e065356d55fa2f32ee81d60d6e2bf23f9fa9ab3d	2026-08-13 08:23:05.009883+00	20260805083905_category	\N	\N	2026-08-13 08:23:05.00498+00	1
5e0f8232-234b-44a8-9b7e-7e95839fd5ba	9a93264e5fc7b1e6c2a31fe4308d8e37a641bd33704298370af163c5ed7383e6	2026-08-13 08:23:05.065795+00	20260806065235_role_permission	\N	\N	2026-08-13 08:23:05.010954+00	1
edd666e4-61e1-4545-8596-829265b2af49	a473974a61eb245f4b3bec87d78b77737f0c5b358d6d23e8d17eeaffbfa4694e	2026-08-16 19:20:22.661759+00	20260816192022_add_auth_verification_and_oauth	\N	\N	2026-08-16 19:20:22.580184+00	1
46cb31df-fb0a-46db-8e49-089c0cfbe84e	27a22bb9eb21ea19536a917e69ccc7ec4843b46d435ac227a7c87feb74a7a4c8	2026-08-13 08:23:05.098591+00	20260808070310_add_messages	\N	\N	2026-08-13 08:23:05.066805+00	1
7e3a4047-49aa-4c98-8e5b-f8abf01ea126	648fc6ccd7ae825d16d49a9c2dff0876a5dcf844ce0016bc48b9fa05652cde38	2026-08-13 08:23:05.275597+00	20260812041710_make_message_attachment_message_optional	\N	\N	2026-08-13 08:23:05.271359+00	1
e9d94e4e-c7d3-4e2d-991e-c2adf337f24a	996debdb9289ae213449e32741c70a6c6bb1dc50cb3def38cd26186fd0964355	2026-08-13 08:23:05.139725+00	20260808070602_add_message_search_vector	\N	\N	2026-08-13 08:23:05.099837+00	1
01d38a3b-bab1-43a9-be76-75b5bb9bb7f2	3aff736b6ba37cc7c86e19afc23e9c260f3a19679d4662b4e75f80ff06ec40d1	2026-08-13 08:23:05.16577+00	20260808071121_add_message_search_vector	\N	\N	2026-08-13 08:23:05.141801+00	1
ed84b933-0a49-4c51-ba12-e7313e8ca046	822271aa52394fade4e778e8b71692847ba1d9c600cf5f1eed7342d03ab38b98	2026-08-13 08:23:05.191899+00	20260809111215_add_reactions	\N	\N	2026-08-13 08:23:05.166849+00	1
380a8b9e-ad21-4a8d-bd28-9a81d19de3f8	2593afada4c5f54cbdb98ba780d33f380e9c2b17732167634aae2a3f11959dfe	2026-08-13 08:23:05.282856+00	20260812061227_full_text_search	\N	\N	2026-08-13 08:23:05.276729+00	1
8ebd4887-8126-48b7-9232-a942c688e8e8	1b47ebd8d974a27f810ee7cdf41cab7b6036cb089b52991123da4e5b22c2a957	2026-08-13 08:23:05.22171+00	20260811050324_add_channel_read_state	\N	\N	2026-08-13 08:23:05.193106+00	1
838e17fd-6529-42a1-80f7-32b4f4681c4b	1d73b7d13a85dd9c30485d2a2f3d0124df480c701e73def63a86e83780a13d9c	2026-08-17 11:15:17.787475+00	20260817000000_extend_oauth_provider_enum	\N	\N	2026-08-17 11:15:17.771342+00	1
7137b434-b18f-47fc-80aa-4df0c1192d3b	43bf4adaa5bd3cb62897fd2912a05fcf89c09b7c1c32298bf8626219ba201b11	2026-08-13 08:23:05.30427+00	20260812062000_full_text_search_indexes	\N	\N	2026-08-13 08:23:05.283961+00	1
8689bac2-2489-4f7c-bbc5-66b1f4794fb0	41b8aba43049e511437821dc5d1b940118452b98e1a4b2da119d93a038e58eb3	2026-08-13 08:23:05.370065+00	20260813044420_add_poll_multiple_choice	\N	\N	2026-08-13 08:23:05.305345+00	1
30116d32-5d3d-470d-a28a-dfeb66de8db6	14bbf3396d5e5c537c0e47134a4d60b61ec5bb0fe51fd68327ba5d817e9111b3	2026-08-13 13:36:43.61146+00	20260813133643_add_audit_logs	\N	\N	2026-08-13 13:36:43.572288+00	1
2d801dcd-b7d3-4aec-bdda-5c8f8b07650c	4007e2880c7a93be6fc8646a7e692eff6a80441aa3874b56caac645cf7f08f70	2026-08-14 11:35:20.145037+00	20260814000000_add_email_verified_at	\N	\N	2026-08-14 11:35:20.126611+00	1
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict iNlNdI8JbykHhDOmmQnmEkGYoIoDQEE17bhkgvOhjdhaX2vm4rZGVDZ28FcCmFg

