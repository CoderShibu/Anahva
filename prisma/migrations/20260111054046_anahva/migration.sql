-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'EN',
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "journals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "encrypted_payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "allow_ai_memory" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    CONSTRAINT "journals_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "memories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "embedding_vector" TEXT NOT NULL,
    "memory_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME,
    CONSTRAINT "memories_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'LISTEN',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "insights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "insight_type" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "insights_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "safety_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "consent_given" BOOLEAN NOT NULL,
    "consent_at" DATETIME,
    "flags" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "safety_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT,
    "event_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_id_key" ON "sessions"("session_id");

-- CreateIndex
CREATE INDEX "sessions_session_id_idx" ON "sessions"("session_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "journals_session_id_idx" ON "journals"("session_id");

-- CreateIndex
CREATE INDEX "journals_created_at_idx" ON "journals"("created_at");

-- CreateIndex
CREATE INDEX "memories_session_id_idx" ON "memories"("session_id");

-- CreateIndex
CREATE INDEX "memories_expires_at_idx" ON "memories"("expires_at");

-- CreateIndex
CREATE INDEX "chat_sessions_session_id_idx" ON "chat_sessions"("session_id");

-- CreateIndex
CREATE INDEX "insights_session_id_idx" ON "insights"("session_id");

-- CreateIndex
CREATE INDEX "insights_created_at_idx" ON "insights"("created_at");

-- CreateIndex
CREATE INDEX "safety_events_session_id_idx" ON "safety_events"("session_id");

-- CreateIndex
CREATE INDEX "safety_events_created_at_idx" ON "safety_events"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_session_id_idx" ON "audit_logs"("session_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_event_type_idx" ON "audit_logs"("event_type");
