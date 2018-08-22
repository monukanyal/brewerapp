module.exports = function(sequelize, DataTypes) {
  var BeerStyle = sequelize.define('BeerStyle', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        
      }
    }
  });

  return BeerStyle;
};