/* jshint node: true */
/* global forge */

forge.permissions = {

    check: function (permission, success, error) {
		permission = forge.permissions._resolve(permission);
		if (permission === "") { // permission not supported on platform
			success(true);
			return;
		}

        forge.internal.call("permissions.check", {
			permission: permission
		}, success, error);
	},

    request: function (permission, rationale, success, error) {
		var options = { 
			permission: forge.permissions._resolve(permission)
		};

		if (typeof rationale === "function") {
			error = success;
			success = rationale;
		} else if (typeof rationale === "string") {
			options.rationale = rationale;
		}

		if (options.permission === "") { // permission not supported on platform
			success(true);
			return;
		}

        forge.internal.call("permissions.request", options, success, error);
    },

	// available permissions
	calendar: {
		read: "calendar_read",
		write: "calendar_write",
	},
	camera: {
		read: "camera_read"
	},
	contacts: {
		read: "contacts_read",
		write: "contacts_write",
		accounts: "contacts_accounts"
	},
	location: {
		coarse: "location_coarse",
		fine: "location_fine"
	},
	microphone: {
		record: "microphone_record"
	},
	notification: {
		receive: "notification_receive"
	},
	phone: {
		state:     "phone_state",
		call:      "phone_call",
		read:      "phone_read",
		write:     "phone_write",
		voicemail: "phone_voicemail",
		sip:       "phone_sip",
		outgoing:  "phone_outgoing"
	},
	photos: {
		"read": "photos_read"
	},
	reminders: {
		receive: "reminders_receive"
	},
	sensors: {
		read: "sensors_read"
	},
	sms: {
		send: "sms_send",
		receive: "sms_receive",
		read: "sms_read",
		wap: "sms_wap",
		mms: "sms_mms"
	},
	storage: {
		read: "storage_read",
		write: "storage_write"
	},
	test: {
		nonexistent: "test_nonexistent"
	},

	// map permission to platform
	_android: {
		contacts_read:        "android.permission.READ_CONTACTS",
		contacts_write:       "android.permission.WRITE_CONTACTS",
		contacts_accounts:    "android.permission.GET_ACCOUNTS",
		calendar_read:        "android.permission.READ_CALENDAR",
		calendar_write:       "android.permission.WRITE_CALENDAR",
		camera_read:          "android.permission.CAMERA",
		location_coarse:      "android.permission.ACCESS_COARSE_LOCATION",
		location_fine:        "android.permission.ACCESS_FINE_LOCATION",
		microphone_record:    "android.permission.RECORD_AUDIO",
		phone_state:          "android.permission.READ_PHONE_STATE",
		phone_call:           "android.permission.CALL_PHONE",
		phone_read:           "android.permission.READ_CALL_LOG",
		phone_write:          "android.permission.WRITE_CALL_LOG",
		phone_voicemail:      "com.android.voicemail.permission.ADD_VOICEMAIL",
		phone_sip:            "android.permission.USE_SIP",
		phone_outgoing:       "android.permission.PROCESS_OUTGOING_CALLS",
		sensors_read:         "android.permission.BODY_SENSORS",
		sms_send:             "android.permission.SEND_SMS",
		sms_receive:          "android.permission.RECEIVE_SMS",
		sms_read:             "android.permission.READ_SMS",
		sms_wap:              "android.permission.RECEIVE_WAP_PUSH",
		sms_mms:              "android.permission.RECEIVE_MMS",
		storage_read:         "android.permission.READ_EXTERNAL_STORAGE",
		storage_write:        "android.permission.WRITE_EXTERNAL_STORAGE",
		notification_receive: "",
		photos_read:          "com.google.android.apps.photos.permission.GOOGLE_PHOTOS",
		reminders_receive:    "",
		test_nonexistent:     "android.permission.DOES_NOT_EXIST",
	},
	_ios: {
		contacts_read:        "ios.permission.contacts",
		contacts_write:       "ios.permission.contacts",
		contacts_accounts:    "ios.permission.contacts",
		calendar_read:        "ios.permission.calendar",
		calendar_write:       "ios.permission.calendar",
		camera_read:          "ios.permission.camera",
		location_coarse:      "ios.permission.location",
		location_fine:        "ios.permission.location",
		microphone_record:    "ios.permission.microphone",
		phone_state:          "",
		phone_call:           "",
		phone_read:           "",
		phone_write:          "",
		phone_voicemail:      "",
		phone_sip:            "",
		phone_outgoing:       "",
		sensors_read:         "",
		sms_send:             "",
		sms_receive:          "",
		sms_read:             "",
		sms_wap:              "",
		sms_mms:              "",
		storage_read:         "",
		storage_write:        "",
		notification_receive: "ios.permission.notification",
		photos_read:          "ios.permission.photos",
		reminders_receive:    "ios.permission.reminders",
		test_nonexistent:     "ios.permission.does_not_exist",
	},
	_resolve: function(key) {
		if (forge.is.android()) {
			if (key in forge.permissions._android) {
				return forge.permissions._android[key];
			} else {
				return "";
			}
		} else if (forge.is.ios()) {
			if (key in forge.permissions._ios) {
				return forge.permissions._ios[key];
			} else {
				return "";
			}
		} else {
			return "";
		}
	}
};

