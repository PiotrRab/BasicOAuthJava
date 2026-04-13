-- Tabela Sal
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    perimeter TEXT, -- Przechowujemy listę punktów jako JSON: [{"x":0, "y":0}, ...]
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_room_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela Stołów
CREATE TABLE tables (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    name VARCHAR(255),
    shape VARCHAR(50) NOT NULL, -- 'ROUND', 'RECTANGLE'
    width DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    pos_x DOUBLE PRECISION NOT NULL,
    pos_y DOUBLE PRECISION NOT NULL,
    rotation DOUBLE PRECISION DEFAULT 0,
    capacity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_table_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Dodanie powiązania gościa ze stołem
ALTER TABLE guests ADD COLUMN table_id UUID;
ALTER TABLE guests ADD CONSTRAINT fk_guest_table FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL;
