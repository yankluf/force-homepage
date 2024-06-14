// A global variable is created for better readability
var extensionStatus

// Styles for the badge in the extension's icon
function badgeOn() {
	chrome.action.setBadgeText({ text: 'on' })
	chrome.action.setBadgeTextColor({ color: '#FFFFFF' })
	chrome.action.setBadgeBackgroundColor({ color: '#2fc439' })
}

function badgeOff() {
	chrome.action.setBadgeText({ text: 'off' })
	chrome.action.setBadgeTextColor({ color: '#FFFFFF' })
	chrome.action.setBadgeBackgroundColor({ color: '#c73434' })
}

// Save the new status of the extension (ON or OFF) in the local storage of the browser
// Also updates the global variable and apply the styles
function enableExtension() {
	chrome.storage.local.set({ status: 'enabled' }).then(() => {
		extensionStatus = 'enabled'
		badgeOn()
	})
}

function disableExtension() {
	chrome.storage.local.set({ status: 'disabled' }).then(() => {
		extensionStatus = 'disabled'
		badgeOff()
	})
}

// Change the URL of the current tab to the New Tab page
function changeCurrentTabUrl() {
	let tab = chrome.tabs.getCurrent().then(() => {
		chrome.tabs.update(tab.id, { url: "chrome://newtab" })
	})
}

// Switcher to turn ON and OFF the extension when its icon is clicked
chrome.action.onClicked.addListener(() => {
	if (extensionStatus === 'disabled') {
		enableExtension()
	} else {
		disableExtension()
	}
})

// Check the last saved status (ON or OFF) when a new window is opened
// And change the URL to the New Tab page if the extension was enabled
// Also updates the global variable and the badge's styles
chrome.windows.onCreated.addListener(() => {
	chrome.storage.local.get(['status']).then((value) => {
		extensionStatus = value.status
		if (extensionStatus === 'enabled') { changeCurrentTabUrl(); badgeOn() }
		else if (extensionStatus === 'disabled') { badgeOff() }
		else { changeCurrentTabUrl(); enableExtension() }
	})
})

