const borrowerRepo = require("./borrowers.repository");
const jwt = require("jsonwebtoken");

const registerBorrower = async (userData) => {
  const { name, email } = userData;

  // 1. Check if email exists in request
  if (!email) {
    throw new Error("Email is required");
  }
  // 2. Email Validation Logic (Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format");
    error.statusCode = 400; // Bad Request
    throw error;
  }
  // 3. Optional: Check if name is provided
  if (!name || name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  return await borrowerRepo.register(name, email);
};
const loginBorrower = async (userData) => {
  // Changed param to 'userData'
  const { email } = userData; // Extract the email from the object

  // 1. Find borrower by email
  const borrower = await borrowerRepo.findByEmail(email);
  if (!borrower) {
    throw new Error("Borrower not found with this email");
  }

  // 2. Generate JWT
  const token = jwt.sign(
    { id: borrower.id, email: borrower.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  // Return the object containing both
  return { borrower, token };
};
const getAllBorrowers = async (limit, offset) => {
  return await borrowerRepo.findAll(limit, offset);
};

const updateBorrower = async (id, data) => {
  const { name, email } = data;

  // Optional: Re-run your email validation ONLY if email is provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  const updated = await borrowerRepo.update(id, name, email);
  if (!updated) throw new Error("Borrower not found");

  return updated;
};
const deleteBorrower = async (id) => {
  return await borrowerRepo.remove(id);
};

module.exports = {
  registerBorrower,
  getAllBorrowers,
  loginBorrower,
  updateBorrower,
  deleteBorrower,
};
