import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { studentExists, planExists, start_date, end_date, price } = data;

    console.log('########### THE QUEUE IS RUNNING ###########');

    await Mail.sendMail({
      to: `${studentExists.name} <${studentExists.email}>`,
      subject: 'GymPoint | Welcome',
      template: 'registration',
      context: {
        student: studentExists.name,
        plan: planExists.name,
        start_date: format(
          parseISO(start_date),
          "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(end_date),
          "'dia' dd 'de' MMMM 'de' yyyy', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        price,
      },
    });
  }
}

export default new RegistrationMail();
