module.exports = function(sequelize, DataTypes) {
    var UserBeerType = sequelize.define('UserBeerType', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }
    }, {
      classMethods: {
        associate: function(models) {
          UserBeerType.belongsTo(models.User);
          UserBeerType.belongsTo(models.BeerStyle);
        }
      }
    });
  
    return UserBeerType;
  };