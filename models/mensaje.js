const { Schema, model } = require('mongoose');

const MensajeSchema = new Schema({

	//Mandado por tal persona
	de: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true
	},
	para: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true
	},
	mensaje: {
		type: String,
		required: true
	}
}, {
	// Fecha de creacion y fecha de ultima modificacion
	timestamps: true
});

MensajeSchema.method('toJSON', function(){
	const { __v, ...object } = this.toObject();
	return object;
});


module.exports = model('Mensaje', MensajeSchema);