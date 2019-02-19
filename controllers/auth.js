const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
	res.render('auth/signup',{
		title: 'Signup | KitaabX',
		isLoggedIn : req.session.isLoggedIn || false, 
		user: req.user,
		errorMessage: req.flash('error'),
		successMessage: req.flash('success'),
		path: '/auth/signup'
	});
};

exports.getLogin = (req, res, next) => {
	res.render('auth/login',{
		title: 'Login | KitaabX', 
		isLoggedIn : req.session.isLoggedIn || false, 
		user: req.user,
		errorMessage: req.flash('error'),
		successMessage: req.flash('success'),
		path: '/auth/login'
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = {
		first: req.body.fname,
		last: req.body.lname
	};
	User.findOne({email: email},'email')
		.then(user => {
			if(user){
				console.log("User with same email id already exists!");
				req.flash('error', 'User with same email id already exists!');
				return res.redirect('/auth/signup')
			}
			return bcrypt
				.hash(password, 12)
				.then( hashedPassword => {
					const user = new User({
						email : email,
						password : hashedPassword,
						name: name
					});
					user.save()
						.then(() => {
							req.session.isLoggedIn = true;
							req.session.user = user;
							req.session.save();
							console.log(req.session);
						})
						.catch(err => {
							console.log(err);
							req.flash('error', err);
							return res.redirect('/auth/signup')
						});
					})
				.catch((err) => {
					req.flash('error', err);
					return res.redirect('/auth/signup');
				})
			})
		.then((result) => {
			console.log(result);
			req.flash('success', 'Account created successfully!');
			return res.redirect('/');
		})
		.catch(err => {
			console.log("error at 44:"+err);
			return res.redirect('/auth/signup')
		})
};


exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email},'email password')
		.then(user => {
			if(!user){
				console.log("No user with that email id exists!!");
				req.flash('error','Invalid email or password!');
				return res.redirect('/auth/login');
			}
			bcrypt
				.compare(password, user.password)
				.then(doMatch => {
					if(doMatch){
						console.log("Matched");
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							req.flash('error', err);
							res.redirect('/');
						});
					}
					console.log('Invalid email or password!');
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/auth/login');
				})
				.catch(err => {
					console.log(err);
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/auth/login');
				})
			})
};

exports.logout = (req, res, next) => {
	req.flash('success','Logged out successfully');
	req.session.destroy(err => {
		console.log(err);
		return res.redirect('/');
	});
}