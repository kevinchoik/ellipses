import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
	throw new Error('No MongoDB URI set');
}

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true
});

const recordSchema = new mongoose.Schema({
	creator: {
		type: String,
		required: true
	},
	data: {
		type: String,
		required: true
	},
	time: {
		type: Date,
		required: true
	}
});

export default mongoose.model('Record', recordSchema);
