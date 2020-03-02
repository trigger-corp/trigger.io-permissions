#import "JLNotificationPermission.h"

#import "permissions_EventListener.h"


@implementation permissions_EventListener

+ (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[JLNotificationPermission sharedInstance] notificationResult:deviceToken error:nil];
}

+ (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    [[JLNotificationPermission sharedInstance] notificationResult:nil error:error];
}

@end
