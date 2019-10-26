import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerHelpOrderMail from '../jobs/AnswerHelpOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      question: Yup.string().required(),
    });
    if (
      !(await schema.isValid({
        student_id: req.params.id,
        question: req.body.question,
      }))
    ) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const studentExistsOnBody = Student.findByPk(req.body.student_id);

    if (!studentExistsOnBody) {
      return res.status(400).json({ error: 'Student does not exist.' });
    }

    const { question } = req.body;
    const help = await HelpOrder.create({
      student_id: req.params.id,
      question,
    });

    return res.json(help);
  }

  async index(req, res) {
    const { id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: id },
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      id: Yup.number().required(),
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid({ id, answer: req.body.answer }))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const helpOrderExists = await HelpOrder.findOne({
      where: { id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrderExists) {
      return res.status(400).json({ error: 'Help order does not exist.' });
    }

    const response = await helpOrderExists.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerHelpOrderMail.key, {
      response,
      answer_at: new Date(),
    });

    return res.json(response);
  }
}

export default new HelpOrderController();
