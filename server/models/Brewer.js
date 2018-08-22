module.exports = function(sequelize, DataTypes) {
  var Brewer = sequelize.define('Brewer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      unique: true
    },
    address: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {
        Brewer.hasMany(models.Brewer_hours);
        Brewer.hasMany(models.Brewer_reviews);
      }
    }
  });

  return Brewer;
};