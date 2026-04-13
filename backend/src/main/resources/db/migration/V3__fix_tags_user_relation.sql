-- Dodanie kolumny user_id do tabeli tags
ALTER TABLE tags ADD COLUMN user_id UUID;

-- Przypisanie (opcjonalnie) istniejących tagów do pierwszego admina/użytkownika, jeśli baza nie jest pusta
-- UPDATE tags SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Ustawienie kolumny jako NOT NULL po migracji danych
ALTER TABLE tags ALTER COLUMN user_id SET NOT NULL;

-- Usunięcie starego ograniczenia unikalności na samej nazwie
ALTER TABLE tags DROP CONSTRAINT tags_name_key;

-- Dodanie klucza obcego do tabeli users
ALTER TABLE tags ADD CONSTRAINT fk_tag_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Dodanie unikalności na parę (name, user_id)
ALTER TABLE tags ADD CONSTRAINT uq_tag_name_user UNIQUE (name, user_id);