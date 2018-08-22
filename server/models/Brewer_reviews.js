module.exports = function(sequelize, DataTypes) {
    var Brewer_reviews = sequelize.define('Brewer_reviews', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Username: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.TEXT
      },
      rating: {
        type: DataTypes.STRING
      }
    }, {
      classMethods: {
        associate: function(models) {
          Brewer_reviews.belongsTo(models.Brewer);
          // Inventory.belongsTo(models.Product);
          // Inventory.belongsTo(models.Store);
        }
      }
    });
  
    return Brewer_reviews;
  };