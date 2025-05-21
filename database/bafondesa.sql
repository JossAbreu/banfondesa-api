--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-21 17:15:41

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16989)
-- Name: capital_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capital_payments (
    id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    "paymentDate" date DEFAULT ('now'::text)::date NOT NULL,
    "loanId" integer
);


ALTER TABLE public.capital_payments OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16988)
-- Name: capital_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capital_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.capital_payments_id_seq OWNER TO postgres;

--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 225
-- Name: capital_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capital_payments_id_seq OWNED BY public.capital_payments.id;


--
-- TOC entry 222 (class 1259 OID 16957)
-- Name: loan_amortizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_amortizations (
    id integer NOT NULL,
    principal numeric NOT NULL,
    interest numeric NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    "installmentNumber" integer NOT NULL,
    "totalPayment" numeric NOT NULL,
    "loanId" integer NOT NULL,
    "dueDate" timestamp without time zone NOT NULL,
    "paymentDate" timestamp without time zone
);


ALTER TABLE public.loan_amortizations OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16956)
-- Name: loan_amortizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_amortizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_amortizations_id_seq OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 221
-- Name: loan_amortizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_amortizations_id_seq OWNED BY public.loan_amortizations.id;


--
-- TOC entry 228 (class 1259 OID 17004)
-- Name: loan_approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_approvals (
    id integer NOT NULL,
    approved boolean NOT NULL,
    "decisionDate" timestamp without time zone DEFAULT now() NOT NULL,
    "reviewerName" character varying,
    comment text,
    "loanId" integer
);


ALTER TABLE public.loan_approvals OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17003)
-- Name: loan_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_approvals_id_seq OWNER TO postgres;

--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 227
-- Name: loan_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_approvals_id_seq OWNED BY public.loan_approvals.id;


--
-- TOC entry 224 (class 1259 OID 16970)
-- Name: loan_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_payments (
    id integer NOT NULL,
    "amountPaid" numeric(12,2) NOT NULL,
    "paymentDate" date DEFAULT ('now'::text)::date NOT NULL,
    "isExtraPayment" boolean DEFAULT false NOT NULL,
    "loanId" integer,
    "amortizationId" integer
);


ALTER TABLE public.loan_payments OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16969)
-- Name: loan_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_payments_id_seq OWNER TO postgres;

--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 223
-- Name: loan_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_payments_id_seq OWNED BY public.loan_payments.id;


--
-- TOC entry 220 (class 1259 OID 16942)
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    "termMonths" integer NOT NULL,
    "interestRate" numeric(5,2) NOT NULL,
    "amortizationType" character varying(20) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "approvedAt" timestamp without time zone,
    "userId" integer,
    status character varying(20) DEFAULT 'pendiente'::character varying NOT NULL
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16941)
-- Name: loans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loans_id_seq OWNER TO postgres;

--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 219
-- Name: loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loans_id_seq OWNED BY public.loans.id;


--
-- TOC entry 218 (class 1259 OID 16830)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16829)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4676 (class 2604 OID 16992)
-- Name: capital_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments ALTER COLUMN id SET DEFAULT nextval('public.capital_payments_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 16960)
-- Name: loan_amortizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations ALTER COLUMN id SET DEFAULT nextval('public.loan_amortizations_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 17007)
-- Name: loan_approvals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_approvals ALTER COLUMN id SET DEFAULT nextval('public.loan_approvals_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 16973)
-- Name: loan_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments ALTER COLUMN id SET DEFAULT nextval('public.loan_payments_id_seq'::regclass);


--
-- TOC entry 4668 (class 2604 OID 16945)
-- Name: loans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);


--
-- TOC entry 4666 (class 2604 OID 16833)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4854 (class 0 OID 16989)
-- Dependencies: 226
-- Data for Name: capital_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capital_payments (id, amount, description, "paymentDate", "loanId") FROM stdin;
\.


--
-- TOC entry 4850 (class 0 OID 16957)
-- Dependencies: 222
-- Data for Name: loan_amortizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_amortizations (id, principal, interest, paid, "installmentNumber", "totalPayment", "loanId", "dueDate", "paymentDate") FROM stdin;
3	7884.88	1000	f	1	8884.88	14	2025-06-21 16:52:47.001	\N
4	7963.73	921.15	f	2	8884.88	14	2025-07-21 16:52:47.001	\N
5	8043.36	841.51	f	3	8884.88	14	2025-08-21 16:52:47.001	\N
6	8123.8	761.08	f	4	8884.88	14	2025-09-21 16:52:47.001	\N
7	8205.04	679.84	f	5	8884.88	14	2025-10-21 16:52:47.001	\N
8	8287.09	597.79	f	6	8884.88	14	2025-11-21 16:52:47.001	\N
9	8369.96	514.92	f	7	8884.88	14	2025-12-21 16:52:47.001	\N
10	8453.66	431.22	f	8	8884.88	14	2026-01-21 16:52:47.001	\N
11	8538.19	346.68	f	9	8884.88	14	2026-02-21 16:52:47.001	\N
12	8623.58	261.3	f	10	8884.88	14	2026-03-21 16:52:47.001	\N
13	8709.81	175.07	f	11	8884.88	14	2026-04-21 16:52:47.001	\N
14	8796.91	87.97	f	12	8884.88	14	2026-05-21 16:52:47.001	\N
\.


--
-- TOC entry 4856 (class 0 OID 17004)
-- Dependencies: 228
-- Data for Name: loan_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_approvals (id, approved, "decisionDate", "reviewerName", comment, "loanId") FROM stdin;
\.


--
-- TOC entry 4852 (class 0 OID 16970)
-- Dependencies: 224
-- Data for Name: loan_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_payments (id, "amountPaid", "paymentDate", "isExtraPayment", "loanId", "amortizationId") FROM stdin;
\.


--
-- TOC entry 4848 (class 0 OID 16942)
-- Dependencies: 220
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (id, amount, "termMonths", "interestRate", "amortizationType", "createdAt", "approvedAt", "userId", status) FROM stdin;
10	1000.00	1	0.18	fija	2025-05-21 15:25:08.146871	\N	4	pendiente
11	10000.00	12	0.18	fija	2025-05-21 15:44:14.157706	\N	4	pendiente
12	100000.00	12	0.18	fija	2025-05-21 15:52:11.245641	\N	4	pendiente
13	100000.00	12	0.18	variable	2025-05-21 15:53:09.006063	\N	4	pendiente
14	100000.00	12	0.12	fija	2025-05-21 16:35:07.962023	2025-05-21 16:52:46.982	4	aprobado
\.


--
-- TOC entry 4846 (class 0 OID 16830)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, status) FROM stdin;
4	user	$2b$10$bQCkc2aGuz0oFAaCx7R4xO40svphWM1dXGNUmvTyTauTfKo66bAYK	t
1	kiko	$2b$10$BfOSLabLBis2.BLqz6jCwu6uoMQeZpPeaoKBjv1CuPt1lPVcFqS8u	f
\.


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 225
-- Name: capital_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capital_payments_id_seq', 1, false);


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 221
-- Name: loan_amortizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_amortizations_id_seq', 14, true);


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 227
-- Name: loan_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_approvals_id_seq', 1, false);


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 223
-- Name: loan_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_payments_id_seq', 1, false);


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 219
-- Name: loans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loans_id_seq', 14, true);


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4693 (class 2606 OID 17012)
-- Name: loan_approvals PK_3444dfb8484ad3286153aeabd71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_approvals
    ADD CONSTRAINT "PK_3444dfb8484ad3286153aeabd71" PRIMARY KEY (id);


--
-- TOC entry 4681 (class 2606 OID 16843)
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- TOC entry 4691 (class 2606 OID 16997)
-- Name: capital_payments capital_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT capital_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 2606 OID 16963)
-- Name: loan_amortizations loan_amortizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT loan_amortizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 16977)
-- Name: loan_payments loan_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT loan_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4685 (class 2606 OID 16950)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 4683 (class 2606 OID 16837)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 17050)
-- Name: loan_amortizations FK_3c62dc80abc08d0af16a05fabe5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT "FK_3c62dc80abc08d0af16a05fabe5" FOREIGN KEY ("loanId") REFERENCES public.loans(id);


--
-- TOC entry 4694 (class 2606 OID 17043)
-- Name: loans FK_4c2ab4e556520045a2285916d45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "FK_4c2ab4e556520045a2285916d45" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 4699 (class 2606 OID 17038)
-- Name: loan_approvals FK_5b1703c77f4bbecacf7b40e7bab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_approvals
    ADD CONSTRAINT "FK_5b1703c77f4bbecacf7b40e7bab" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


--
-- TOC entry 4696 (class 2606 OID 17028)
-- Name: loan_payments FK_9d68470fec8d4fd2b3c70e15e48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_9d68470fec8d4fd2b3c70e15e48" FOREIGN KEY ("amortizationId") REFERENCES public.loan_amortizations(id);


--
-- TOC entry 4697 (class 2606 OID 17023)
-- Name: loan_payments FK_c0268488cc84d23c1e5c6c1910d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_c0268488cc84d23c1e5c6c1910d" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


--
-- TOC entry 4698 (class 2606 OID 17033)
-- Name: capital_payments FK_ef1f0771d2d6b459f80aa686cbe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT "FK_ef1f0771d2d6b459f80aa686cbe" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


-- Completed on 2025-05-21 17:15:41

--
-- PostgreSQL database dump complete
--

