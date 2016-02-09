``permissions``: manage runtime permission requests in your app
===============================================================


The ``forge.permissions`` module gives you custom control over when and how your app makes native permission requests.

By default, all forge module API's will always make a request to the user for any permissions they need when called. 

While this has the benefit of being automatic and not requiring any work on your part it has the downside that it can quickly get quite complex to handle situations where the user denied those permissions requests.

An additional problem is that once a permission request has been denied the user will never again be given the choice and the only way to grant that permission is for them to go digging through their device settings.

The ``forge.permissions`` module is designed to give you finer control over the flow of your app when a permission request is required and makes it less likely that a user will permanently lose the ability to grant a permission in the future.

----

::Important:: Platform version 2.4.1 or higher is required to use this module.

----

## API

!method: forge.permissions.check(permission, success, error)
!param: permission `forge.permissions.<permission>` permission to check
!param: success `function(granted)` callback with the result of the permission check
!description: Checks to see if the given permission has been granted.
!platforms: iOS, Android
!param: error `function(content)` called with details of any error which may occur

!method: forge.permissions.request(permission, success, error)
!param: permission `forge.permissions.<permission>` permission to request
!param: success `function(granted)` callback with the result of the permission request
!description: Request the given permission.
!platforms: iOS, Android
!param: error `function(content)` called with details of any error which may occur

!method: forge.permissions.request(permission, rationale, success, error)
!param: permission `forge.permissions.<permission>` permission to request
!param: rationale `string` custom message to explain to users why your app requires a specific permission.
!param: success `function(granted)` callback with the result of the permission request
!description: Request permission with a rationale for why the user should accept.
!platforms: iOS, Android
!param: error `function(content)` called with details of any error which may occur

> ::Notes:: 
> 
> *  On Android the rationale will only be displayed if the user has previously denied the request. 
> *  To alleviate the situation where users will never be asked again for a permission, the request is presented as two consecutive dialogs with the real permission request only being made on the second dialog. 
> *  On Android runtime permissions are only available from Marshmallow onwards. On older versions of Android the user has to accept all app permissions during installation so these methods will never present a permissions dialog and simply return `true` for the `function(granted)` callback.


**Example:**

Let's say your app has a feature that relies on the ``forge.contact` module which needs read permissions for device contacts.

	var rationale = "Grant appname to access your contacts?\n"
                  + "This allows CoolApp to let you choose the "
				  + "friends you'd like to share your photos with.";

    function SomeAppFeatureRequiringPermissions() {
        forge.contact.select(function (contact) {
            forge.logging.log("Selected contact: " + JSON.stringify(contact));
        }, error("contact.select"));
    }

	function HandlePermissionDenialGracefully() {
	    ...
	}

	function HandleErrorsGracefully(e) {
	    ....
	}

    forge.permissions.check(forge.permissions.contacts.read, function (granted) {
	    if (granted) {
		   return SomeAppFeatureRequiringPermissions();
		}
        forge.permissions.request(forge.permissions.contacts.read, rationale, function (granted) {
            if (granted) {
                return SomeAppFeatureRequiringPermissions();
            }
			HandlePermissionDenialGracefully();
        }, HandleErrorsGracefully);
		
	}, HandleErrorsGracefully);

## Available Permissions

The following permissions are available and mapped to Android and iOS as follows:

| Permission                             | Android                                   | iOS          |
|----------------------------------------|-------------------------------------------|--------------|
| forge.permissions.calendar.read        | android.permission.READ_CALENDAR          | calendar     |
| forge.permissions.calendar.write       | android.permission.WRITE_CALENDAR         | calendar     |
| forge.permissions.camera.read          | android.permission.CAMERA                 | camera       |
| forge.permissions.contacts.read        | android.permission.READ_CONTACTS          | contacts     |
| forge.permissions.contacts.write       | android.permission.WRITE_CONTACTS         | contacts     |
| forge.permissions.contacts.accounts    | android.permission.GET_ACCOUNTS           | contacts     |
| forge.permissions.location.coarse      | android.permission.ACCESS_COARSE_LOCATION | location     |
| forge.permissions.location.fine        | android.permission.ACCESS_FINE_LOCATION   | location     |
| forge.permissions.microphone.record    | android.permission.RECORD_AUDIO           | microphone   |
| forge.permissions.notification.receive | n/a                                       | notification |
| forge.permissions.phone.state          | android.permission.READ_PHONE_STATE       | n/a          |
| forge.permissions.phone.call           | android.permission.CALL_PHONE             | n/a          |
| forge.permissions.phone.read           | android.permission.READ_CALL_LOG          | n/a          |
| forge.permissions.phone.write          | android.permission.WRITE_CALL_LOG         | n/a          |
| forge.permissions.phone.voicemail      | com.android.voicemail.permission.ADD_VOICEMAIL | n/a |
| forge.permissions.phone.sip            | android.permission.USE_SIP                | n/a          |
| forge.permissions.phone.outgoing       | android.permission.PROCESS_OUTGOING_CALLS | n/a          |
| forge.permissions.photos.read          | com.google.android.apps.photos.permission.GOOGLE_PHOTOS | photos |
| forge.permissions.reminders.receive    | n/a                                       | reminders    |
| forge.permissions.sensors.read         | android.permission.BODY_SENSORS           | n/a          |
| forge.permissions.sms.send             | android.permission.SEND_SMS               | n/a          |
| forge.permissions.sms.receive          | android.permission.RECEIVE_SMS            | n/a          |
| forge.permissions.sms.read             | android.permission.READ_SMS               | n/a          |
| forge.permissions.sms.wap              | android.permission.RECEIVE_WAP_PUSH       | n/a          |
| forge.permissions.sms.mms              | android.permission.RECEIVE_MMS            | n/a          |
| forge.permissions.storage.read         | android.permission.READ_EXTERNAL_STORAGE  | n/a          |
| forge.permissions.storage.write        | android.permission.WRITE_EXTERNAL_STORAGE | n/a          |


## Notes

When debugging your app you will often need to reset the current state of your device operating system's permission settings as you may not be able to revoke a permission once granted or have the option to grant a permission once it has been denied.

On Android you can simply uninstall the app to reset the OS permissions state back to default.

On iOS it can get a bit more complicated and this link provides a great reference on the actions you need to take:  https://github.com/getyourguide/reset-ios-permission


## References

* [Requesting Permissions at Run Time on Android](http://developer.android.com/training/permissions/requesting.html)
* [The Right Way To Ask Users for iOS Permissions](http://techcrunch.com/2014/04/04/the-right-way-to-ask-users-for-ios-permissions/)
