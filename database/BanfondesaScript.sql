--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-26 16:58:19

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
    "loanId" integer NOT NULL
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
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 225
-- Name: capital_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capital_payments_id_seq OWNED BY public.capital_payments.id;


--
-- TOC entry 230 (class 1259 OID 17056)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17055)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 229
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


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
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 221
-- Name: loan_amortizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_amortizations_id_seq OWNED BY public.loan_amortizations.id;


--
-- TOC entry 228 (class 1259 OID 17004)
-- Name: loan_decisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loan_decisions (
    id integer NOT NULL,
    approved boolean NOT NULL,
    "decisionDate" timestamp without time zone DEFAULT now() NOT NULL,
    "reviewerName" character varying,
    comment text,
    "loanId" integer
);


ALTER TABLE public.loan_decisions OWNER TO postgres;

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
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 227
-- Name: loan_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_approvals_id_seq OWNED BY public.loan_decisions.id;


--
-- TOC entry 231 (class 1259 OID 17306)
-- Name: loan_decisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loan_decisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loan_decisions_id_seq OWNER TO postgres;

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 231
-- Name: loan_decisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loan_decisions_id_seq OWNED BY public.loan_decisions.id;


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
-- TOC entry 4879 (class 0 OID 0)
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
    "clientId" integer NOT NULL,
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
-- TOC entry 4880 (class 0 OID 0)
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
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4682 (class 2604 OID 16992)
-- Name: capital_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments ALTER COLUMN id SET DEFAULT nextval('public.capital_payments_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 17059)
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 16960)
-- Name: loan_amortizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations ALTER COLUMN id SET DEFAULT nextval('public.loan_amortizations_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 17313)
-- Name: loan_decisions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_decisions ALTER COLUMN id SET DEFAULT nextval('public.loan_decisions_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 16973)
-- Name: loan_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments ALTER COLUMN id SET DEFAULT nextval('public.loan_payments_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 16945)
-- Name: loans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);


--
-- TOC entry 4672 (class 2604 OID 16833)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4863 (class 0 OID 16989)
-- Dependencies: 226
-- Data for Name: capital_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capital_payments (id, amount, description, "paymentDate", "loanId") FROM stdin;
\.


--
-- TOC entry 4867 (class 0 OID 17056)
-- Dependencies: 230
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, last_name, email, phone) FROM stdin;
1	Miguel	abreu	pedro@gmail.com	9087654352
\.


--
-- TOC entry 4859 (class 0 OID 16957)
-- Dependencies: 222
-- Data for Name: loan_amortizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_amortizations (id, principal, interest, paid, "installmentNumber", "totalPayment", "loanId", "dueDate", "paymentDate") FROM stdin;
\.


--
-- TOC entry 4865 (class 0 OID 17004)
-- Dependencies: 228
-- Data for Name: loan_decisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_decisions (id, approved, "decisionDate", "reviewerName", comment, "loanId") FROM stdin;
\.


--
-- TOC entry 4861 (class 0 OID 16970)
-- Dependencies: 224
-- Data for Name: loan_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loan_payments (id, "amountPaid", "paymentDate", "isExtraPayment", "loanId", "amortizationId") FROM stdin;
\.


--
-- TOC entry 4857 (class 0 OID 16942)
-- Dependencies: 220
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (id, amount, "termMonths", "interestRate", "amortizationType", "createdAt", "approvedAt", "clientId", status) FROM stdin;
\.


--
-- TOC entry 4855 (class 0 OID 16830)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, status) FROM stdin;
4	user	$2b$10$bQCkc2aGuz0oFAaCx7R4xO40svphWM1dXGNUmvTyTauTfKo66bAYK	t
1	kiko	$2b$10$BfOSLabLBis2.BLqz6jCwu6uoMQeZpPeaoKBjv1CuPt1lPVcFqS8u	t
\.


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 225
-- Name: capital_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capital_payments_id_seq', 1, false);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 229
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 1, true);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 221
-- Name: loan_amortizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_amortizations_id_seq', 1, false);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 227
-- Name: loan_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_approvals_id_seq', 1, false);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 231
-- Name: loan_decisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_decisions_id_seq', 1, false);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 223
-- Name: loan_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loan_payments_id_seq', 1, false);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 219
-- Name: loans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loans_id_seq', 1, false);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4700 (class 2606 OID 17012)
-- Name: loan_decisions PK_3444dfb8484ad3286153aeabd71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_decisions
    ADD CONSTRAINT "PK_3444dfb8484ad3286153aeabd71" PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 16843)
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- TOC entry 4698 (class 2606 OID 16997)
-- Name: capital_payments capital_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT capital_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 17064)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 16963)
-- Name: loan_amortizations loan_amortizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT loan_amortizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 16977)
-- Name: loan_payments loan_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT loan_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4692 (class 2606 OID 16950)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 16837)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 17050)
-- Name: loan_amortizations FK_3c62dc80abc08d0af16a05fabe5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT "FK_3c62dc80abc08d0af16a05fabe5" FOREIGN KEY ("loanId") REFERENCES public.loans(id);


--
-- TOC entry 4708 (class 2606 OID 17308)
-- Name: loan_decisions FK_97327cab29519a668a54f6ce1b2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_decisions
    ADD CONSTRAINT "FK_97327cab29519a668a54f6ce1b2" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


--
-- TOC entry 4705 (class 2606 OID 17028)
-- Name: loan_payments FK_9d68470fec8d4fd2b3c70e15e48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_9d68470fec8d4fd2b3c70e15e48" FOREIGN KEY ("amortizationId") REFERENCES public.loan_amortizations(id);


--
-- TOC entry 4703 (class 2606 OID 17085)
-- Name: loans FK_a04f985bb1203a1e90a89ee9c6b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "FK_a04f985bb1203a1e90a89ee9c6b" FOREIGN KEY ("clientId") REFERENCES public.clients(id);


--
-- TOC entry 4706 (class 2606 OID 17023)
-- Name: loan_payments FK_c0268488cc84d23c1e5c6c1910d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_c0268488cc84d23c1e5c6c1910d" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


--
-- TOC entry 4707 (class 2606 OID 17033)
-- Name: capital_payments FK_ef1f0771d2d6b459f80aa686cbe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT "FK_ef1f0771d2d6b459f80aa686cbe" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;


-- Completed on 2025-05-26 16:58:19

--
-- PostgreSQL database dump complete
--

