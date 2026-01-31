-- Basic Search
CREATE INDEX idx_book_isbn ON books(isbn);
CREATE INDEX idx_book_title ON books(title);
CREATE INDEX idx_book_author ON books(author);

-- Relational Lookups 
CREATE INDEX idx_borrowing_book_id ON borrowings(book_id);
CREATE INDEX idx_borrowing_borrower_id ON borrowings(borrower_id);

-- Reporting Lookups
CREATE INDEX idx_borrowing_status ON borrowings(return_date) WHERE return_date IS NULL;