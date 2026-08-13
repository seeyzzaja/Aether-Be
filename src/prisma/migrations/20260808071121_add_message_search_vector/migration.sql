-- Rename search vector column to match the database design
ALTER TABLE "messages"
RENAME COLUMN "searchVector" TO "search_vector";

-- Create function to maintain the full-text search vector
CREATE FUNCTION "messages_search_vector_update"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" :=
    to_tsvector('indonesian', COALESCE(NEW."content", ''));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and content UPDATE
CREATE TRIGGER "messages_search_vector_trigger"
BEFORE INSERT OR UPDATE OF "content"
ON "messages"
FOR EACH ROW
EXECUTE FUNCTION "messages_search_vector_update"();