import { addMonths, parseISO, startOfHour } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exist.' });
    }

    const price = Number(planExists.price) * Number(planExists.duration);

    const end_date = addMonths(
      parseISO(start_date),
      Number(planExists.duration)
    );

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(RegistrationMail.key, {
      studentExists,
      planExists,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Validating if the provided student, plan an registration ID (req.params) exist
     */
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exist.' });
    }

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res
        .status(400)
        .json({ error: 'The provided student does not exist.' });
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res
        .status(400)
        .json({ error: 'The provided plan does not exist.' });
    }

    const hourStart = startOfHour(parseISO(start_date));

    const end_date = addMonths(parseISO(start_date), planExists.duration);

    const final_price = Number(planExists.duration) * Number(planExists.price);

    await Registration.update(
      { ...req.body, end_date, price: final_price },
      {
        where: { id: req.params.id },
      }
    );

    return res.json({
      student_id,
      plan_id,
      start_date: hourStart,
      end_date,
      price: final_price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = Registration.findByPk(req.params.id);

    if (!registration) {
      return res
        .status(401)
        .json({ error: 'This registration does not exist.' });
    }

    const deleted = await Registration.destroy({ where: { id } });

    if (deleted) {
      return res.json({
        message: 'The registration was successfully deleted.',
      });
    }

    return res
      .status(500)
      .json({ error: 'Something went wrong. Try again later.' });
  }
}

export default new RegistrationController();
