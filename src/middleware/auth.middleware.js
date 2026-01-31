const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    // Look for token in "Authorization: Bearer <TOKEN>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds user info (like borrowerId) to the request
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = authenticate;