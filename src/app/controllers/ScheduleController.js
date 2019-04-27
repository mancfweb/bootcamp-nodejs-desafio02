const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment, User } = require('../models')

class ScheduleController {
  async index(req, res){
    const { id } = req.session.user
    const date = moment()

    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user'}],
      where: {
        provider_id: id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    return res.render('schedule/index', { appointments })
  }
}

module.exports = new ScheduleController()
