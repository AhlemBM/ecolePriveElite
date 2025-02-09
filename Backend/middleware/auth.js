/*const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied" });
        }
        req.user = decoded; // Attache l'utilisateur décodé à la requête
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
};
*/
