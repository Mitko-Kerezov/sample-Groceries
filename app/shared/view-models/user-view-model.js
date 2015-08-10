var http = require("http");
var config = require("../../shared/config");

var observableModule = require("data/observable");

function User(info) {

	info = info || {};

	// you can add properties to observables on creation
	var viewModel = new observableModule.Observable({
		
		email: info.email || '',
		
		password: info.password || '',

		login: function() {
			var that = this;
			return new Promise(function(resolve, reject) {
				http.request({
					url: config.apiUrl + "oauth/token",
					method: "POST",
					content: JSON.stringify({
						username: viewModel.get("email"),
						password: viewModel.get("password"),
						grant_type: "password"
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}).then(function(data) {
					config.token = data.content.toJSON().Result.access_token;

					resolve();
				
				}).catch(function(e) {

					reject(e);

				});
			});
		}
	});

	// you can also add them after an obserbvable is created
	viewModel.register = function() {
		
		return new Promise(function(resolve, reject) {
			http.request({
				url: config.apiUrl + "Users",
				method: "POST",
				content: JSON.stringify({
					Username: viewModel.get("email"),
					Email: viewModel.get("email"),
					Password: viewModel.get("password")
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function() {
		
				resolve();
			
			}).catch(function() {
		
				reject();
			
			});
		});
	}

	return viewModel;

};

module.exports = User;