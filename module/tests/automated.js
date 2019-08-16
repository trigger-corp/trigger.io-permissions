/* jshint node: true */
/* global forge, asyncTest, assert, start, ok */

module("permissions");

asyncTest("Sanity check permissions database", 2, function() {
    // check that ios & android db sizes match
    var android = forge.permissions._android;
    var ios = forge.permissions._ios;
    assert.ok(Object.keys(android).length === Object.keys(ios).length);

    // check that all db entries map to a permission
    var groups = ["calendar", "camera", "contacts", "location", "microphone", "notification", "phone",
                  "photos", "reminders", "sensors", "sms", "storage"];
    var broken = [];
    groups.forEach(function (group) {
        Object.keys(forge.permissions[group]).forEach(function (entry) {
            entry = forge.permissions[group][entry];
            var permission = forge.is.android() ? android[entry] : ios[entry];
            if (permission === "") {
                // permission not supported on platform
                return;
            } else if (!permission) {
                broken.push(entry + " -> " + permission);
                return;
            }
            if (forge.is.android() && !(permission.indexOf("android.permission.") === 0 ||
                                        permission.indexOf("com.android.") === 0 ||
                                        permission.indexOf("com.google.") === 0)) {
                broken.push("android: " + entry + " -> " + permission);
            } else if (forge.is.ios() && permission.indexOf("ios.permission.") !== 0) {
                broken.push("ios: " + entry + " -> " + permission);
            }
        });
    });
    if (broken.length) {
        assert.ok(false, "Database is inconsistent: " + broken.join('\n'));
    } else {
        assert.ok(true, "Database is consistent");
    }
    start();
});


asyncTest("Test forge.permissions._resolve", 2, function() {
    var read  = forge.permissions._resolve(forge.permissions.contacts.read);
    var write = forge.permissions._resolve(forge.permissions.contacts.write);
    if (forge.is.android()) {
        assert.ok(read === "android.permission.READ_CONTACTS");
        assert.ok(write === "android.permission.WRITE_CONTACTS");
    } else if (forge.is.ios()) {
        assert.ok(read === "ios.permission.contacts");
        assert.ok(write === "ios.permission.contacts");
    } else {
        assert.ok(read === "");
        assert.ok(write === "");
    }
    start();
});


asyncTest("Test forge.permissions.check", 1, function () {
    forge.permissions.check(forge.permissions.calendar.read, function (granted) {
        if (granted) {
            ok(true, "Permission check shows denied.");
        } else {
            ok(true, "Permission check shows granted.");
        }
        start();
    }, function () {
        ok(false, "API method returned failure");
        start();
    });
});

// non-existent permissions should always return true if we can catch them in module.js
asyncTest("Test non-existent permissions in module javascript", 2, function () {
    var permission = "this.does.not.exist.anywhere";
    forge.permissions.check(permission, function (granted) {
        if (granted) {
            ok(true, "Non-existent permission check shows granted.");
            forge.permissions.request(permission, function (granted) {
                if (granted) {
                    ok(true, "Non-existent permission request shows granted.");
                    start();
                } else {
                    ok(false, "Non-existent permission request shows denied.");
                    start();
                }
            }, function () {
                ok(false, "API method returned failure");
                start();
            });
        } else {
            ok(false, "Non-existent permission check shows denied.");
            start();
        }
    }, function () {
        ok(false, "API method returned failure");
        start();
    });
});

asyncTest("Test non-existent permissions in native module", 2, function () {
    var permission = forge.permissions.test.nonexistent;
    forge.permissions.check(permission, function (granted) {
        if (!granted) {
            ok(true, "Non-existent permission check shows denied.");
            forge.permissions.request(permission, function (granted) {
                if (!granted) {
                    ok(true, "Non-existent permission request shows denied.");
                    start();
                } else {
                    ok(false, "Non-existent permission request shows granted.");
                    start();
                }
            }, function () {
                ok(false, "API method returned failure");
            });
        } else {
            ok(false, "Non-existent permission check shows granted.");
            start();
        }
    }, function () {
        ok(false, "API method returned failure");
        start();
    });
});
