package io.trigger.forge.android.modules.permissions;

import io.trigger.forge.android.core.ForgeEventListener;

public class EventListener extends ForgeEventListener {

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        //ForgeLog.d("permissions.onRequestPermissionsResult -> " + requestCode + " -> " + permissions + " -> " + grantResults);
    }
}

