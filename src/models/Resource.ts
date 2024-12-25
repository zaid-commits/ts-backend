import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  link: string;
  category: string;
  posterImage: string; 
  posterUsername: string;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  category: { type: String, required: true },
  posterImage: { type: String, required: true }, 
  posterUsername:{ type:String, required: true}
});

export default mongoose.model<IResource>('Resource', ResourceSchema);