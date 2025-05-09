const jwt = require('jsonwebtoken');
const JWT_SECRET = "yasserhll123";

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: "Token manquant" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide" });
    }
};
