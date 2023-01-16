const {Router} = require('express');
const router = Router();

const AuthMiddleware = require('../middlewares/auth.middlware');

router.get('/test' ,  (req, res) => {
   res.send("get some data");
});

module.exports = router; 