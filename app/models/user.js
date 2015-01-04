/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: ''
	},
	lastName: {
		type: String,
		trim: true,
		default: ''
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		required: true,
		index: true,
		unqiue: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	provider: {
		type: String
	},
	providerData: {},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		enum: [
			'Invited',
			'Created',
			'Pending invite'
		],
		default: 'Invited'
	},
	orderHistory: [{
		type: Schema.Types.ObjectId,
		ref: 'Order',
		default: []
	}]
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	this.updated = new Date();
	this.displayName = this.firstName + ' ' + this.lastName;
	this.email = this.email.replace(/(\S+)\.(\S+@)/, '$1$2');

	return next();
});

mongoose.model('User', UserSchema);
