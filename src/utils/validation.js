export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validatePassword = (password) => {
    // Min 6 chars, at least one number
    const hasNumber = /\d/;
    return password.length >= 6 && hasNumber.test(password);
};
