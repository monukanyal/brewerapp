module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    dob: {
      type: DataTypes.DATE
    },
    isverify: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    profilepicture:{
      type: DataTypes.STRING,
      allowNull:true
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    latitude:{
      type: DataTypes.STRING,
      allowNull:true
    },
    longitude:{
      type: DataTypes.STRING,
      allowNull:true
    },
    confirmation_key:{
      type: DataTypes.STRING,
      allowNull:true
    },
    forgettoken:{
      type: DataTypes.STRING,
      allowNull:true
    }


  }, {
    classMethods: {
      associate: function(models) {
         User.hasMany(models.UserBeerType);
      }
    }
  });

  return User;
};