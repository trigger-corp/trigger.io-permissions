
## NB

To test this module you'll need to create:

    module/android/build_steps.json

With the following contents:

    [
        { "do": { "android_add_permission": "android.permission.READ_CONTACTS" } },
        { "do": { "android_add_permission": "android.permission.WRITE_CONTACTS" } }
    ]

