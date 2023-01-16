const {Schema, model} = require('mongoose');


const schema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      requires: true
   },
   roles:{
		type: String,
		ref: 'Role'
	}
},{
	timestamps: true
})

module.exports = model('User', schema);