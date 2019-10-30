import { Router } from 'express';
import Pokemon from '../lib/pokemon';

const router = Router();

router.get('/search', (req, res) => {
	const pokemon = new Pokemon();
	res.json(pokemon.find(req.body.search));
});

export default router;
