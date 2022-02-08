const Usuario  = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helper/generar-jwt");


const crearUsuario = async(req, res) => {

	try {
		
		let { email, password } = req.body;

		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: 'El email ya existe'
			});
		}
		
		const usuario = new Usuario( req.body );
		
		// Encriptar password
		// salt => numero de rounds
		const salt = bcryptjs.genSaltSync();
		usuario.password = bcryptjs.hashSync(password, salt);

		// Guardar usuario DB
		await usuario.save();

		// JWT
		const token = await generarJWT(usuario.uid);

		res.json({
			ok: true,
			usuario,
			token
		});

	} catch (error) {
		console.log(error);
	
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		});
	}


}

const login = async(req, res) => {

	const { email, password } = req.body;

	try {
	
		const usuarioDB = await Usuario.findOne({email});

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "Email no encontrado"
			});
		}

		const verifyPassword = bcryptjs.compareSync( password, usuarioDB.password);
		
		if (!verifyPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password no valido'
			});
		}

		const token = await generarJWT( usuarioDB.id );

		res.json({
			ok: true,
			usuarioDB,
			token
		});

	} catch (error) {
		console.log(error);
	
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador'
		});		
	}



}

const renewToken = async(req, res) => {

	const uid = req.uid;

	// Gemerar un nuevo JWT
	const token = await generarJWT( uid );

	//USUARIO
	const usuario = await Usuario.findById( uid );


	res.json({
		ok: true,
		usuario,
		token
	});
}




module.exports = {
	crearUsuario,
	login,
	renewToken
}