import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    /**
     * Student can only checkin 5 times during the last 7 days
     */
    const sevenDaysRange = subDays(new Date(), 7);

    /**
     * Finds all records between seven days ago until current date
     */
    const validation = await Checkin.find({
      createdAt: {
        $gte: sevenDaysRange, // MongoDB: greater than or equal to specified value
        $lte: new Date(), // MongoDB: less than or equal to specified value
      },
    }).count();

    if (validation === 5) {
      return res.status(400).json({
        error: "You're only allowed to check-in five times a week.",
      });
    }

    const check_in = await Checkin.create({
      student_id: req.params.id,
    });

    return res.json(check_in);
  }

  async index(req, res) {
    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const checkins = await Checkin.find({
      student_id: req.params.id,
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
