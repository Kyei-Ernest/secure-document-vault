-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_type VARCHAR(50) NOT NULL,
    granted_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_permission CHECK (permission_type IN ('read', 'write', 'delete', 'share', 'download')),
    CONSTRAINT unique_user_doc_permission UNIQUE(document_id, user_id, permission_type)
);

CREATE INDEX idx_permissions_document ON permissions(document_id);
CREATE INDEX idx_permissions_user ON permissions(user_id);
CREATE INDEX idx_permissions_expires ON permissions(expires_at);