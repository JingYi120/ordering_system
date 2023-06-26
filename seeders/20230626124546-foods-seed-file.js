'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Food',
      Array.from({ length: 50 }, () => ({
        name: faker.commerce.productName(),
        description: faker.lorem.text(),
        price: Math.floor(Math.random() * 100)+50,
        inventory: Math.floor(Math.random() * 100),
        image: `https://loremflickr.com/320/240/japanessfood/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id 
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Food', {})
  }
}