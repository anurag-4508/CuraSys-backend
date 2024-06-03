export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();

    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    res
        .status(statusCode)
        .cookie(cookieName, token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            
            //for development use this 
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'None', 

            //for deployment use this
            secure:true,
            sameSite:"None"
        })
        .json({
            success: true,
            message,
            user,
            token,
        });
};
