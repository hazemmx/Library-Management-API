const borrowerService = require("./borrowers.service");

const register = async (req, res) => {
  try {
    const borrower = await borrowerService.registerBorrower(req.body);
    res.status(201).json({
      success: true,
      message: "Borrower registered successfully",
      data: borrower,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        error: "Registration failed",
        message: "This email is already taken",
      });
    }
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await borrowerService.loginBorrower(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      data: {
        id: result.borrower.id,
        name: result.borrower.name,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Authentication failed",
      message: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { borrowers, totalCount } = await borrowerService.getAllBorrowers(
      limit,
      offset,
    );

    res.status(200).json({
      success: true,
      data: borrowers,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: borrowers.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve borrowers",
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const borrower = await borrowerService.updateBorrower(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Borrower updated successfully",
      data: borrower,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        error: "Update failed",
        message: "This email is already taken",
      });
    }
    res.status(400).json({
      success: false,
      error: "Update failed",
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const isDeleted = await borrowerService.deleteBorrower(req.params.id);

    // If isDeleted is false, the ID didn't exist in the DB
    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: `Deletion failed: No borrower found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Borrower with ID ${req.params.id} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Deletion failed",
      message: error.message,
    });
  }
};

module.exports = { register, list, login, update, remove };
