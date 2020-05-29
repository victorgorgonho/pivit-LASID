require('dotenv').config();
const fetch = require('isomorphic-fetch');

module.exports = {
    async handleSend (req, res) {
        try {
            const secret_key = process.env.CAPTCHA_SECRET_KEY;
            const token = req.body.token;
            const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
        
            fetch(url, {
                method: 'post'
            })
                .then(response => response.json())
                .then(google_response => res.json({ google_response }))
                .catch(error => res.json({ error }));
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: 'Não foi possível processar captcha' });
        }
    }
};