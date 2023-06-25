const adminController = {
  getFoods: (req, res) => {
    return res.render('admin/foods')
  }
}
module.exports = adminController