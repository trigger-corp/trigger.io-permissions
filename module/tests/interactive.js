/* jshint node: true */
/* global forge, asyncTest, askQuestion, start, ok */

module("permissions");

var notification_rationale = "Allow notifications?\n\nLetting strangers interrupt you at random times of the day and night is a great way to stay focused!";

asyncTest("Notification permission request denied.", 1, function() {
    var runTest = function() {
        forge.permissions.request(forge.permissions.notification.receive, notification_rationale, function (allowed) {
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

asyncTest("Notification permission request allowed.", 1, function() {
    var runTest = function() {
        forge.permissions.request(forge.permissions.notification.receive, notification_rationale, function (allowed) {
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



if (forge.geolocation) {

    var geolocation_rationale = "Use location?\n\nKnowing where you are makes it easier for you to find you.\n\nOtherwise, you'll not know where you are.";

    asyncTest("Permission request denied.", 1, function() {
        var runTest = function() {
            forge.permissions.request(forge.permissions.location.fine, function (allowed) {
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
            forge.permissions.request(forge.permissions.location.fine, geolocation_rationale, function (allowed) {
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
            forge.permissions.request(forge.permissions.location.fine, function (allowed) {
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
}

if (forge.contact) {
    var contact_rationale = "Use address book?\n\nInviting friends is simple when choosing them from the address book on your phone.\n\nOtherwise, you'll have to type contact info individually.";

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
            forge.permissions.request(forge.permissions.contacts.read, contact_rationale, function (allowed) {
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
}
