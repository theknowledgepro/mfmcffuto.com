const jwt = require('jsonwebtoken');
const { RESET_PASSWORD_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
const ExpiresIn = {
    PasswordResetToken: {
        jwtValue: '10h',
        milliseconds: 10 * 60 * 1000,
        string: '10 minutes'
    },
    AccessToken: {
        jwtValue: '1d',
        milliseconds: 1 * 24 * 60 * 60 * 1000,
        string: '1 day'
    },
    RefreshToken: {
        jwtValue: '3d',
        milliseconds: 3 * 24 * 60 * 60 * 1000,
        string: '3 days'
    },

}

const createPasswordResetToken = (payload) => {
    return jwt.sign(payload, RESET_PASSWORD_TOKEN_SECRET, { expiresIn: ExpiresIn.PasswordResetToken.jwtValue })
}

const createAccessToken = (payload) => {
    return jwt.sign({ _id: payload._id, member_role: payload.member_role, url: payload.url }, ACCESS_TOKEN_SECRET, { expiresIn: ExpiresIn.AccessToken.jwtValue });
}

const createRefreshToken = (payload) => {
    return jwt.sign({ _id: payload._id, member_role: payload.member_role, url: payload.url }, REFRESH_TOKEN_SECRET, { expiresIn: ExpiresIn.RefreshToken.jwtValue });
}

module.exports = {
    ExpiresIn,
    createPasswordResetToken,
    createAccessToken,
    createRefreshToken
}