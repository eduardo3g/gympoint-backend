module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('help_orders', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('help_orders', 'updated_at');
  },
};
