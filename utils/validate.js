

export const validate = {
    containsSpecialChars: ({ string }) => {
        const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const errMsg = (specialChars.test(string) && 'Special characters are not allowed!')
        return { errMsg };
    },
    noEmptyString: ({ string }) => {
        const errMsg = (!string && 'This field is required.')
        return { errMsg };
    },
    username: ({ username }) => {
        const errMsg = (!username && 'Please provide a username for your account.') || (username.replace(/ /g, '').length < 5 && 'Username should be minimum of 5 characters.')
        return { errMsg };
    },
    email: ({ email }) => {
        // eslint-disable-next-line
        const validateEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const errMsg = (!email && 'Please provide your email address.') || (!validateEmail.test(email) && 'Email address is invalid!');
        return { errMsg };
    },
    password: ({ password }) => {
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

        let passwordStrength, passwordStrengthAdvice;
        if (strongPassword.test(password)) {
            passwordStrengthAdvice = undefined
            passwordStrength = 1;
        } else if (mediumPassword.test(password)) {
            passwordStrength = 0;
            passwordStrengthAdvice = 'Password should contain at least a capital and lowercase letter, a number, and a special characters and must be 8 characters long.'
        } else {
            passwordStrength = -1;
            passwordStrengthAdvice = 'Password should contain at least a capital and lowercase letter, a number, and a special character and must be 8 characters long.'
        }

        const errMsg = (!password && 'Set a password for your account.') || (password.length < 8 && 'Password must be at least 8 characters')
        return { passwordStrength, passwordStrengthAdvice, errMsg };
    },
    confirmpassword: ({ password, cpassword }) => {
        const errMsg = (!cpassword && 'Repeat your password here.') || (password !== cpassword && 'Password and Confirm Password don\'t match');
        return { errMsg };
    },

    file: ({ fileType, types, reject }) => {
        const errMsg = reject ? types.includes(fileType) : !types.includes(fileType);
        return { errMsg };
    }
}