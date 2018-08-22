module.exports = function(sequelize, DataTypes) {
  var Brewer_hours = sequelize.define('Brewer_hours', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Order: {
      type: DataTypes.INTEGER
    },
    OpeningHour: {
      type: DataTypes.STRING
    },
    ClosingHour: {
      type: DataTypes.STRING
    },
    isClose:{
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  }, {
    classMethods: {
      associate: function(models) {
        Brewer_hours.belongsTo(models.Brewer);
        // Inventory.belongsTo(models.Product);
        // Inventory.belongsTo(models.Store);
      }
    }
  });

  return Brewer_hours;
};