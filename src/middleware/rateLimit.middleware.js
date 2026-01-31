const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = rateLimit;

/**
 * Rate Limiting Middleware
 * Protects endpoints from abuse and brute force attacks
 */

// ============================================
// 1. LOGIN RATE LIMITER (Strict)
// ============================================
// Prevents brute force password attacks
// 5 login attempts per 15 minutes per IP

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests (only count failed login attempts)
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req),
    validate: { trustProxy: false }, // Only if you aren't using app.set('trust proxy')
});

// ============================================
// 2. CHECKOUT RATE LIMITER (Testable)
// ============================================
// Prevents users from checking out too many books at once
// 3 checkouts per 1 minute per IP
// Perfect for testing!

const checkoutLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Limit each IP to 3 checkout requests per minute
    message: {
        success: false,
        message: "You can only checkout 3 books per minute. Please wait before checking out more books.",
        retryAfter: "60 seconds",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Keybuilder: Use IP + user ID for authenticated requests
    keyGenerator: (req) => {
        const ip = ipKeyGenerator(req);

        if (req.user && req.user.id) {
            return `${ip}-user-${req.user.id}`;
        }

        return ip;
    },

    validate: { trustProxy: false }, // Only if you aren't using app.set('trust proxy')
});

// ============================================
// EXPORT ALL LIMITERS
// ============================================

module.exports = {
    loginLimiter,
    checkoutLimiter,
};