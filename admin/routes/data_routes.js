const {Router} = require('express');
const router = Router();


router.get('/test' ,  (req, res) => {
   res.send("get some data");
});

module.exports = router; 