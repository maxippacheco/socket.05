const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, renewToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");
const validateErrors = require("../middlewares/validate-fields");


const router = Router();

// NewUser
router.post( '/new',[
	check('nombre', 'El nombre es obligatorio').notEmpty(),
	check('email', 'El email es obligatorio').isEmail(),
	check('password', 'El password es obligatorio').notEmpty().isLength({min: 5}),
	validateErrors
],crearUsuario);

// Login
router.post( '/', [

	check('email', 'El email es obligatorio').isEmail(),
	check('password', 'El password es obligatorio').notEmpty(),
	validateErrors

],login);

// Revalidar Token
router.get( '/renew', validarJWT ,renewToken);


module.exports = router;