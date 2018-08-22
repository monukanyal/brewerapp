module.exports = function(sequelize, DataTypes) {
  var Beer = sequelize.define('Beer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    picture: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
         Beer.hasMany(models.Beer_category);
      }
    }
  });

  return Beer;
};