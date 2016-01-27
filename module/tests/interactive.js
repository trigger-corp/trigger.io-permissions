/* jshint node: true */
/* global forge, asyncTest, askQuestion, start, ok */

module("permissions");

var rationale = "Use address book?\n\nInviting friends is simple when choosing them from the address book on your phone.\n\nOtherwise, you'll have to type contact info individually.";

asyncTest("Permission request denied.", 1, function() {
	var runTest = function() {
		forge.permissions.request(forge.permissions.contacts.read, function (allowed) {
			if (!allowed) {
				ok(true, "Permission request denied.");
				start();
			} else {
				ok(false, "Permission request was allowed. Expected permission denied.");
				start();
			}
		}, function () {
			ok(false, "API method returned failure");
			start();
		});
	};
	askQuestion("When prompted, deny the permission request", { Ok: runTest });
});


asyncTest("Permission request w/ rationale denied.", 1, function() {
	var runTest = function() {
		forge.permissions.request(forge.permissions.contacts.read, rationale, function (allowed) {
			if (!allowed) {
				ok(true, "Permission request denied.");
				start();
			} else {
				ok(false, "Permission request was allowed. Expected permission denied.");
				start();
			}
		}, function () {
			ok(false, "API method returned failure");
			start();
		});
	};
	askQuestion("When prompted, deny the permission request", { Ok: runTest });
});


asyncTest("Permission request allowed.", 1, function() {
	var runTest = function() {
		forge.permissions.request(forge.permissions.contacts.read, function (allowed) {
			if (allowed) {
				ok(true, "Permission request allowed.");
				start();
			} else {
				ok(false, "Permission request was denied. Expected permission allowed.");
				start();
			}
		}, function () {
			ok(false, "API method returned failure");
			start();
		});
	};
	askQuestion("When prompted, allow the permission request", { Ok: runTest });
});

