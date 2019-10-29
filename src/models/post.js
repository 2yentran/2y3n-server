import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
}, {
  timestamps: true,
});

const POST = mongoose.model('Post', postSchema);

export default POST;
