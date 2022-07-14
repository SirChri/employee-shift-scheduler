/***************/
/**   UTILS    */
/***************/

REATE SEQUENCE IF NOT EXISTS public.id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE OR REPLACE FUNCTION public._sys_utils_new_card_id()
  RETURNS bigint AS
$BODY$
	SELECT nextval('id_seq')::bigint;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION public._sys_utils_name_to_basename(_class_name character varying)
  RETURNS character varying AS
$BODY$ BEGIN
	return regexp_replace(regexp_replace(_class_name,'"','','g'),'^([^.]+)[.]','');
END $BODY$
  LANGUAGE plpgsql IMMUTABLE STRICT
  COST 100;

CREATE OR REPLACE FUNCTION public._sys_utils_name_escape(_class_name character varying)
  RETURNS character varying AS
$BODY$ BEGIN
	IF _class_name ~ '^".*"$' THEN
		RETURN _class_name;
	ELSE
		IF _class_name ~ '^[^.]+[.][^.]+$' THEN
			RETURN regexp_replace(_class_name, '^([^.]+)[.]([^.]+)$', '"\1"."\2"');
		ELSE
			RETURN format('"%s"', _class_name);
		END IF;
	END IF; 
END $BODY$
  LANGUAGE plpgsql IMMUTABLE STRICT
  COST 100;

CREATE OR REPLACE FUNCTION public._sys_trigger_card_prepare_record()
  RETURNS trigger AS
$BODY$ BEGIN
        IF NEW.id IS NULL OR NEW.id <= 0 THEN
            NEW.id = _sys_utils_new_card_id();
        END IF;
        
	--NEW."BeginDate" = now();	 
	RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

CREATE OR REPLACE FUNCTION public._sys_utils_name_to_regclass(_class_name character varying)
  RETURNS regclass AS
$BODY$ BEGIN
	_class_name = _sys_utils_name_escape(_class_name);
	IF (SELECT pg_get_function_arguments(oid) FROM pg_proc WHERE proname = 'to_regclass') = 'cstring' THEN
		RETURN to_regclass(_class_name::cstring);
	ELSE
		RETURN to_regclass(_class_name::text);
	END IF;
END $BODY$
  LANGUAGE plpgsql IMMUTABLE STRICT
  COST 100;

CREATE OR REPLACE FUNCTION public._sys_class_create(
    _class_name character varying)
  RETURNS regclass AS
$BODY$
BEGIN
	EXECUTE format('CREATE TABLE %s (id bigint NOT NULL DEFAULT _sys_utils_new_card_id(), CONSTRAINT "%s_pkey" PRIMARY KEY (id))', _sys_utils_name_escape(_class_name), _sys_utils_name_to_basename(_class_name));
	
	EXECUTE format('CREATE TRIGGER "_sys_card_prepare_record" BEFORE INSERT OR UPDATE ON %s FOR EACH ROW EXECUTE PROCEDURE _sys_trigger_card_prepare_record()', _sys_utils_name_to_regclass(_class_name));
    
	RETURN _sys_utils_name_to_regclass(_class_name);
END $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


/***************/
/** DATAMODEL  */
/***************/

SELECT _sys_class_create('Dipendente');
SELECT _sys_class_create('Agenda');
SELECT _sys_class_create('Cliente');

ALTER TABLE public."Dipendente"
  ADD nome varchar(100),
  ADD cognome varchar(100);

ALTER TABLE public."Agenda"
	ADD dipendente bigint REFERENCES public."Dipendente"(id),
	ADD data_inizio timestamptz,
	ADD data_fine timestamptz,
	ADD cliente bigint REFERENCES public."Cliente"(id);
	
ALTER TABLE public."Agenda"
    ADD CONSTRAINT fk_dipendente FOREIGN KEY (dipendente) REFERENCES public."Dipendente"(id),
    ADD CONSTRAINT fk_cliente FOREIGN KEY (cliente) REFERENCES public."Cliente"(id);
   
ALTER TABLE public."Cliente"
	ADD nome varchar(100),
	ADD indirizzo varchar(100);

