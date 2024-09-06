export function validarSenha(senha: string): { isValid: boolean, errorMessage: string } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumber = /\d/.test(senha);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    if (senha.length < minLength) {
        return { isValid: false, errorMessage: `A senha deve ter pelo menos ${minLength} caracteres.` };
    }
    if (!hasUpperCase) {
        return { isValid: false, errorMessage: "A senha deve conter pelo menos uma letra maiúscula." };
    }
    if (!hasLowerCase) {
        return { isValid: false, errorMessage: "A senha deve conter pelo menos uma letra minúscula." };
    }
    if (!hasNumber) {
        return { isValid: false, errorMessage: "A senha deve conter pelo menos um número." };
    }
    if (!hasSpecialChar) {
        return { isValid: false, errorMessage: "A senha deve conter pelo menos um caractere especial." };
    }
    return { isValid: true, errorMessage: "" };
}
