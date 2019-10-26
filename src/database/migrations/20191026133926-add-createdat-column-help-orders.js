module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('help_orders', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('help_orders', 'created_at');
  },
};
