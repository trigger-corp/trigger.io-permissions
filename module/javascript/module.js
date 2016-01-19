// Expose the native API to javascript
forge.permissions = {
    showAlert: function (text, success, error) {
        forge.internal.call('permissions.showAlert', {text: text}, success, error);
    }
};

// Register for our native event
forge.internal.addEventListener("permissions.resume", function () {
	alert("Welcome back!");
});
