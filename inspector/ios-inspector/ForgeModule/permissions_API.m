#import "permissions_API.h"

#import "JLPermissions/JLNotificationPermission.h"

@implementation permissions_API

+ (void)check:(ForgeTask*)task permission:(NSString *)permission {
    JLPermissionsCore* jlpermission = [self resolvePermission:permission];
    if (jlpermission == NULL) {
        [task success:[NSNumber numberWithBool:NO]];
        return;
    }

    JLAuthorizationStatus status = [jlpermission authorizationStatus];
    [task success:[NSNumber numberWithBool:status == JLPermissionAuthorized]];
}


+ (void)request:(ForgeTask*)task permission:(NSString *)permission {
    JLPermissionsCore* jlpermission = [self resolvePermission:permission];
    if (jlpermission == NULL) {
        [task error:[NSString stringWithFormat:@"Permission not supported on iOS: %@", permission]];
        return;
    }

    if ([jlpermission authorizationStatus] == JLPermissionAuthorized) {
        [task success:[NSNumber numberWithBool:YES]];
        return;
    }

    NSDictionary* params = task.params;
    NSString* rationale = [params objectForKey:@"rationale"];
    if (rationale != nil) {
        [jlpermission setRationale:rationale];
    }

    // The only permission we still support directly from the permissions module is the notification permission
    JLNotificationPermission* jlnotificationPermission = (JLNotificationPermission*)jlpermission;
    [jlnotificationPermission authorize:^(NSString *deviceID, NSError * _Nullable error) {
        [jlpermission setRationale:nil]; // reset rationale
        if (error) {
            [ForgeLog d:[NSString stringWithFormat:@"permissions.check '%@' failed with error: %@", permission, error]];
        }
        [task success:[NSNumber numberWithBool:deviceID != nil]];
    }];
}


+ (JLPermissionsCore*)resolvePermission:(NSString*)permission {
    JLPermissionsCore* ret = NULL;
    if ([permission isEqualToString:@""]) {
        [ForgeLog d:[NSString stringWithFormat:@"Permission not supported on iOS:%@", permission]];

    } else if ([permission isEqualToString:@"ios.permission.notification"]) {
        ret = [JLNotificationPermission sharedInstance];

    } else {
        [ForgeLog w:[NSString stringWithFormat:@"Requested unknown permission:%@", permission]];
    }

    return ret;
}

@end
