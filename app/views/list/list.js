var dialogs = require("ui/dialogs");
var observableModule = require("data/observable");
var view = require("ui/core/view");
var GroceryList = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var frameModule = require("ui/frame");

var page;

var groceryList = new GroceryList([]);

var pageData = new observableModule.Observable({
	groceryList: groceryList
});

pageData.set("grocery", "");

var controller = frameModule.topmost().ios.controller;
var navigationBar = controller.navigationBar;

exports.navigatedTo = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    var listView = view.getViewById(page, "groceryList");
    swipeDelete.enable(listView, function(index) {
        console.log("deleting: " + index);
        groceryList.delete(index);
    });

    groceryList.clear();
    groceryList.load();

    if (page.ios) {
        navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
        navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
        navigationBar.barStyle = 1;
        navigationBar.tintColor = UIColor.whiteColor();
    }       
};

exports.add = function() {
    //check for empty submission
    if (pageData.get("grocery").trim() !== "") {
        //dismiss the keyboard
        view.getViewById(page, "grocery").dismissSoftInput();
        groceryList.add(pageData.get("grocery"))
            .catch(function() {
                dialogs.alert({
                    message: "An error occurred adding to your list.",
                    okButtonText: "OK"
                });
            });
        //empty the input field
        pageData.set("grocery", "");
    } else {
        dialogs.alert({
            message: "Please enter a grocery item",
            okButtonText: "OK"
        });
    }
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = groceryList.length; i < size ; i++) {
        list.push(groceryList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};

exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = groceryList.indexOf(item);
    groceryList.delete(index);
};