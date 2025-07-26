ALTER TABLE users ADD COLUMN preferences text;

UPDATE users SET preferences = '{"timezone": "Europe/Rome", "language": "en"}' WHERE preferences IS NULL;

CREATE TABLE lkp_timezone (
    code VARCHAR(100) PRIMARY KEY, -- Codice del timezone (es. Europe/Rome)
    description VARCHAR(150) NOT NULL, -- Descrizione leggibile (es. "Rome, Italy (UTC+1)")
    offset_utc VARCHAR(20) NOT NULL -- Offset UTC (es. '1 hour')
);

INSERT INTO lkp_timezone (code, description, offset_utc)
SELECT 
    name, 
    concat(name, ' (GMT', LEFT(
        CASE 
            WHEN utc_offset::varchar ~ '-.*' THEN utc_offset::varchar 
            ELSE '+' || utc_offset::varchar 
        END, 
        -3
    ), ')'),
    utc_offset::varchar
FROM pg_catalog.pg_timezone_names 
WHERE name !~ 'posix.*'
ORDER BY utc_offset;

-- Add the dtstart_tz column to store the timezone for dtStart
ALTER TABLE event ADD COLUMN dtstart_tz VARCHAR(100);

-- Add the dtend_tz column to store the timezone for dtEnd
ALTER TABLE event ADD COLUMN dtend_tz VARCHAR(100);

ALTER TABLE ONLY public.event
    ADD CONSTRAINT fkpej6559oudkt8uy7xf31qvert FOREIGN KEY (dtstart_tz) REFERENCES public.lkp_timezone(code);

ALTER TABLE ONLY public.event
    ADD CONSTRAINT fkpej6559oudkt8uy7xf31ewqr FOREIGN KEY (dtend_tz) REFERENCES public.lkp_timezone(code);

-- Update existing events to set the timezone to Europe/Rome if not already set
UPDATE event SET
    dtstart_tz = 'Europe/Rome',
    dtend_tz = 'Europe/Rome'
WHERE dtstart_tz IS NULL OR dtend_tz IS NULL;