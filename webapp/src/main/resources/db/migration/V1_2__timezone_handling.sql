CREATE TABLE public.lkp_timezone
(
  code character varying(255) NOT NULL,
  abbrev character varying(255),
  description character varying(500),
  CONSTRAINT lkp_timezone_pkey PRIMARY KEY (code)
);

ALTER TABLE public.users ADD COLUMN timezone character varying(255);

ALTER TABLE public.users
  ADD CONSTRAINT fk14dcc3qu95kmt6hyibfnmo1ur FOREIGN KEY (timezone)
      REFERENCES public.lkp_timezone (code) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;


INSERT INTO public.lkp_timezone (code, abbrev, description)
SELECT
    name,
    abbrev,
    concat(name, ' (', abbrev, ')')
FROM pg_timezone_names 
WHERE name !~ 'posix' 
ORDER BY name asc;

update users set timezone = 'Europe/Rome';