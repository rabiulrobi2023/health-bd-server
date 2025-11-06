--
-- PostgreSQL database dump
--

\restrict 2waI5VjW5jkXodAS6pEO5VRpQn3K5PKKYuCZvBO7i1Cm555Or575nrubwYAYuQl

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AppointmentStauts; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStauts" AS ENUM (
    'SCHEDULED',
    'INPROGRESS',
    'COMPLETED',
    'CNACELED'
);


ALTER TYPE public."AppointmentStauts" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHERS'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PAID',
    'UNPAID'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'PATIENT',
    'DOCTOR',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED',
    'DELETED'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

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
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "contactNumber" text NOT NULL,
    address text,
    gender public."Gender" NOT NULL,
    "profilePhoto" text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id text NOT NULL,
    "paitentId" text NOT NULL,
    "doctorId" text NOT NULL,
    "scheduleId" text NOT NULL,
    "videoCallingId" text NOT NULL,
    status public."AppointmentStauts" DEFAULT 'SCHEDULED'::public."AppointmentStauts" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: doctor-schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."doctor-schedules" (
    "doctorId" text NOT NULL,
    "isBooked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "scheduleId" text NOT NULL
);


ALTER TABLE public."doctor-schedules" OWNER TO postgres;

--
-- Name: doctor-specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."doctor-specialties" (
    "doctorId" text NOT NULL,
    "specialtiesId" text NOT NULL
);


ALTER TABLE public."doctor-specialties" OWNER TO postgres;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "contactNumber" text NOT NULL,
    address text,
    gender public."Gender" NOT NULL,
    "profilePhoto" text,
    qualification text NOT NULL,
    "registrationNumber" text NOT NULL,
    experience integer DEFAULT 0 NOT NULL,
    "currentWorkingPlace" text NOT NULL,
    designation text NOT NULL,
    "appoinmentFee" integer NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    rating double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "contactNumber" text NOT NULL,
    address text,
    gender public."Gender",
    "profilePhoto" text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "appointmentId" text NOT NULL,
    "transactionId" text NOT NULL,
    amount double precision NOT NULL,
    status public."PaymentStatus" DEFAULT 'UNPAID'::public."PaymentStatus" NOT NULL,
    "paymentGatewatyData" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "appointmentId" text NOT NULL,
    "doctorId" text NOT NULL,
    instruction text,
    "followUpDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "appointmentId" text NOT NULL,
    "patientId" text NOT NULL,
    "doctorId" text NOT NULL,
    rating double precision DEFAULT 0.00 NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    "startDateTime" timestamp(3) without time zone NOT NULL,
    "endDateTime" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- Name: specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specialties (
    id text NOT NULL,
    title text NOT NULL,
    icon text
);


ALTER TABLE public.specialties OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'PATIENT'::public."UserRole" NOT NULL,
    "needPasswordChange" boolean DEFAULT true NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0eac2995-9a2e-4189-bf6e-ca66a47f4a2d	7cdfaf4225ab63c05879879aa183411d2993bed1c65d177adad9de4a0947afc4	2025-10-19 18:24:31.478068+06	20251007172529_users	\N	\N	2025-10-19 18:24:31.440913+06	1
6f040e06-97bf-4c59-8436-a0a1b56e4202	18a7c15c951a77a8208d03337cd777daedcfc91c132b5980215b03dba2f39d84	2025-10-19 18:24:31.48019+06	20251009060836_	\N	\N	2025-10-19 18:24:31.478529+06	1
db6a867c-c0bd-47f1-b077-8240cc46e004	98ba17b53cfaf663ef01b442dd5f5dec51b14f028a74ed6e0b80fbe1a25eec16	2025-10-25 21:52:15.301513+06	20251025155215_optional	\N	\N	2025-10-25 21:52:15.291846+06	1
8c05ea40-869c-4550-88c6-a65bec33254f	7a7b1fb11282984267c2088b184d499b7a573f67f5265a81ead30df04df8cef4	2025-10-19 18:24:31.485414+06	20251011004904_address_optional	\N	\N	2025-10-19 18:24:31.480918+06	1
a7bb5d1d-8e22-4f05-aaf8-f4590bd7aacf	39297d2062118921a8a07de8e143b7c305938329db56797ffc71c0ffe358df1a	2025-10-19 18:24:31.490188+06	20251011010345_address_opt	\N	\N	2025-10-19 18:24:31.486317+06	1
29c2574f-2f5a-44d4-b390-ef54644e7ac9	43c4d5745b571c99b56d9a38f04061d9e9e37a68331a536073a29cac125f35bd	\N	20251105152033_doctor_rating	\N	2025-11-05 21:41:54.385543+06	2025-11-05 21:20:33.650059+06	0
78211cbc-e6e4-47fc-9469-9c90e36259ee	373e790a007961e7983accc0e93803436fb658bac16abb917eae30e2f4535a44	2025-10-19 18:24:31.511161+06	20251014105117_schedule	\N	\N	2025-10-19 18:24:31.491205+06	1
a0b0af17-5829-4162-a934-7577817b2966	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2025-11-05 21:41:54.393207+06	20251105152033_doctor_rating		\N	2025-11-05 21:41:54.393207+06	0
cf89ffde-fce9-404a-9f15-c147394f075e	b3a3988c98195e8f59cc2358ff96047438da6c4701959bbf5558ff7e860b5bfe	2025-10-19 18:24:31.516874+06	20251017085100_schedule_model_change	\N	\N	2025-10-19 18:24:31.512227+06	1
cd43507d-d93d-4f29-a92d-da716089d6c7	c62714501e83d6071b6c6bfe070e14f215d44a276ef4a02a0cd5eff17edc5d3e	2025-10-19 18:24:31.522338+06	20251017092225_cloumn_update	\N	\N	2025-10-19 18:24:31.517804+06	1
7d0511d2-233f-49ee-b457-ac782da85c55	d7afbca47adc33cd03f11b333bb46d64dfd79919b56945053668ccff6c2fb45e	2025-10-19 18:24:31.535405+06	20251017152557_	\N	\N	2025-10-19 18:24:31.523123+06	1
cba0bbf0-e988-4fa9-94d8-9faa504f6580	fb4ace4f9e04cf2715552a077605d2c2631eb4d98178482fe561a2036f3a9fd7	2025-10-19 18:24:31.552289+06	20251019082924_specialities	\N	\N	2025-10-19 18:24:31.535904+06	1
7c7ca745-6e51-44a0-ae84-c75c2df1129e	6c92f06818e981b78be3712091aa57f664e5c46b8d3485d2483dae460bc6fd2d	2025-10-19 18:24:31.557687+06	20251019085434_icon	\N	\N	2025-10-19 18:24:31.553291+06	1
2dab299e-79cd-411e-9d01-d6e4a031189c	4ed18249571ae99d51bb0c6256aae6304c753a572de4f3442a7f059f2eb1c60d	2025-10-19 18:29:29.167584+06	20251019122929_name_change_of_a_model	\N	\N	2025-10-19 18:29:29.148679+06	1
9e5884a2-3111-4002-93c3-b2148e068b97	ffafeedb66a6205334734e026cd5f123f4836466de590ae8b087948c0ad9ab2b	2025-10-22 06:34:57.338163+06	20251022003457_	\N	\N	2025-10-22 06:34:57.293311+06	1
dd6e34bb-f625-4d6d-bf37-21d3247e4271	76cffee22f1a6fa865f884a6497cec288660a99e95b15fac60fa7f40d187394b	2025-10-22 10:34:36.902991+06	20251022043436_	\N	\N	2025-10-22 10:34:36.890953+06	1
de0392d7-11de-4414-8826-1b5f341e0fae	83a7bc0a3c411f2f03c38d436e08c37b7c8fb15480e7b3a703dc3806badaf79c	2025-10-22 23:07:51.81976+06	20251022170751_payment_status	\N	\N	2025-10-22 23:07:51.807981+06	1
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, name, "contactNumber", address, gender, "profilePhoto", "isDeleted", "createdAt", "updatedAt") FROM stdin;
e79b4030-d2c4-483b-8879-82ff35df0f3b	admin1@gmail.com	Admin One	01711004567	Banani, Dhaka	MALE	\N	f	2025-10-19 12:37:49.065	2025-10-19 12:37:49.065
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, "paitentId", "doctorId", "scheduleId", "videoCallingId", status, "createdAt", "updatedAt", "paymentStatus") FROM stdin;
72fe9182-8edf-4433-ba8f-e39baaa13703	e909ffe6-477e-4dc3-b3e0-1e99cefe5430	90549c0c-2289-4194-bf03-673d015cc613	b815ade4-08c3-485e-b39b-34563cf1772e	6dcf8c7d-b820-449d-8bb6-76ab1d2d28eb	COMPLETED	2025-10-25 05:12:04.71	2025-11-06 06:32:08.559	PAID
cd3cdad6-9e12-4630-b5d7-349fe0d5625d	eb3e8c89-0ba8-4495-aa4c-672a9b14a997	bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	b815ade4-08c3-485e-b39b-34563cf1772e	918f807b-1b39-4ffa-9da6-6301fd95dd45	INPROGRESS	2025-10-23 18:05:28.158	2025-11-06 06:32:15.508	PAID
\.


--
-- Data for Name: doctor-schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."doctor-schedules" ("doctorId", "isBooked", "createdAt", "updatedAt", "scheduleId") FROM stdin;
bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	f	2025-10-19 12:50:03.694	2025-10-19 12:50:03.694	a02acd76-9f55-4d63-9238-d969798a8703
bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	f	2025-10-19 12:50:03.694	2025-10-19 12:50:03.694	eea91ea2-ffde-4a03-86c3-d3a71a4933b8
bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	t	2025-10-19 12:50:03.694	2025-10-23 18:05:28.17	b815ade4-08c3-485e-b39b-34563cf1772e
90549c0c-2289-4194-bf03-673d015cc613	f	2025-10-25 04:31:16.177	2025-10-25 04:31:16.177	a02acd76-9f55-4d63-9238-d969798a8703
90549c0c-2289-4194-bf03-673d015cc613	f	2025-10-25 04:31:16.177	2025-10-25 04:31:16.177	eea91ea2-ffde-4a03-86c3-d3a71a4933b8
90549c0c-2289-4194-bf03-673d015cc613	f	2025-10-25 04:34:09.318	2025-10-25 04:34:09.318	3b32edb7-9469-4230-b252-5a0fe29f015c
90549c0c-2289-4194-bf03-673d015cc613	f	2025-10-25 04:34:09.318	2025-10-25 04:34:09.318	273cec0a-46df-4aed-8604-b25d70548b4a
90549c0c-2289-4194-bf03-673d015cc613	t	2025-10-25 04:31:16.177	2025-10-25 05:12:04.783	b815ade4-08c3-485e-b39b-34563cf1772e
\.


--
-- Data for Name: doctor-specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."doctor-specialties" ("doctorId", "specialtiesId") FROM stdin;
bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	4cc9fef6-8fce-4d39-a66b-8fd99fbb4984
90549c0c-2289-4194-bf03-673d015cc613	e8d0ee1a-b5ac-4791-8216-fde55abbe5fc
69503f7f-c37f-4cb4-a815-27518c7639fa	5275cd89-d3cf-479d-b85d-d00a422aaa4d
8306ca50-cedb-401b-b8b6-a9867145a46b	be402fa0-04af-4334-b1d7-177cbec3ddee
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, email, name, "contactNumber", address, gender, "profilePhoto", qualification, "registrationNumber", experience, "currentWorkingPlace", designation, "appoinmentFee", "isDeleted", "createdAt", "updatedAt", rating) FROM stdin;
bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	doctor1@gmail.com	Doctor Two	01710011223	Dhanmondi, Dhaka	FEMALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1760877612/20251019124006392-photo_prince_300_300_final.jpg	MBBS, FCPS (Medicine)	BMDC-458712	10	Dhaka Medical College Hospital	Consultant, Internal Medicine	800	f	2025-10-19 12:40:11.087	2025-10-20 13:20:40.336	0
69503f7f-c37f-4cb4-a815-27518c7639fa	doctor3@gmail.com	Dr. Mahmud Hasan	01711022345	Uttara, Dhaka	MALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761014008/20251021023326183-man_doc.png	MBBS, MS (Orthopedics)	BMDC-372619	12	United Hospital	Orthopedic Surgeon	1000	f	2025-10-21 02:33:29.471	2025-10-21 02:33:29.471	0
8306ca50-cedb-401b-b8b6-a9867145a46b	doctor4@gmail.com	Dr. Nusrat Jahan	01711234567	Mohakhali, Dhaka	FEMALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761014096/20251021023453155-save.png	MBBS, FCPS (Gynecology & Obstetrics)	BMDC-561239	9	Evercare Hospital Dhaka	Consultant, Gynecology & Obstetrics	900	f	2025-10-21 02:34:56.777	2025-10-21 02:34:56.777	0
90549c0c-2289-4194-bf03-673d015cc613	doctor2@gmail.com	Dr. Ayesha Rahman	01710011223	Dhanmondi, Dhaka	FEMALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761013941/20251021023218374-save.png	MBBS, FCPS (Medicine)	BMDC-458712	10	Dhaka Medical College Hospital	Consultant, Internal Medicine	800	f	2025-10-21 02:32:21.857	2025-11-06 06:30:52.737	5
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, email, name, "contactNumber", address, gender, "profilePhoto", "isDeleted", "createdAt", "updatedAt") FROM stdin;
eb3e8c89-0ba8-4495-aa4c-672a9b14a997	patient1@gmail.com	Patient One	01700000006	\N	FEMALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1760877874/20251019124429160-photo_monju.jpg	f	2025-10-19 12:44:33.417	2025-10-19 12:44:33.417
e909ffe6-477e-4dc3-b3e0-1e99cefe5430	patient2@gmail.com	patient2	01700000003	\N	MALE	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761368718/20251025050511305-photo_esmai_dbbl.jpg	f	2025-10-25 05:05:18.849	2025-10-25 05:05:18.849
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "appointmentId", "transactionId", amount, status, "paymentGatewatyData", "createdAt", "updatedAt") FROM stdin;
2c9176e4-0dba-4c34-a9a0-ff5d67787849	cd3cdad6-9e12-4630-b5d7-349fe0d5625d	6eeb12a8-a963-4b10-b9ad-8f20afe604c2	800	PAID	\N	2025-10-23 18:05:28.175	2025-10-23 18:05:53.055
3e5eaca5-ed35-40f1-bedc-cc38d0e936d4	72fe9182-8edf-4433-ba8f-e39baaa13703	851134fe-af56-47b6-974a-a208ad2f3c84	800	PAID	{"id": "cs_test_a1TQlnPAcO9yxjrR9OWKXry59K59isYgo9XHg28gu4SdnsfHKc6KO4L9j0", "url": null, "mode": "payment", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1761369125, "invoice": null, "ui_mode": "hosted", "currency": "bdt", "customer": null, "livemode": false, "metadata": {"paymentId": "3e5eaca5-ed35-40f1-bedc-cc38d0e936d4", "appointmentId": "72fe9182-8edf-4433-ba8f-e39baaa13703"}, "discounts": [], "cancel_url": "https://next.programming-hero.com", "expires_at": 1761455525, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "https://www.programming-hero.com", "amount_total": 80000, "payment_link": null, "setup_intent": null, "subscription": null, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": "patient2@gmail.com", "origin_context": null, "payment_intent": "pi_3SLzmQRPourw90LX1XXDoWUJ", "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 80000, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "Patient Two", "email": "patient2@gmail.com", "phone": null, "address": {"city": null, "line1": null, "line2": null, "state": null, "country": "BD", "postal_code": null}, "tax_ids": [], "tax_exempt": "none", "business_name": null, "individual_name": null}, "invoice_creation": {"enabled": false, "invoice_data": {"footer": null, "issuer": null, "metadata": {}, "description": null, "custom_fields": null, "account_tax_ids": null, "rendering_options": null}}, "shipping_options": [], "branding_settings": {"icon": null, "logo": null, "font_family": "default", "border_style": "rounded", "button_color": "#0074d4", "display_name": "HEALTH CARE BD sandbox", "background_color": "#ffffff"}, "customer_creation": "if_required", "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"business_name": null, "individual_name": null, "shipping_details": null}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "if_required", "billing_address_collection": null, "shipping_address_collection": null, "saved_payment_method_options": null, "payment_method_configuration_details": null}	2025-10-25 05:12:04.788	2025-10-25 05:12:44.015
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, "patientId", "appointmentId", "doctorId", instruction, "followUpDate", "createdAt", "updatedAt") FROM stdin;
e6658f11-4678-41e4-a5a4-d340b5796d5c	eb3e8c89-0ba8-4495-aa4c-672a9b14a997	cd3cdad6-9e12-4630-b5d7-349fe0d5625d	bb4ac1a3-1601-4291-a8f9-2a94c19ee11c	1. Tab. Finix-20, 1+0+1, Tab. Ase 1+1+1	2025-11-25 15:27:00	2025-10-25 16:03:32.283	2025-10-25 16:03:32.283
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "appointmentId", "patientId", "doctorId", rating, comment, "createdAt", "updatedAt") FROM stdin;
5c832539-0c38-4034-a271-84229d8c4890	72fe9182-8edf-4433-ba8f-e39baaa13703	e909ffe6-477e-4dc3-b3e0-1e99cefe5430	90549c0c-2289-4194-bf03-673d015cc613	4.8	The doctor was very kind and listened to all my concerns	2025-11-06 06:30:52.708	2025-11-06 06:40:19.824
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, "startDateTime", "endDateTime", "createdAt", "updatedAt") FROM stdin;
b815ade4-08c3-485e-b39b-34563cf1772e	2025-10-20 15:00:00	2025-10-20 15:30:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
a02acd76-9f55-4d63-9238-d969798a8703	2025-10-20 15:30:00	2025-10-20 16:00:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
eea91ea2-ffde-4a03-86c3-d3a71a4933b8	2025-10-20 16:00:00	2025-10-20 16:30:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
791eab99-e2b8-49f9-bfb4-3b64ade86320	2025-10-20 16:30:00	2025-10-20 17:00:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
3b32edb7-9469-4230-b252-5a0fe29f015c	2025-10-20 17:00:00	2025-10-20 17:30:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
273cec0a-46df-4aed-8604-b25d70548b4a	2025-10-20 17:30:00	2025-10-20 18:00:00	2025-10-19 12:47:45.645	2025-10-19 12:47:45.645
\.


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specialties (id, title, icon) FROM stdin;
4cc9fef6-8fce-4d39-a66b-8fd99fbb4984	cardiology	https://res.cloudinary.com/dh8hyvndo/image/upload/v1760880071/20251019132107753-cardinology.png
b59c4e81-396c-4b42-9406-5fe7cd10f7cf	neurology	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761013187/20251021021945265-neurology.png
5275cd89-d3cf-479d-b85d-d00a422aaa4d	orthopedics	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761013264/20251021022101639-specialties.png
e8d0ee1a-b5ac-4791-8216-fde55abbe5fc	medicine	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761013380/20251021022256551-medicine.png
be402fa0-04af-4334-b1d7-177cbec3ddee	gynecology	https://res.cloudinary.com/dh8hyvndo/image/upload/v1761014595/20251021024312953-gynecology.png
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role, "needPasswordChange", status, "createdAt", "updatedAt") FROM stdin;
fa29dfdb-26c3-4f0d-b898-83fa7258ee6d	admin1@gmail.com	$2b$10$JydObUCvIIZuavXtkOk3ieL8BY2HKPQKFhAlhJNiGDuAyAlq9vFZi	ADMIN	t	ACTIVE	2025-10-19 12:37:49.039	2025-10-19 12:37:49.039
b7abc796-e3fa-4353-bbeb-e97985cbd8be	doctor1@gmail.com	$2b$10$uVMOocp8ZMz4XwV.uSFX8euwQkazxFub8CKapaQyZwXmUEwPW7PqS	DOCTOR	t	ACTIVE	2025-10-19 12:40:11.084	2025-10-19 12:40:11.084
2b69099f-9246-4455-b46f-34ae7ecebc25	doctor2@gmail.com	$2b$10$sqZak2pcbfIOE6E8J/9ddezeYnRx1F.rTv7bgRUmRY0M0ik8X9W1a	DOCTOR	t	ACTIVE	2025-10-21 02:32:21.844	2025-10-21 02:32:21.844
54d69648-1d21-4a5f-8b48-7414e274b4b8	doctor3@gmail.com	$2b$10$/O0qIztmmsB9GGssN/P1WezgXAm9AcEHDj8hoKSuvOTmuZxOJwV0.	DOCTOR	t	ACTIVE	2025-10-21 02:33:29.469	2025-10-21 02:33:29.469
a566a00d-e2f2-4ad6-851b-249002632d2b	doctor4@gmail.com	$2b$10$MqziFBivbj5St/1tywneQex14hnBLZRNX/d3Urd5uPf9bgR6X6Sp.	DOCTOR	t	ACTIVE	2025-10-21 02:34:56.776	2025-10-21 02:34:56.776
4fe96743-b8df-402c-8bba-215261b8942c	patient1@gmail.com	$2b$10$730zH.4Vx0/gYINZgh5ZeetipZ46ThM3eH5FwNReotX/83xtGEwZu	PATIENT	t	ACTIVE	2025-10-19 12:44:33.414	2025-10-23 01:46:21.64
c857f265-b235-4c27-a156-740216be3755	patient2@gmail.com	$2b$10$8e.P5ZxGH9A68Yqf24VF4eXbJGDRQCdMHc5N9HCIC8p.Rz6WkTRei	PATIENT	t	ACTIVE	2025-10-25 05:05:18.843	2025-10-25 05:05:18.843
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: doctor-schedules doctor-schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-schedules"
    ADD CONSTRAINT "doctor-schedules_pkey" PRIMARY KEY ("doctorId", "scheduleId");


--
-- Name: doctor-specialties doctor-specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-specialties"
    ADD CONSTRAINT "doctor-specialties_pkey" PRIMARY KEY ("specialtiesId", "doctorId");


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: specialties specialties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT specialties_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);


--
-- Name: appointments_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX appointments_id_key ON public.appointments USING btree (id);


--
-- Name: doctors_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX doctors_email_key ON public.doctors USING btree (email);


--
-- Name: patients_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX patients_email_key ON public.patients USING btree (email);


--
-- Name: payments_appointmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_appointmentId_key" ON public.payments USING btree ("appointmentId");


--
-- Name: payments_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payments_id_key ON public.payments USING btree (id);


--
-- Name: payments_transactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_transactionId_key" ON public.payments USING btree ("transactionId");


--
-- Name: prescriptions_appointmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "prescriptions_appointmentId_key" ON public.prescriptions USING btree ("appointmentId");


--
-- Name: prescriptions_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX prescriptions_id_key ON public.prescriptions USING btree (id);


--
-- Name: reviews_appointmentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reviews_appointmentId_key" ON public.reviews USING btree ("appointmentId");


--
-- Name: reviews_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reviews_id_key ON public.reviews USING btree (id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: admins admins_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_fkey FOREIGN KEY (email) REFERENCES public.users(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_paitentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_paitentId_fkey" FOREIGN KEY ("paitentId") REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: appointments appointments_scheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public.schedules(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor-schedules doctor-schedules_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-schedules"
    ADD CONSTRAINT "doctor-schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor-schedules doctor-schedules_scheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-schedules"
    ADD CONSTRAINT "doctor-schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public.schedules(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor-specialties doctor-specialties_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-specialties"
    ADD CONSTRAINT "doctor-specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctor-specialties doctor-specialties_specialtiesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."doctor-specialties"
    ADD CONSTRAINT "doctor-specialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES public.specialties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: doctors doctors_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_email_fkey FOREIGN KEY (email) REFERENCES public.users(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: patients patients_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_email_fkey FOREIGN KEY (email) REFERENCES public.users(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: prescriptions prescriptions_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: prescriptions prescriptions_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: prescriptions prescriptions_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public.appointments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public.patients(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 2waI5VjW5jkXodAS6pEO5VRpQn3K5PKKYuCZvBO7i1Cm555Or575nrubwYAYuQl

