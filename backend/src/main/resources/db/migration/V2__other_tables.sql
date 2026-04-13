CREATE TABLE events (
                        id UUID PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        date VARCHAR(255),
                        user_id UUID NOT NULL,

                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Klucz obcy do tabeli users (jeśli usuniemy usera, usuną się jego wydarzenia)
                        CONSTRAINT fk_event_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tworzenie tabeli gości (guests)
CREATE TABLE guests (
                        id UUID PRIMARY KEY,
                        first_name VARCHAR(255) NOT NULL,
                        last_name VARCHAR(255) NOT NULL,
                        user_id UUID NOT NULL,

                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Klucz obcy do tabeli users
                        CONSTRAINT fk_guest_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tworzenie słownika tagów (tags)
CREATE TABLE tags (
                      id UUID PRIMARY KEY,
                      name VARCHAR(255) NOT NULL UNIQUE,

                      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABELE POŚREDNIE (MANY-TO-MANY)
-- ==========================================

-- Tabela pośrednia: Wydarzenia <-> Goście
CREATE TABLE event_guests (
                              event_id UUID NOT NULL,
                              guest_id UUID NOT NULL,

    -- Złożony klucz główny (zapobiega dodaniu tego samego gościa dwa razy do jednego wydarzenia)
                              PRIMARY KEY (event_id, guest_id),

                              CONSTRAINT fk_eg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                              CONSTRAINT fk_eg_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE
);

-- Tabela pośrednia: Goście <-> Tagi (GuestTags)
CREATE TABLE guest_tags (
                            guest_id UUID NOT NULL,
                            tag_id UUID NOT NULL,

    -- Złożony klucz główny
                            PRIMARY KEY (guest_id, tag_id),

                            CONSTRAINT fk_gt_guest FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
                            CONSTRAINT fk_gt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);