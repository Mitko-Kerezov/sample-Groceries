var dialogs = require("ui/dialogs");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({
	email: "tj.vantoll@gmail.com",
	password: "password"
});

exports.load = function(args) {

    var page = args.object;

    page.bindingContext = user;

};

exports.signIn = function() {
	user.login()
		.then(function() {
			try {
				frameModule.topmost().navigate("./views/list/list");	
			}
			catch (e) {
				console.log(e);
			}
		}).catch(function(e) {
			dialogs.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		});
};

exports.register = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("./views/register/register");
};