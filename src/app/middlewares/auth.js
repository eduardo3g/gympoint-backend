import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // O array possui duas posições ('Bearer [hash do token]'). Da maneira abaixo, descartamos o 'Bearer'
  // e fazemos com que o hash do token seja a primeira e única posição
  const [, token] = authHeader.split(' ');

  try {
    // o payload do token está na const encoded ( id do usuário e data de expiração)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid.' });
  }
};
