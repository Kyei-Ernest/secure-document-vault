-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    classification_level INT NOT NULL DEFAULT 1,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_version_id UUID,
    file_size BIGINT,
    mime_type VARCHAR(255),
    checksum_sha256 VARCHAR(64),
    tags TEXT[],
    metadata JSONB,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_classification CHECK (classification_level BETWEEN 1 AND 5)
);

CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_classification ON documents(classification_level);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_metadata ON documents USING GIN(metadata);

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();