var dialogs = require("ui/dialogs");
var observableModule = require("data/observable");
var view = require("ui/core/view");
var GroceryList = require("../../shared/view-models/grocery-list-view-model");

var page;

var groceryList = new GroceryList([]);

var pageData = new observableModule.Observable({
	groceryList: groceryList
});

pageData.set("grocery", "");

exports.navigatedTo = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    groceryList.clear();
    groceryList.load();
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