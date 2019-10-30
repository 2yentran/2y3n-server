import { Router } from 'express';
import Pokemon from '../lib/pokemon';

const router = Router();

router.get('/', async (req, res) => {
  const pokemon = new Pokemon();
  const output = await pokemon.find(req.query.search);
  res.json(output);
});

export default router;
