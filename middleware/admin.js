function admin(req, res, next) {
    if (!req.merchant.isAdmin) return res.status(403).send(`Access denied.`);

    return next();
}

module.exports = admin;