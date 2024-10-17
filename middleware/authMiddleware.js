exports.protect = (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: 'You are not authenticated' });
    next();
};

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission' });
        }
        next();
    };
};
