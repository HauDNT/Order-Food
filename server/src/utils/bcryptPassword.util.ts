import bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (error) {
        console.log("Error when hashing password: ", error);
    }
}

