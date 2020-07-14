const axios = require('axios');

module.exports = {
    validateCPF(cpf){
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpf.length < 11){
            throw { code: 10000, name: "CPF inválido" };
        }
        for (i = 0; i < cpf.length - 1; i++){
            if (cpf.charAt(i) != cpf.charAt(i + 1)){
                digitos_iguais = 0;
                break;
            }
        }
        if (!digitos_iguais){
            numeros = cpf.substring(0,9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--){
                soma += numeros.charAt(10 - i) * i;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0)){
                throw { code: 10000, name: "CPF inválido" };
            }
            numeros = cpf.substring(0,10);
            soma = 0;
            for (i = 11; i > 1; i--){
                soma += numeros.charAt(11 - i) * i;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)){
                throw { code: 10000, name: "CPF inválido" };
            }
            return true;
        }else{
            throw { code: 10000, name: "CPF inválido" };
        }
    },
    async validateEmail(email){

        user = email.substring(0, email.indexOf("@"));
        dom= email.substring(email.indexOf("@")+ 1, email.length);
        
        if  ((user.length >=1) &&
            (dom.length >=3) && 
            (user.search("@")==-1) && 
            (dom.search("@")==-1) &&
            (user.search(" ")==-1) && 
            (dom.search(" ")==-1) &&
            (dom.search(".")!=-1) &&      
            (dom.indexOf(".") >=1)&& 
            (dom.lastIndexOf(".") < dom.length - 1)) {

                //const apiKey = "at_OtTgrhULkixXNZpF5oX7eZ1QO7Amt";
                //const dataEmail = await axios.get(`https://emailverification.whoisxmlapi.com/api/v1?apiKey=${apiKey}&emailAddress=${email}`);
                
                //if (dataEmail.data.smtpCheck === 'true') {
                    return true;
                //}
                
        }
            throw { code: 10000, name: "Email inválido" };
    },
    async getAddress(address_zipcode){
        try {
            return (await axios.get(`https://viacep.com.br/ws/${address_zipcode}/json/`));
        }
        catch (err){
            throw { code: 10000, name: "CEP inválido" };
        }
    },

}