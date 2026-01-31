const db = require("./db");

const seedDatabase = async() => {
    try {
        console.log(
            "🌱 Starting database seeding with comprehensive analytical cases...",
        );

        // 1. Clear existing data
        await db.query(
            "TRUNCATE TABLE borrowings, books, borrowers RESTART IDENTITY CASCADE",
        );
        console.log("✅ Cleared existing data");

        // 2. Insert Books (Expanded collection)
        const booksQuery = `
      INSERT INTO books (title, author, isbn, available_quantity, shelf_location)
      VALUES 
        -- Fiction
        ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 'A-12'),
        ('1984', 'George Orwell', '9780451524935', 4, 'A-15'),
        ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 6, 'A-18'),
        ('Pride and Prejudice', 'Jane Austen', '9780141439518', 3, 'A-21'),
        ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 4, 'A-24'),
        
        -- Fantasy
        ('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 7, 'B-01'),
        ('Harry Potter and the Sorcerer Stone', 'J.K. Rowling', '9780590353427', 8, 'B-05'),
        ('The Lord of the Rings', 'J.R.R. Tolkien', '9780544003415', 5, 'B-10'),
        
        -- Technical/Programming
        ('Clean Code', 'Robert C. Martin', '9780132350884', 3, 'T-05'),
        ('The Pragmatic Programmer', 'Andrew Hunt', '9780135957059', 4, 'T-08'),
        ('Design Patterns', 'Gang of Four', '9780201633612', 3, 'T-12'),
        ('JavaScript: The Good Parts', 'Douglas Crockford', '9780596517748', 5, 'T-15'),
        
        -- Science/Non-fiction
        ('Sapiens', 'Yuval Noah Harari', '9780062316097', 6, 'S-03'),
        ('Educated', 'Tara Westover', '9780399590504', 4, 'S-07'),
        ('The Immortal Life of Henrietta Lacks', 'Rebecca Skloot', '9781400052189', 3, 'S-11')
      RETURNING id, title;
    `;

        const bookRes = await db.query(booksQuery);
        const books = bookRes.rows;
        console.log(`✅ Inserted ${books.length} books`);

        // 3. Insert Borrowers (Diverse set)
        const borrowersQuery = `
      INSERT INTO borrowers (name, email)
      VALUES 
        ('John Doe', 'john.doe@example.com'),
        ('Jane Smith', 'jane.smith@example.com'),
        ('Alice Johnson', 'alice.johnson@example.com'),
        ('Bob Wilson', 'bob.wilson@example.com'),
        ('Carol Martinez', 'carol.martinez@example.com'),
        ('David Lee', 'david.lee@example.com'),
        ('Emma Brown', 'emma.brown@example.com'),
        ('Frank Garcia', 'frank.garcia@example.com'),
        ('Grace Taylor', 'grace.taylor@example.com'),
        ('Henry Anderson', 'henry.anderson@example.com')
      RETURNING id, name;
    `;

        const borrowerRes = await db.query(borrowersQuery);
        const borrowers = borrowerRes.rows;
        console.log(`✅ Inserted ${borrowers.length} borrowers`);

        // 4. Insert Analytical Borrowing Cases
        // Reference date: January 2026 (last month from current perspective: Feb 2026)
        // Books: $1-$15 (15 books)
        // Borrowers: $16-$25 (10 borrowers: John=$16, Jane=$17, Alice=$18, Bob=$19, Carol=$20, David=$21, Emma=$22, Frank=$23, Grace=$24, Henry=$25)
        const borrowingsQuery = `
      INSERT INTO borrowings (book_id, borrower_id, checkout_date, due_date, return_date)
      VALUES 
        -- ========================================
        -- CASE 1: RETURNED ON TIME (8 books)
        -- These increase success rate, show good library usage
        -- ========================================
        ($1, $16, '2026-01-02 09:00:00', '2026-01-16 09:00:00', '2026-01-15 14:30:00'),  -- Gatsby, John
        ($2, $17, '2026-01-03 10:15:00', '2026-01-17 10:15:00', '2026-01-16 11:00:00'),  -- 1984, Jane
        ($6, $18, '2026-01-04 11:30:00', '2026-01-18 11:30:00', '2026-01-17 16:20:00'),  -- Hobbit, Alice
        ($9, $19, '2026-01-05 13:00:00', '2026-01-19 13:00:00', '2026-01-18 10:45:00'),  -- Clean Code, Bob
        ($13, $20, '2026-01-06 14:20:00', '2026-01-20 14:20:00', '2026-01-19 13:15:00'), -- Sapiens, Carol
        ($3, $21, '2026-01-08 09:45:00', '2026-01-22 09:45:00', '2026-01-21 15:00:00'),  -- Mockingbird, David
        ($10, $22, '2026-01-09 10:00:00', '2026-01-23 10:00:00', '2026-01-22 12:30:00'), -- Pragmatic Programmer, Emma
        ($14, $23, '2026-01-10 11:15:00', '2026-01-24 11:15:00', '2026-01-23 09:00:00'), -- Educated, Frank

        -- ========================================
        -- CASE 2: RETURNED LATE (5 books)
        -- These show up in overdue reports, affect success metrics
        -- ========================================
        ($4, $16, '2026-01-03 10:00:00', '2026-01-10 10:00:00', '2026-01-14 11:00:00'),  -- Pride & Prejudice, John (returned late)
        ($7, $24, '2026-01-05 09:30:00', '2026-01-12 09:30:00', '2026-01-16 14:20:00'),  -- Harry Potter, Grace
        ($11, $17, '2026-01-07 14:00:00', '2026-01-14 14:00:00', '2026-01-18 10:30:00'), -- Design Patterns, Jane
        ($15, $25, '2026-01-08 11:00:00', '2026-01-15 11:00:00', '2026-01-20 16:45:00'), -- Henrietta Lacks, Henry
        ($12, $18, '2026-01-09 13:30:00', '2026-01-16 13:30:00', '2026-01-22 09:15:00'), -- JavaScript, Alice

        -- ========================================
        -- CASE 3: CURRENTLY OVERDUE (6 books)
        -- These are CRITICAL - still not returned, past due date
        -- Will show in overdue exports with days overdue calculation
        -- ========================================
        ($5, $19, '2026-01-05 10:00:00', '2026-01-19 10:00:00', NULL),  -- Catcher in the Rye, Bob (OVERDUE)
        ($8, $20, '2026-01-08 11:30:00', '2026-01-22 11:30:00', NULL),  -- Lord of the Rings, Carol (OVERDUE)
        ($1, $21, '2026-01-10 09:00:00', '2026-01-24 09:00:00', NULL),  -- Gatsby, David (OVERDUE)
        ($2, $22, '2026-01-12 14:00:00', '2026-01-26 14:00:00', NULL),  -- 1984, Emma (OVERDUE)
        ($9, $23, '2026-01-14 10:30:00', '2026-01-28 10:30:00', NULL),  -- Clean Code, Frank (OVERDUE)
        ($13, $24, '2026-01-15 13:00:00', '2026-01-29 13:00:00', NULL), -- Sapiens, Grace (OVERDUE)

        -- ========================================
        -- CASE 4: CURRENTLY BORROWED - NOT OVERDUE (4 books)
        -- These are active borrowings, still within due date
        -- Good for showing active vs overdue differentiation
        -- ========================================
        ($6, $25, '2026-01-20 09:00:00', '2026-02-03 09:00:00', NULL),  -- Hobbit, Henry (Active)
        ($10, $16, '2026-01-22 10:30:00', '2026-02-05 10:30:00', NULL), -- Pragmatic Programmer, John (Active)
        ($14, $17, '2026-01-25 14:15:00', '2026-02-08 14:15:00', NULL), -- Educated, Jane (Active)
        ($3, $18, '2026-01-28 11:00:00', '2026-02-11 11:00:00', NULL),  -- Mockingbird, Alice (Active)

        -- ========================================
        -- CASE 5: PREVIOUS MONTH DATA (December 2025)
        -- These should NOT appear in "last month" reports
        -- Good for testing date filtering accuracy
        -- ========================================
        ($7, $19, '2025-12-10 10:00:00', '2025-12-24 10:00:00', '2025-12-23 15:00:00'),  -- Harry Potter, Bob (Dec)
        ($11, $20, '2025-12-15 09:30:00', '2025-12-29 09:30:00', '2025-12-28 14:30:00'), -- Design Patterns, Carol (Dec)
        ($12, $21, '2025-12-20 11:00:00', '2026-01-03 11:00:00', '2026-01-02 10:00:00'), -- JavaScript, David (Dec checkout, Jan return)

        -- ========================================
        -- CASE 6: FUTURE MONTH DATA (February 2026)
        -- These should NOT appear in "last month" reports
        -- Additional boundary testing
        -- ========================================
        ($4, $22, '2026-02-01 10:00:00', '2026-02-15 10:00:00', NULL),  -- Pride & Prejudice, Emma (Feb)
        ($15, $23, '2026-02-05 14:00:00', '2026-02-19 14:00:00', NULL); -- Henrietta Lacks, Frank (Feb)
    `;

        await db.query(
            borrowingsQuery,
            books.map((b) => b.id).concat(borrowers.map((b) => b.id)),
        );
        console.log("✅ Inserted borrowing records");

        // 5. Update book quantities to reflect currently borrowed books
        // Books that are currently out (Cases 3 & 4): total 10 books
        const currentlyBorrowedBooks = [
            books[4].id, // Pride and Prejudice
            books[7].id, // Harry Potter
            books[0].id, // Great Gatsby (borrowed twice in Case 3)
            books[1].id, // 1984
            books[8].id, // Clean Code
            books[12].id, // Sapiens (borrowed twice)
            books[5].id, // The Hobbit (borrowed twice in Case 4)
            books[9].id, // Pragmatic Programmer
            books[13].id, // Educated
            books[2].id, // To Kill a Mockingbird
        ];

        for (const bookId of currentlyBorrowedBooks) {
            await db.query(
                "UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1", [bookId],
            );
        }
        console.log("✅ Updated book availability");

        // 6. Display Analytics Summary
        console.log("\n📊 DATABASE SEEDING SUMMARY");
        console.log("═══════════════════════════════════════════════");
        console.log(`📚 Total Books: ${books.length}`);
        console.log(`👥 Total Borrowers: ${borrowers.length}`);
        console.log("\n📈 BORROWING ANALYTICS (January 2026):");
        console.log("  ✅ Returned on time:        8 books");
        console.log("  ⚠️  Returned late:          5 books");
        console.log("  🚨 Currently overdue:       6 books");
        console.log("  📖 Active (not overdue):    4 books");
        console.log("  📅 December 2025 data:      3 books (for testing)");
        console.log("  🔮 February 2026 data:      2 books (for testing)");
        console.log("\n💡 KEY METRICS FOR REPORTS:");
        console.log("  • Total Jan 2026 borrowings: 23");
        console.log("  • Return rate: ~56.5% (13/23 returned)");
        console.log("  • Overdue rate: ~26% (6/23 overdue)");
        console.log("  • On-time return rate: ~61.5% (8/13 returned on time)");
        console.log("\n🎯 TEST SCENARIOS COVERED:");
        console.log("  ✓ Export last month borrowings (should show 23 records)");
        console.log("  ✓ Export last month overdue (should show 6 records)");
        console.log("  ✓ Export custom period (flexible date range testing)");
        console.log("  ✓ Date boundary testing (Dec/Jan/Feb edge cases)");
        console.log("  ✓ Status calculation (Active vs Overdue vs Returned)");
        console.log("  ✓ Multiple borrowers per book scenario");
        console.log("  ✓ Book availability tracking");
        console.log("═══════════════════════════════════════════════");
        console.log("🌟 Seeding completed successfully!\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding database:", err);
        console.error(err.stack);
        process.exit(1);
    }
};

seedDatabase();