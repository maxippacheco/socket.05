const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

	return new Promise( (resolve, reject) => {

		const payload = { uid };

		jwt.sign( payload, process.env.SECRET_KEY, {
			expiresIn: '24h'
		}, ( error, token ) => {
		  
			if (error) {
				console.log(error);
				reject('No se pudo generar');
			}else{
				resolve(token)
			}

		});
	
	});

};

const comprobarJWT = ( token = '' ) => {

	try {
		
		const { uid } = jwt.verify( token, process.env.SECRET_KEY );

		return [ true, uid ]; 

	} catch (error) {
		return [ false ];
	}

}



module.exports = {
	generarJWT,
	comprobarJWT
}