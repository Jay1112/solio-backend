const generateOTP = () => {
    const OTP_MIN = 111111, OTP_MAX = 999999;
    return Math.floor(Math.random() * (OTP_MAX - OTP_MIN + 1)) + OTP_MIN;
}

const getOTPExpiry = () => {
    const OTP_EXPIRY_DURATION = 15 * 60 * 1000 ;
    const expiryTime = Date.now() + OTP_EXPIRY_DURATION ;
    return expiryTime ;
}

export {
    generateOTP,
    getOTPExpiry
}