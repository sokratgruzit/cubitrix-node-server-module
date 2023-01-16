const auth = require('../services/auth.service');

async function register (req, res){
   try{
      console.log(req.body)
      const {email, password} = req.body;
      const result = await auth.register(email, password);
      
      return res.status(result.status).json({message: result.message});
   }catch(e){
      console.log(e)
      res.status(500).json({message: 'Something get wront, try again'});
   }
}

async function login (req, res){
   try{
      const {email, password} = req.body;
      const result = await auth.login(email, password);

      return res.status(result.status).json({token: result.token, userId: result.userId, message: result.message});
   }catch(e){
      console.log(e)
      res.status(500).json({message: 'Something get wront, try again'});
   }
}

async function getUsers(req,res){
   try{
      const users = await auth.getUsers();
      res.status(200).json(users);
   }catch(e){
      console.log(e)
      res.status(500).json({message: 'Something get wront, try again'})
   }
}

module.exports = {
   register,
   login,
   getUsers
 }  