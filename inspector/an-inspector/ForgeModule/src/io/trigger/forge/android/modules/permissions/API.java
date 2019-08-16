package io.trigger.forge.android.modules.permissions;

import io.trigger.forge.android.core.ForgeActivity.EventAccessBlock;
import io.trigger.forge.android.core.ForgeApp;
import io.trigger.forge.android.core.ForgeLog;
import io.trigger.forge.android.core.ForgeParam;
import io.trigger.forge.android.core.ForgeTask;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


public class API {

	public static void check(final ForgeTask task, @ForgeParam("permission") final String permission) {
		int ret = ContextCompat.checkSelfPermission(ForgeApp.getActivity(), permission);
		if (ret == PackageManager.PERMISSION_GRANTED) {
			task.success(true);
		} else {
			task.success(false);
		}
	}


	public static void request(final ForgeTask task, @ForgeParam("permission") final String permission) {
		// Check if the permission has already been granted
		int ret = ContextCompat.checkSelfPermission(ForgeApp.getActivity(), permission);
		if (ret == PackageManager.PERMISSION_GRANTED) {
			task.success(true);
			return;
		}

		// Get Rationale for permission if specified
		final String rationale;
		if (task.params.has("rationale")) {
			rationale = task.params.get("rationale").getAsString();
		} else {
			rationale = null;
		}

		final EventAccessBlock eventAccessBlock = new EventAccessBlock() {
			@Override
			public void run(boolean granted) {
				task.success(granted);
			}
		};

		// shouldShowRequestPermissionRationale returns:
		// first time:                        false
		// if user clicked deny first time:   true
		// if user clicked "Never ask again": false
		if (rationale != null && ActivityCompat.shouldShowRequestPermissionRationale(ForgeApp.getActivity(), permission)) {
			showRationale(task, rationale, new DialogInterface.OnClickListener() {
				@Override
				public void onClick(DialogInterface dialog, int selection) {
					ForgeLog.d("Clicked: " + selection);
					if (selection == -2) { // no
						task.success(false);
					} else { // yes
						ForgeApp.getActivity().requestPermission(permission, eventAccessBlock);
					}
				}
			});
		} else {
			ForgeApp.getActivity().requestPermission(permission, eventAccessBlock);
		}
	}


	protected static void showRationale(final ForgeTask task, final String message, final DialogInterface.OnClickListener listener) {
		task.performUI(new Runnable() {
			public void run() {
				try {
					new AlertDialog.Builder(ForgeApp.getActivity())
							.setMessage(message)
							.setPositiveButton("Okay", listener)
							.setNegativeButton("No Thanks", listener)
							.create()
							.show();
				} catch (Exception e) {
					ForgeLog.e("Exception: " + e.getLocalizedMessage());
					task.error("Could not display permissions rationale: " + e.getLocalizedMessage(), "UNEXPECTED_FAILURE", null);
				}
			}
		});
	}
}
