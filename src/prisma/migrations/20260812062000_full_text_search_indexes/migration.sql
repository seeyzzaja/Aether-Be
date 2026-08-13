-- ============================================================
-- T11.1 Full Text Search
-- Trigger + GIN index + backfill
-- ============================================================

-- ============================================================
-- Messages
-- Existing T6.1 trigger already maintains search_vector.
-- ============================================================

UPDATE "messages"
SET "search_vector" =
  to_tsvector(
    'indonesian',
    COALESCE("content", '')
  );

CREATE INDEX "messages_search_vector_gin_idx"
ON "messages"
USING GIN ("search_vector");


-- ============================================================
-- Servers
-- ============================================================

CREATE FUNCTION "servers_search_vector_update"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" :=
    to_tsvector(
      'indonesian',
      COALESCE(NEW."name", '')
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "servers_search_vector_trigger"
BEFORE INSERT OR UPDATE OF "name"
ON "Server"
FOR EACH ROW
EXECUTE FUNCTION "servers_search_vector_update"();

UPDATE "Server"
SET "search_vector" =
  to_tsvector(
    'indonesian',
    COALESCE("name", '')
  );

CREATE INDEX "Server_search_vector_gin_idx"
ON "Server"
USING GIN ("search_vector");


-- ============================================================
-- Channels
-- name = weight A
-- topic = weight B
-- ============================================================

CREATE FUNCTION "channels_search_vector_update"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" :=
    setweight(
      to_tsvector(
        'indonesian',
        COALESCE(NEW."name", '')
      ),
      'A'
    )
    ||
    setweight(
      to_tsvector(
        'indonesian',
        COALESCE(NEW."topic", '')
      ),
      'B'
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "channels_search_vector_trigger"
BEFORE INSERT OR UPDATE OF "name", "topic"
ON "channels"
FOR EACH ROW
EXECUTE FUNCTION "channels_search_vector_update"();

UPDATE "channels"
SET "search_vector" =
  setweight(
    to_tsvector(
      'indonesian',
      COALESCE("name", '')
    ),
    'A'
  )
  ||
  setweight(
    to_tsvector(
      'indonesian',
      COALESCE("topic", '')
    ),
    'B'
  );

CREATE INDEX "channels_search_vector_gin_idx"
ON "channels"
USING GIN ("search_vector");
