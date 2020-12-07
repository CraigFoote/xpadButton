'use strict';

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Util = imports.misc.util;

let xpadButton;

function init() {
	log(`Initializing ${Extension.metadata.name} version ${Extension.metadata.version}`);
}


// Object prototype
const XpadButton = GObject.registerClass(
	class MyPopup extends PanelMenu.Button {
		_init() {
			super._init(0);

			// panel button
			let icon = new St.Icon({
				gicon: Gio.icon_new_for_string(Extension.dir.get_path() + '/xpad.svg'),
				style_class: 'system-status-icon',
			});
			this.add_child(icon);

			// 'new' menu item
			let newPad = new PopupMenu.PopupImageMenuItem('New Xpad',
				new Gio.ThemedIcon({
					name: "document-new-symbolic"
				})
			);
			this.menu.addMenuItem(newPad);
			newPad.connect('activate', () => {
				try {
					Util.trySpawnCommandLine("xpad --new");
				} catch (err) {
					logError(err, `Error in ${Extension.metadata.name} version ${Extension.metadata.version}`);
					Main.notify('Extension Error', 'Is Xpad installed?');
				}
			});

			// 'show/hide' menu item
			let showHidePads = new PopupMenu.PopupImageMenuItem('Show/Hide All Xpads',
				new Gio.ThemedIcon({
					name: "view-paged-symbolic"
				})
			);
			this.menu.addMenuItem(showHidePads);
			showHidePads.connect('activate', () => {
				try {
					Util.trySpawnCommandLine("xpad --toggle");
				} catch (err) {
					logError(err, `Error in ${Extension.metadata.name} version ${Extension.metadata.version}`);
					Main.notify('Extension Error', 'Is Xpad installed?');
				}
			});
		}
	});

function enable() {
	xpadButton = new XpadButton();
	Main.panel.addToStatusArea('xpadButton', xpadButton, 1);
}

function disable() {
	log(`Disabling ${Extension.metadata.name} version ${Extension.metadata.version}`);
	if (xpadButton !== null) {
		xpadButton.destroy();
	}
}
