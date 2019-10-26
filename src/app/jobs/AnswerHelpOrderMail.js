import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class AnswerHelpOrderMail {
  get key() {
    return 'AnswerHelpOrderMail';
  }

  async handle({ data }) {
    const { response, answer_at } = data;

    console.log('########### THE QUEUE IS RUNNING ###########');

    await Mail.sendMail({
      to: `${response.student.name} <${response.student.email}>`,
      subject: 'GymPoint | Help Order Answer',
      template: 'answerHelpOrder',
      context: {
        student: response.student.name,
        question: response.question,
        answer: response.answer,
        answer_at: format(
          parseISO(answer_at),
          "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerHelpOrderMail();
