

class Validator{
    invalidEmailMessage: string = "Write valid email"
    invalidPasswordMessage: string = "Password should contains of minimum 8 characters, including \
        big letter, small letter, digit and special character"
    invalidVerificationCodeMessage: string = "Verification code should contains of exactly 8 digits"


    validateEmail = (email: string) => {
        
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    };

    validatePassword = (password: string) => {
        
        if (! this.checkMinLength(password, 8))
            return false
        else if(!this.checkContainsSmallLetter(password))
            return false
        else if(!this.checkContainsUpperLetter(password))
            return false
        else if(!this.checkContainsDigit(password))
            return false
        else if(!this.checkContainsSpecialCharacter(password))
            return false       

        return true
    };

    validateVerificationCode = (code: string) => {
        if(code.length !== 8)
            return false
        if(! (/^\d+$/.test(code)))
            return false
        return true
    }
      
    checkMinLength = (text: string, minLength: number) => {
        return text.length >= minLength;
    };

    checkContainsSmallLetter = (text: string) => {
        return /[a-z]/.test(text);
    };
    
    checkContainsUpperLetter = (text: string) => {
    return /[A-Z]/.test(text);
    };

    checkContainsDigit = (text: string) => {
    return /[0-9]/.test(text);
    };

    checkContainsSpecialCharacter = (text: string) => {
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(text)
    }
}
export default new Validator()