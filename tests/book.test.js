const request = require("supertest");
const app = require("../src/app"); // Path to your Express app

describe("Books API Endpoints", () => {
    // Test 1: Get All Books
    it("should fetch all books", async() => {
        const res = await request(app).get("/api/books");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // Test 2: Validation Check (Adding a book with missing fields)
    it("should fail to add a book with missing title", async() => {
        const res = await request(app).post("/api/books").send({
            author: "Test Author",
            isbn: "12345",
            // Title is missing!
        });

        expect(res.statusCode).toEqual(400); // Or 422 depending on your validation
        expect(res.body).toHaveProperty("success", false);
    });
});