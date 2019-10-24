module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('registrations', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('registrations', 'price');
  },
};
