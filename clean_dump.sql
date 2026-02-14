--
-- PostgreSQL database dump
--

\restrict xpHphlFtL0GUEzKjouUDPuahdzcYhs67JBjjilferg1qYpHvsGdqwR5hrTTNJHt

-- Dumped from database version 18.1 (Postgres.app)
-- Dumped by pg_dump version 18.1

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
-- Name: restock_shop(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.restock_shop(p_shop_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_slots integer;
BEGIN
  -- Clear old stock
  DELETE FROM npc_shop_stock
  WHERE shop_id = p_shop_id;

  -- Get number of slots
  SELECT stock_slots INTO v_slots
  FROM npc_shops
  WHERE id = p_shop_id;

  -- Insert new stock randomly from pool
  INSERT INTO npc_shop_stock (shop_id, item_id, quantity, buy_price, sell_price)
  SELECT
    p.shop_id,
    p.item_id,
    floor(random() * (p.max_qty - p.min_qty + 1) + p.min_qty)::int,
    p.buy_price,
    p.sell_price
  FROM npc_shop_item_pool p
  WHERE p.shop_id = p_shop_id
  ORDER BY random()
  LIMIT v_slots;

  -- Update timestamps
  UPDATE npc_shops
  SET
    last_restock_at = now(),
    next_restock_at = now() + (restock_seconds || ' seconds')::interval
  WHERE id = p_shop_id;

END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name text NOT NULL,
    base_price integer NOT NULL
);


--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materials (
    id integer NOT NULL,
    name text NOT NULL,
    base_value integer NOT NULL
);


--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;


--
-- Name: npc_shop_item_pool; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.npc_shop_item_pool (
    id integer NOT NULL,
    shop_id integer NOT NULL,
    item_id integer NOT NULL,
    weight integer DEFAULT 10 NOT NULL,
    min_qty integer DEFAULT 1 NOT NULL,
    max_qty integer DEFAULT 5 NOT NULL,
    buy_price integer NOT NULL,
    sell_price integer NOT NULL
);


--
-- Name: npc_shop_item_pool_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.npc_shop_item_pool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: npc_shop_item_pool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.npc_shop_item_pool_id_seq OWNED BY public.npc_shop_item_pool.id;


--
-- Name: npc_shop_stock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.npc_shop_stock (
    shop_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    buy_price integer NOT NULL,
    sell_price integer NOT NULL
);


--
-- Name: npc_shops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.npc_shops (
    id integer NOT NULL,
    name text NOT NULL,
    restock_seconds integer DEFAULT 3600 NOT NULL,
    last_restock_at timestamp with time zone,
    next_restock_at timestamp with time zone,
    stock_slots integer DEFAULT 8 NOT NULL
);


--
-- Name: npc_shops_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.npc_shops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: npc_shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.npc_shops_id_seq OWNED BY public.npc_shops.id;


--
-- Name: player_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_items (
    id integer NOT NULL,
    player_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL
);


--
-- Name: player_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: player_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_items_id_seq OWNED BY public.player_items.id;


--
-- Name: player_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_materials (
    id integer NOT NULL,
    player_id integer NOT NULL,
    material_id integer NOT NULL,
    quantity integer DEFAULT 0 NOT NULL
);


--
-- Name: player_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.player_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: player_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.player_materials_id_seq OWNED BY public.player_materials.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.players (
    id integer NOT NULL,
    user_id integer NOT NULL,
    coins integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: recipe_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer NOT NULL,
    material_id integer NOT NULL,
    quantity integer NOT NULL
);


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipe_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipe_ingredients_id_seq OWNED BY public.recipe_ingredients.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    item_id integer NOT NULL,
    craft_time integer DEFAULT 1 NOT NULL,
    seconds integer DEFAULT 60 NOT NULL
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: shop_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shop_listings (
    id integer NOT NULL,
    player_id integer NOT NULL,
    item_id integer NOT NULL,
    price integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: shop_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shop_listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shop_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shop_listings_id_seq OWNED BY public.shop_listings.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    player_id integer NOT NULL,
    item_id integer NOT NULL,
    price integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    display_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);


--
-- Name: npc_shop_item_pool id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_item_pool ALTER COLUMN id SET DEFAULT nextval('public.npc_shop_item_pool_id_seq'::regclass);


--
-- Name: npc_shops id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shops ALTER COLUMN id SET DEFAULT nextval('public.npc_shops_id_seq'::regclass);


--
-- Name: player_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_items ALTER COLUMN id SET DEFAULT nextval('public.player_items_id_seq'::regclass);


--
-- Name: player_materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_materials ALTER COLUMN id SET DEFAULT nextval('public.player_materials_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: recipe_ingredients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredients_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: shop_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_listings ALTER COLUMN id SET DEFAULT nextval('public.shop_listings_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.items (id, name, base_price) FROM stdin;
1	Plant Matter	1
2	Fiber	2
3	Stick Bundle	3
4	Plank Board	6
5	Stone Brick	7
6	Glass Bottle	5
7	Rope	9
8	Cloth	14
9	Leather	16
10	Leather Strips	8
11	Flour	4
12	Sugar	4
13	Copper Ingot	18
14	Tin Ingot	16
15	Bronze Ingot	28
16	Iron Ingot	22
17	Steel Ingot	35
18	Silver Ingot	45
19	Gold Ingot	60
20	Bronze Axe	65
21	Iron Axe	95
22	Steel Axe	125
23	Bronze Sword	110
24	Iron Sword	150
25	Steel Sword	190
26	Bow	85
27	Arrow Bundle	25
28	Wooden Shield	80
29	Bronze Shield	140
30	Iron Shield	170
31	Steel Shield	210
32	Cooked Meat	12
33	Cooked Fish	12
34	Berry Jam	14
35	Bread	16
36	Vegetable Soup	18
37	Meat Stew	22
38	Meat Pie	30
39	Milk Bottle	10
40	Water Bottle	10
41	Juice	12
42	Ale	20
43	Simple Jewelry	75
44	Fine Jewelry	160
45	Gold Coin	100
46	Silver Coin	60
\.


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.materials (id, name, base_value) FROM stdin;
1	Wood Log	1
2	Stone	1
3	Flint	1
4	Clay	1
5	Sand	1
6	Water	1
7	Copper Ore	1
8	Tin Ore	1
9	Iron Ore	1
10	Silver Ore	1
11	Gold Ore	1
12	Coal	1
13	Wheat	1
14	Corn	1
15	Carrot	1
16	Potato	1
17	Berry	1
18	Herbs	1
19	Cotton	1
20	Sugarcane	1
21	Raw Meat	1
22	Raw Fish	1
23	Hide	1
24	Bone	1
25	Feather	1
26	Wool	1
27	Milk	1
28	Egg	1
29	Plant Matter	1
30	Fiber	1
31	Stick	1
32	Plank	1
33	Charcoal	1
34	Brick	1
35	Glass Bottle	1
36	Rope	1
37	Cloth	1
38	Leather	1
39	Leather Strips	1
40	Flour	1
41	Sugar	1
42	Water Bottle	1
43	Milk Bottle	1
44	Copper Ingot	1
45	Tin Ingot	1
46	Bronze Ingot	1
47	Iron Ingot	1
48	Steel Ingot	1
49	Silver Ingot	1
50	Gold Ingot	1
\.


--
-- Data for Name: npc_shop_item_pool; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.npc_shop_item_pool (id, shop_id, item_id, weight, min_qty, max_qty, buy_price, sell_price) FROM stdin;
1	1	16	10	2	6	30	15
\.


--
-- Data for Name: npc_shop_stock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.npc_shop_stock (shop_id, item_id, quantity, buy_price, sell_price) FROM stdin;
1	16	6	30	15
\.


--
-- Data for Name: npc_shops; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.npc_shops (id, name, restock_seconds, last_restock_at, next_restock_at, stock_slots) FROM stdin;
3	General Store	3600	\N	\N	8
2	Jeweler	3600	2026-02-12 21:00:37.234234-08	2026-02-12 22:00:37.234234-08	8
4	Food Vendor	3600	2026-02-12 21:15:31.989706-08	2026-02-12 22:15:31.989706-08	8
1	Blacksmith	3600	2026-02-12 23:54:01.80635-08	2026-02-13 00:54:01.80635-08	8
\.


--
-- Data for Name: player_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.player_items (id, player_id, item_id, quantity) FROM stdin;
4	1	4	2
7	1	5	1
5	1	3	2
3	1	2	2
1	1	1	3
11	1	33	2
13	1	9	1
14	1	32	1
\.


--
-- Data for Name: player_materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.player_materials (id, player_id, material_id, quantity) FROM stdin;
13	1	23	0
31	1	15	3
14	1	1	25
15	1	31	6
16	1	29	9
33	1	22	1
66	1	25	1
20	1	9	2
36	1	7	6
19	1	2	31
29	1	8	3
11	1	21	9
27	1	26	1
18	1	18	2
21	1	3	2
17	1	17	3
12	1	24	4
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.players (id, user_id, coins, created_at) FROM stdin;
1	1	10	2026-01-29 18:51:30.886242
2	3	0	2026-02-02 18:38:51.331475
\.


--
-- Data for Name: recipe_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_ingredients (id, recipe_id, material_id, quantity) FROM stdin;
1	1	17	2
2	2	29	3
3	3	1	1
4	4	1	1
5	5	2	3
6	6	5	3
7	7	30	3
8	7	31	1
9	8	30	4
10	8	26	1
11	9	23	2
12	10	38	1
13	11	13	1
14	12	20	1
15	13	7	2
16	14	8	2
17	15	44	1
18	15	45	1
19	16	9	2
20	17	47	2
21	17	12	1
22	18	10	2
23	19	11	2
24	20	46	2
25	20	31	1
26	20	36	1
27	21	47	2
28	21	31	1
29	21	36	1
30	22	48	2
31	22	31	1
32	22	36	1
33	23	46	3
34	23	39	2
35	24	47	3
36	24	39	2
37	25	48	3
38	25	39	2
39	26	31	2
40	26	36	1
41	27	31	2
42	27	25	2
43	27	3	1
44	28	32	5
45	28	38	1
46	29	32	5
47	29	38	2
48	29	46	3
49	30	32	5
50	30	38	2
51	30	47	3
52	31	32	5
53	31	38	2
54	31	48	3
55	40	35	1
56	40	6	1
57	39	35	1
58	39	27	1
59	32	21	1
60	32	18	1
61	33	22	1
62	33	18	1
63	34	17	2
64	34	41	1
65	35	40	3
66	35	42	1
67	36	15	1
68	36	16	1
69	36	42	1
70	36	18	1
71	37	21	1
72	37	16	1
73	37	42	1
74	37	18	1
75	38	21	1
76	38	40	2
77	38	43	1
78	38	28	1
79	39	35	1
80	39	27	1
81	41	17	2
82	41	42	1
83	42	13	3
84	42	42	1
85	42	41	1
86	43	49	1
87	43	37	1
88	44	50	1
89	44	49	1
90	44	37	1
91	45	50	1
92	46	49	1
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, item_id, craft_time, seconds) FROM stdin;
1	1	1	60
2	2	1	60
3	3	1	60
4	4	1	60
5	5	1	60
6	6	1	60
7	7	1	60
8	8	1	60
9	9	1	60
10	10	1	60
11	11	1	60
12	12	1	60
13	13	1	60
14	14	1	60
15	15	1	60
16	16	1	60
17	17	1	60
18	18	1	60
19	19	1	60
20	20	1	60
21	21	1	60
22	22	1	60
23	23	1	60
24	24	1	60
25	25	1	60
26	26	1	60
27	27	1	60
28	28	1	60
29	29	1	60
30	30	1	60
31	31	1	60
32	32	1	60
33	33	1	60
34	34	1	60
35	35	1	60
36	36	1	60
37	37	1	60
38	38	1	60
39	39	1	60
40	40	1	60
41	41	1	60
42	42	1	60
43	43	1	60
44	44	1	60
45	45	1	60
46	46	1	60
\.


--
-- Data for Name: shop_listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shop_listings (id, player_id, item_id, price, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, player_id, item_id, price, quantity, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, display_name, created_at) FROM stdin;
1	test@example.com	$2b$10$wWKb2t58lno4Sq5mXRBC9ew.V3CceK2/wzG9z..Bb/wqSxm442SnO	Test	2026-01-29 18:51:30.878154
3	macgreen813@outlook.com	$2b$10$Dj8VMs/mxMz6zoGB0l6YmOwPEV1in6IpDri37yq5nlrTqJUAGSklC	Soduh	2026-02-02 18:38:51.32788
\.


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.items_id_seq', 46, true);


--
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.materials_id_seq', 50, true);


--
-- Name: npc_shop_item_pool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.npc_shop_item_pool_id_seq', 1, true);


--
-- Name: npc_shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.npc_shops_id_seq', 4, true);


--
-- Name: player_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.player_items_id_seq', 14, true);


--
-- Name: player_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.player_materials_id_seq', 70, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.players_id_seq', 2, true);


--
-- Name: recipe_ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipe_ingredients_id_seq', 92, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 46, true);


--
-- Name: shop_listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shop_listings_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: items items_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_name_key UNIQUE (name);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: materials materials_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_name_key UNIQUE (name);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: npc_shop_item_pool npc_shop_item_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_item_pool
    ADD CONSTRAINT npc_shop_item_pool_pkey PRIMARY KEY (id);


--
-- Name: npc_shop_item_pool npc_shop_item_pool_shop_id_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_item_pool
    ADD CONSTRAINT npc_shop_item_pool_shop_id_item_id_key UNIQUE (shop_id, item_id);


--
-- Name: npc_shop_stock npc_shop_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_stock
    ADD CONSTRAINT npc_shop_stock_pkey PRIMARY KEY (shop_id, item_id);


--
-- Name: npc_shops npc_shops_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shops
    ADD CONSTRAINT npc_shops_name_key UNIQUE (name);


--
-- Name: npc_shops npc_shops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shops
    ADD CONSTRAINT npc_shops_pkey PRIMARY KEY (id);


--
-- Name: player_items player_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT player_items_pkey PRIMARY KEY (id);


--
-- Name: player_items player_items_player_id_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT player_items_player_id_item_id_key UNIQUE (player_id, item_id);


--
-- Name: player_materials player_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_materials
    ADD CONSTRAINT player_materials_pkey PRIMARY KEY (id);


--
-- Name: player_materials player_materials_player_id_material_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_materials
    ADD CONSTRAINT player_materials_player_id_material_id_key UNIQUE (player_id, material_id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: players players_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_user_id_key UNIQUE (user_id);


--
-- Name: recipe_ingredients recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: shop_listings shop_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_listings
    ADD CONSTRAINT shop_listings_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: shop_listings_player_item_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX shop_listings_player_item_unique ON public.shop_listings USING btree (player_id, item_id);


--
-- Name: npc_shop_item_pool npc_shop_item_pool_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_item_pool
    ADD CONSTRAINT npc_shop_item_pool_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: npc_shop_item_pool npc_shop_item_pool_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_item_pool
    ADD CONSTRAINT npc_shop_item_pool_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.npc_shops(id) ON DELETE CASCADE;


--
-- Name: npc_shop_stock npc_shop_stock_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_stock
    ADD CONSTRAINT npc_shop_stock_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: npc_shop_stock npc_shop_stock_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.npc_shop_stock
    ADD CONSTRAINT npc_shop_stock_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.npc_shops(id) ON DELETE CASCADE;


--
-- Name: player_items player_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT player_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: player_items player_items_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_items
    ADD CONSTRAINT player_items_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: player_materials player_materials_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_materials
    ADD CONSTRAINT player_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- Name: player_materials player_materials_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_materials
    ADD CONSTRAINT player_materials_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: players players_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredients recipe_ingredients_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- Name: recipe_ingredients recipe_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: shop_listings shop_listings_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_listings
    ADD CONSTRAINT shop_listings_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: shop_listings shop_listings_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_listings
    ADD CONSTRAINT shop_listings_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id);


--
-- Name: transactions transactions_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- PostgreSQL database dump complete
--

\unrestrict xpHphlFtL0GUEzKjouUDPuahdzcYhs67JBjjilferg1qYpHvsGdqwR5hrTTNJHt

