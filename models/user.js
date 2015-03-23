var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  local : {
    username     : String,
    password     : String
  }
});

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);