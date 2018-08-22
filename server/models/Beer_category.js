module.exports = function(sequelize, DataTypes) {
  var Beer_category = sequelize.define('Beer_category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Beer_category.belongsTo(models.BeerStyle);
      }
    }
  });

  return Beer_category;
};