const {Router} = require('express');
const router = Router();

const AuthMiddleware = require('../middlewares/auth.middlware');

router.get('/test' , AuthMiddleware,  (req, res) => {
   res.send("if you get this message , you are autorized");
});

module.exports = router; 