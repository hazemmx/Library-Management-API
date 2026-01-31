const borrowerService = require("./borrowers.service");

const register = async(req, res) => {
    try {
        const borrower = await borrowerService.registerBorrower(req.body);
        res.status(201).json(borrower); // creation success status code
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async(req, res) => {
    try {
        // This passes the whole body { email: "..." } to the service
        const result = await borrowerService.loginBorrower(req.body);

        // Destructure the result to send a clean response
        res.status(200).json({
            message: "Login successful",
            token: result.token,
            borrower: {
                id: result.borrower.id,
                name: result.borrower.name,
            },
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
const list = async(req, res) => {
    try {
        const borrowers = await borrowerService.getAllBorrowers();
        res.status(200).json(borrowers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async(req, res) => {
    try {
        const borrower = await borrowerService.updateBorrower(
            req.params.id,
            req.body,
        );
        res.status(200).json(borrower);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async(req, res) => {
    try {
        await borrowerService.deleteBorrower(req.params.id);
        res.status(204).send(); // 204 means "No Content" (Successful delete)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, list, login, update, remove };