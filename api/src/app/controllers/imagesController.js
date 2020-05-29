const Post = require('../models/post');

module.exports = {
    async store (req,res){
        try{
            if(!req.file)
                return res.status(400).send({ error: 'Imagem não recebida'});

            const { originalname: name, size, key, location: url = '' } = req.file;

            if(!name || !size || !key || !url)
                return res.status(400).send({ error: 'Não foi possível extrair informações da imagem'});

            const post = await Post.create({
                name,
                size,
                key,
                url
            });

            return res.json(post);
        }catch(error){
            if(error.name == 'ValidationError')
                return res.status(400).send({ error: 'Informações incompletas'});
            
            return res.status(500).send({ error: 'Falha ao armazenar imagem'});
        }
    },

    async index (req,res){
        try{
            const posts = await Post.find();

            if(!posts)
                return res.status(404).send({ error: 'Nenhuma imagem encontrada'});

            return res.json(posts);
        } catch(error){
            return res.status(500).send({ error: 'Falha ao carregar imagens'});
        }
    },

    async find (req,res){
        try{
            const { url } = req.body;

            if(!url)
                return res.status(400).send({ error: 'Informações incompletas'});

            const post = await Post.findOne({ url: url});

            if(!post)
                return res.status(404).send({ error: 'Imagem não encontrada'});

            res.json(post);
        }catch(error){
            return res.status(500).send({ error: 'Falha ao buscar imagem'});
        }
    },

    async destroy(req,res){
        try{
            const post = await Post.findById(req.params.id);

            if(!post)
                return res.status(404).send({ error: 'Imagem não encontrada'});
            
            await post.remove();

            return res.send();
        }catch(error){
            return res.status(500).send({ error: 'Falha ao remover imagem'});
        }
    }
};