/* jshint node: true */
/* global forge, asyncTest, assert, start, ok */

module("permissions");

asyncTest("Sanity check permissions database", 2, function() {
	// check that ios & android db sizes match
	var android = forge.permissions._android;
	var ios = forge.permissions._ios;
	assert.ok(Object.keys(android).length === Object.keys(ios).length);

	// check that all db entries map to a permission
	var groups = ["contacts", "calendar", "camera", "location", "microphone", "phone", "sensors", "sms", "storage"];
	var broken = [];
	groups.forEach(function (group) {
		Object.keys(forge.permissions[group]).forEach(function (entry) {
			entry = forge.permissions[group][entry];
			var permission = forge.is.android() ? android[entry] : ios[entry];
			if (!permission) {
				broken.push(entry + " -> " + permission);
			} else if (forge.is.android() && !permission.startsWith("android.permission.")) {
				broken.push("android: " + entry + " -> " + permission);
			} else if (forge.is.ios() && permission !== "") {
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
		assert.ok(read === "");
		assert.ok(write === "");
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
