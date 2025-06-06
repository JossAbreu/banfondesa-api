PGDMP  8    "                }            banfondesaDB    17.5    17.5 ?    l           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            m           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            n           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            o           1262    16691    banfondesaDB    DATABASE     �   CREATE DATABASE "banfondesaDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "banfondesaDB";
                     postgres    false            �            1259    16692    capital_payments    TABLE     �   CREATE TABLE public.capital_payments (
    id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    "paymentDate" date DEFAULT ('now'::text)::date NOT NULL,
    "loanId" integer NOT NULL
);
 $   DROP TABLE public.capital_payments;
       public         heap r       postgres    false            �            1259    16698    capital_payments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.capital_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.capital_payments_id_seq;
       public               postgres    false    217            p           0    0    capital_payments_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.capital_payments_id_seq OWNED BY public.capital_payments.id;
          public               postgres    false    218            �            1259    16699    clients    TABLE     �   CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL
);
    DROP TABLE public.clients;
       public         heap r       postgres    false            �            1259    16704    clients_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.clients_id_seq;
       public               postgres    false    219            q           0    0    clients_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;
          public               postgres    false    220            �            1259    16705    loan_amortizations    TABLE     }  CREATE TABLE public.loan_amortizations (
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
 &   DROP TABLE public.loan_amortizations;
       public         heap r       postgres    false            �            1259    16711    loan_amortizations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.loan_amortizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.loan_amortizations_id_seq;
       public               postgres    false    221            r           0    0    loan_amortizations_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.loan_amortizations_id_seq OWNED BY public.loan_amortizations.id;
          public               postgres    false    222            �            1259    16712    loan_decisions    TABLE     �   CREATE TABLE public.loan_decisions (
    id integer NOT NULL,
    approved boolean NOT NULL,
    "decisionDate" timestamp without time zone DEFAULT now() NOT NULL,
    "reviewerName" character varying,
    comment text,
    "loanId" integer
);
 "   DROP TABLE public.loan_decisions;
       public         heap r       postgres    false            �            1259    16718    loan_approvals_id_seq    SEQUENCE     �   CREATE SEQUENCE public.loan_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.loan_approvals_id_seq;
       public               postgres    false    223            s           0    0    loan_approvals_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.loan_approvals_id_seq OWNED BY public.loan_decisions.id;
          public               postgres    false    224            �            1259    16719    loan_decisions_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.loan_decisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.loan_decisions_id_seq;
       public               postgres    false    223            t           0    0    loan_decisions_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.loan_decisions_id_seq OWNED BY public.loan_decisions.id;
          public               postgres    false    225            �            1259    16720    loan_payments    TABLE       CREATE TABLE public.loan_payments (
    id integer NOT NULL,
    "amountPaid" numeric(12,2) NOT NULL,
    "paymentDate" date DEFAULT ('now'::text)::date NOT NULL,
    "isExtraPayment" boolean DEFAULT false NOT NULL,
    "loanId" integer,
    "amortizationId" integer
);
 !   DROP TABLE public.loan_payments;
       public         heap r       postgres    false            �            1259    16725    loan_payments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.loan_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.loan_payments_id_seq;
       public               postgres    false    226            u           0    0    loan_payments_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.loan_payments_id_seq OWNED BY public.loan_payments.id;
          public               postgres    false    227            �            1259    16726    loans    TABLE     �  CREATE TABLE public.loans (
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
    DROP TABLE public.loans;
       public         heap r       postgres    false            �            1259    16731    loans_id_seq    SEQUENCE     �   CREATE SEQUENCE public.loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.loans_id_seq;
       public               postgres    false    228            v           0    0    loans_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.loans_id_seq OWNED BY public.loans.id;
          public               postgres    false    229            �            1259    16732    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    status boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16738    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    230            w           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    231            �           2604    16739    capital_payments id    DEFAULT     z   ALTER TABLE ONLY public.capital_payments ALTER COLUMN id SET DEFAULT nextval('public.capital_payments_id_seq'::regclass);
 B   ALTER TABLE public.capital_payments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217            �           2604    16740 
   clients id    DEFAULT     h   ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);
 9   ALTER TABLE public.clients ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            �           2604    16741    loan_amortizations id    DEFAULT     ~   ALTER TABLE ONLY public.loan_amortizations ALTER COLUMN id SET DEFAULT nextval('public.loan_amortizations_id_seq'::regclass);
 D   ALTER TABLE public.loan_amortizations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            �           2604    16742    loan_decisions id    DEFAULT     v   ALTER TABLE ONLY public.loan_decisions ALTER COLUMN id SET DEFAULT nextval('public.loan_decisions_id_seq'::regclass);
 @   ALTER TABLE public.loan_decisions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    223            �           2604    16743    loan_payments id    DEFAULT     t   ALTER TABLE ONLY public.loan_payments ALTER COLUMN id SET DEFAULT nextval('public.loan_payments_id_seq'::regclass);
 ?   ALTER TABLE public.loan_payments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    226            �           2604    16744    loans id    DEFAULT     d   ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);
 7   ALTER TABLE public.loans ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228            �           2604    16745    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    230            [          0    16692    capital_payments 
   TABLE DATA           \   COPY public.capital_payments (id, amount, description, "paymentDate", "loanId") FROM stdin;
    public               postgres    false    217   `M       ]          0    16699    clients 
   TABLE DATA           D   COPY public.clients (id, name, last_name, email, phone) FROM stdin;
    public               postgres    false    219   }M       _          0    16705    loan_amortizations 
   TABLE DATA           �   COPY public.loan_amortizations (id, principal, interest, paid, "installmentNumber", "totalPayment", "loanId", "dueDate", "paymentDate") FROM stdin;
    public               postgres    false    221   �M       a          0    16712    loan_decisions 
   TABLE DATA           i   COPY public.loan_decisions (id, approved, "decisionDate", "reviewerName", comment, "loanId") FROM stdin;
    public               postgres    false    223   �M       d          0    16720    loan_payments 
   TABLE DATA           v   COPY public.loan_payments (id, "amountPaid", "paymentDate", "isExtraPayment", "loanId", "amortizationId") FROM stdin;
    public               postgres    false    226   �M       f          0    16726    loans 
   TABLE DATA           �   COPY public.loans (id, amount, "termMonths", "interestRate", "amortizationType", "createdAt", "approvedAt", "clientId", status) FROM stdin;
    public               postgres    false    228   N       h          0    16732    users 
   TABLE DATA           ?   COPY public.users (id, username, password, status) FROM stdin;
    public               postgres    false    230   8N       x           0    0    capital_payments_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.capital_payments_id_seq', 1, false);
          public               postgres    false    218            y           0    0    clients_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.clients_id_seq', 1, true);
          public               postgres    false    220            z           0    0    loan_amortizations_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.loan_amortizations_id_seq', 1, false);
          public               postgres    false    222            {           0    0    loan_approvals_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.loan_approvals_id_seq', 1, false);
          public               postgres    false    224            |           0    0    loan_decisions_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.loan_decisions_id_seq', 1, false);
          public               postgres    false    225            }           0    0    loan_payments_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.loan_payments_id_seq', 1, false);
          public               postgres    false    227            ~           0    0    loans_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.loans_id_seq', 1, false);
          public               postgres    false    229                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public               postgres    false    231            �           2606    16747 -   loan_decisions PK_3444dfb8484ad3286153aeabd71 
   CONSTRAINT     m   ALTER TABLE ONLY public.loan_decisions
    ADD CONSTRAINT "PK_3444dfb8484ad3286153aeabd71" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.loan_decisions DROP CONSTRAINT "PK_3444dfb8484ad3286153aeabd71";
       public                 postgres    false    223            �           2606    16749 $   users UQ_fe0bb3f6520ee0469504521e710 
   CONSTRAINT     e   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710";
       public                 postgres    false    230            �           2606    16751 &   capital_payments capital_payments_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT capital_payments_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.capital_payments DROP CONSTRAINT capital_payments_pkey;
       public                 postgres    false    217            �           2606    16753    clients clients_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.clients DROP CONSTRAINT clients_pkey;
       public                 postgres    false    219            �           2606    16755 *   loan_amortizations loan_amortizations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT loan_amortizations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.loan_amortizations DROP CONSTRAINT loan_amortizations_pkey;
       public                 postgres    false    221            �           2606    16757     loan_payments loan_payments_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT loan_payments_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.loan_payments DROP CONSTRAINT loan_payments_pkey;
       public                 postgres    false    226            �           2606    16759    loans loans_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.loans DROP CONSTRAINT loans_pkey;
       public                 postgres    false    228            �           2606    16761    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    230            �           2606    16762 1   loan_amortizations FK_3c62dc80abc08d0af16a05fabe5    FK CONSTRAINT     �   ALTER TABLE ONLY public.loan_amortizations
    ADD CONSTRAINT "FK_3c62dc80abc08d0af16a05fabe5" FOREIGN KEY ("loanId") REFERENCES public.loans(id);
 ]   ALTER TABLE ONLY public.loan_amortizations DROP CONSTRAINT "FK_3c62dc80abc08d0af16a05fabe5";
       public               postgres    false    221    228    4799            �           2606    16767 -   loan_decisions FK_97327cab29519a668a54f6ce1b2    FK CONSTRAINT     �   ALTER TABLE ONLY public.loan_decisions
    ADD CONSTRAINT "FK_97327cab29519a668a54f6ce1b2" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.loan_decisions DROP CONSTRAINT "FK_97327cab29519a668a54f6ce1b2";
       public               postgres    false    223    228    4799            �           2606    16772 ,   loan_payments FK_9d68470fec8d4fd2b3c70e15e48    FK CONSTRAINT     �   ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_9d68470fec8d4fd2b3c70e15e48" FOREIGN KEY ("amortizationId") REFERENCES public.loan_amortizations(id);
 X   ALTER TABLE ONLY public.loan_payments DROP CONSTRAINT "FK_9d68470fec8d4fd2b3c70e15e48";
       public               postgres    false    4793    226    221            �           2606    16777 $   loans FK_a04f985bb1203a1e90a89ee9c6b    FK CONSTRAINT     �   ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "FK_a04f985bb1203a1e90a89ee9c6b" FOREIGN KEY ("clientId") REFERENCES public.clients(id);
 P   ALTER TABLE ONLY public.loans DROP CONSTRAINT "FK_a04f985bb1203a1e90a89ee9c6b";
       public               postgres    false    4791    228    219            �           2606    16782 ,   loan_payments FK_c0268488cc84d23c1e5c6c1910d    FK CONSTRAINT     �   ALTER TABLE ONLY public.loan_payments
    ADD CONSTRAINT "FK_c0268488cc84d23c1e5c6c1910d" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.loan_payments DROP CONSTRAINT "FK_c0268488cc84d23c1e5c6c1910d";
       public               postgres    false    226    4799    228            �           2606    16787 /   capital_payments FK_ef1f0771d2d6b459f80aa686cbe    FK CONSTRAINT     �   ALTER TABLE ONLY public.capital_payments
    ADD CONSTRAINT "FK_ef1f0771d2d6b459f80aa686cbe" FOREIGN KEY ("loanId") REFERENCES public.loans(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.capital_payments DROP CONSTRAINT "FK_ef1f0771d2d6b459f80aa686cbe";
       public               postgres    false    217    4799    228            [      x������ � �      ]   7   x�3���L/M��LL*J-�,HM)�wH�M���K���4�0735165����� j\      _      x������ � �      a      x������ � �      d      x������ � �      f      x������ � �      h   �   x�5�MC0 �urk#Ƥ�JfX�(�3�$-eB�T�����9F�B�-b2���>���\����Yb���q�����ݜryhJ�{	Є	��;����*�B!CV����a����%t���pH&�&���-����1�/>-�     