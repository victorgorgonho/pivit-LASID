const Exercise = require('../models/exercise');
const User = require('../models/user');

module.exports = {

  async store(req,res){
    try {
      const { userEmail } = req.body;

      if(!await User.findOne({email: userEmail}))
        return res.status(404).send({ error: 'Usuário não encontrado' });

      const exercise = await Exercise.create(req.body);

      return res.send({ exercise });
    } catch (error) {
      console.log(error);
      if (error.code == 10000) {   
        return res.status(400).send({ error: error.name });
      }else if (error.name == "ValidationError") {
        return res.status(400).send({ error: 'Informações incompletas' });
      }else{
        return res.status(500).send({ error: 'Ocorreu um erro ao cadastrar exercício, tente novamente' });
      }
    }
  },
  async index(req,res){
    try {
      const exercises = await Exercise.find({}, {passwordResetExpires: 0, __v: 0, data: 0});
  
      if (exercises.length == 0) {
        return res.send('Não há exercícios cadastrados');
      } else {
        return res.json(exercises);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: 'Falha ao listar exercícios' });
    }
  },
  async filterUser(req,res){
    try {
      const { userEmail } = req.body;

      if(!await User.findOne({email: userEmail}))
        return res.status(404).send({ error: 'Usuário não encontrado' });

      const exercise = await Exercise.find({userEmail});
      
      if(!exercise){
        return res.status(404).send({ error: 'Usuário não possui exercícios registrados' });
      }
      
      return res.json(exercise);
    } catch (error) {
        return res.status(500).send({ error: 'Falha ao filtrar exercícios' });
    }
  },
  async filterDate(req,res){
    try {
      const { date, userEmail } = req.body;
      const convertedDate = new Date(date);

      if(!await User.findOne({email: userEmail}))
        return res.status(404).send({ error: 'Usuário não encontrado' });
      
      const exercises = await Exercise.find({userEmail});

      if(!exercises)
        return res.status(404).send({ error: 'Usuário não possui exercícios registrados' });

      const filteredExercises = exercises.filter(exercise => {
        const exerciseDate = exercise.createdAt;
        
        if(convertedDate.getUTCFullYear() === exerciseDate.getUTCFullYear()){
          if(convertedDate.getUTCMonth() === exerciseDate.getUTCMonth()){
            if(convertedDate.getUTCDate() === exerciseDate.getUTCDate()){
              return exercise;
            }
          }
        }
      });

      return res.send({ filteredExercises });
    } catch (error) {
      return res.status(500).send({ message: 'Falha ao filtrar exercícios' });
  }

  },
  async update(req,res){
    try {
      const { userEmail } = req.body;

      if(!await User.findOne({email: userEmail}))
        return res.status(404).send({ error: 'Usuário não encontrado' });

      const exercise = await Exercise.findByIdAndUpdate(req.params.id,req.body,{new:true});

      if(!exercise){
        return res.status(404).send({ error: 'Exercício não encontrado' });
      }
      
      return res.json(exercise);
    } catch (error) {
      if (error.code == 10000) {   
        return res.status(400).send({ error: error.name });
      }else{
        return res.status(500).send({ error: 'Falha ao atualizar informações do exercício' });
      }
    }
  },
  async destroy(req,res){
    try {
      const exercise = await Exercise.findByIdAndRemove(req.params.id);
      
      if(!exercise){
        return res.status(404).send({ error: 'Exercício não encontrado' });
      }

      return res.send('Removido');
    } catch (error) {
      if (error.name == "CastError"){
        return res.status(404).send({ error: 'Exercício não encontrado' });
      }else{
        return res.status(500).send({ error: 'Falha ao deletar exercício' });
      }
    }
  }
};