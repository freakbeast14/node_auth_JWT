const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: 'string',
        required: [true, "Enter an email"],
        unique: true,
        validate: [isEmail, "Enter a valid email" ]
    },
    password: {
        type: 'string',
        required: [true, "Enter a password"],
        minlength: [6, "Please enter at least 6 characters"]
    }
});

//fire after user info saved
// UserSchema.post('save', function(doc, next){
//     console.log('new user created and saved', doc);
//     next();
// })

//fire before user info saved
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static login function login
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };



const User = mongoose.model('user', UserSchema);

module.exports = User;