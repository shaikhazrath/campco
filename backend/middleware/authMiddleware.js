import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

export default verifyToken;
