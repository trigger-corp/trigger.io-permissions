#import "permissions_API.h"

#import "JLPermissions/JLCalendarPermission.h"
#import "JLPermissions/JLCameraPermission.h"
#import "JLPermissions/JLContactsPermission.h"
#import "JLPermissions/JLLocationPermission.h"
#import "JLPermissions/JLMicrophonePermission.h"
#import "JLPermissions/JLNotificationPermission.h"
#import "JLPermissions/JLPhotosPermission.h"
#import "JLPermissions/JLRemindersPermission.h"

@implementation permissions_API

+ (void)check:(ForgeTask*)task permission:(NSString *)permission {
    [ForgeLog d:[NSString stringWithFormat:@"permissions.check -> %@", permission]];

    JLPermissionsCore* jlpermission = [self resolvePermission:permission];
    if (jlpermission == NULL) {
        [task success:[NSNumber numberWithBool:YES]];
        return;
    }

    JLAuthorizationStatus status = [jlpermission authorizationStatus];
    [task success:[NSNumber numberWithBool:status == JLPermissionAuthorized]];
}


+ (void)request:(ForgeTask*)task permission:(NSString *)permission {

    JLPermissionsCore* jlpermission = [self resolvePermission:permission];
    if (jlpermission == NULL) {
        [task success:[NSNumber numberWithBool:YES]];
        return;
    }

    if ([jlpermission authorizationStatus] == JLPermissionAuthorized) {
        [task success:[NSNumber numberWithBool:YES]];
        return;
    }

    NSDictionary* params = task.params;
    NSString* rationale = [params objectForKey:@"rationale"];

    [ForgeLog d:[NSString stringWithFormat:@"permissions.request -> %@ -> %@", permission, rationale]];

    [jlpermission authorize:^(BOOL granted, NSError * _Nullable error) {
        if (error) {
            [ForgeLog d:[NSString stringWithFormat:@"permissions.check '%@' failed with error: %@", permission, error]];
            //[task error:[error description] type:@"UNEXPECTED_FAILURE" subtype:nil];
            //return;
        }
        [task success:[NSNumber numberWithBool:granted]];
    }];
}


+ (JLPermissionsCore*)resolvePermission:(NSString*)permission {
    JLPermissionsCore* ret = NULL;
    if ([permission isEqualToString:@""]) {
        [ForgeLog d:[NSString stringWithFormat:@"Permission not supported on iOS:%@", permission]];

    } else if ([permission isEqualToString:@"ios.permission.contacts"]) {
        ret = [JLContactsPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.calendar"]) {
        ret = [JLCalendarPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.camera"]) {
        ret = [JLCameraPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.location"]) {
        ret = [JLLocationPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.microphone"]) {
        ret = [JLMicrophonePermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.notification"]) {
        ret = [JLNotificationPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.photos"]) {
        ret = [JLPhotosPermission sharedInstance];

    } else if ([permission isEqualToString:@"ios.permission.reminder"]) {
        ret = [JLRemindersPermission sharedInstance];

    } else {
        [ForgeLog w:[NSString stringWithFormat:@"Unknown permission:%@", permission]];
    }

    return ret;
}

@end
