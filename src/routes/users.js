import { Router } from 'express';
import User from '../models/user';

const router = Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.find();
  res.json(users);
});

router.get('/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.post('/', async (req, res, next) => {
  const username = req.body.username;
  const newUser = new User({ username });
  await newUser.save();
  res.json('User added!')
});

export default router;
