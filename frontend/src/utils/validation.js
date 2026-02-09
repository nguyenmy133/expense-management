/**
 * Email validation utility
 * Validates email format using a strict regex pattern
 */

// Strict email validation regex
// Accepts: user@example.com, user.name@example.co.uk, user+tag@example.com
// Rejects: user@, @example.com, user@example, user@.com
export const EMAIL_REGEX = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

/**
 * Validates if the given email is in a valid format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }
    return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates email and returns an error message if invalid
 * @param {string} email - The email address to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return 'Email là bắt buộc';
    }

    if (!isValidEmail(email)) {
        return 'Vui lòng nhập địa chỉ email hợp lệ (ví dụ: user@example.com)';
    }

    return null;
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum password length (default: 6)
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validatePassword = (password, minLength = 6) => {
    if (!password) {
        return 'Mật khẩu là bắt buộc';
    }

    if (password.length < minLength) {
        return `Mật khẩu phải có ít nhất ${minLength} ký tự`;
    }

    return null;
};

/**
 * Validates if two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {string|null} - Error message if they don't match, null if they match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Mật khẩu xác nhận không khớp';
    }
    return null;
};
