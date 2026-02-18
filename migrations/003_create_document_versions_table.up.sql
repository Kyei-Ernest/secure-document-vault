-- Document versions table
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    storage_path VARCHAR(1000) NOT NULL,
    encryption_key_id VARCHAR(255) NOT NULL,
    encryption_iv BYTEA NOT NULL,
    encryption_auth_tag BYTEA NOT NULL,
    file_size BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    comment TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_version_per_doc UNIQUE(document_id, version_number)
);

CREATE INDEX idx_versions_document ON document_versions(document_id);
CREATE INDEX idx_versions_created_at ON document_versions(created_at);
CREATE INDEX idx_versions_is_current ON document_versions(is_current);

-- Add foreign key from documents to current version
ALTER TABLE documents
ADD CONSTRAINT fk_documents_current_version
FOREIGN KEY (current_version_id) REFERENCES document_versions(id);