export default class Storage {
  constructor(type) {
    if (this._storageAvailable(type)) {
      this.storage = window[type];
    } else {
      console.log(`Your browser doesn't support ${type}!`);
    }
  }

  get markdownText() {
    if (this.storage) return this.storage.getItem("markdown-text");
  }

  set markdownText(text) {
    if (this.storage) this.storage.setItem("markdown-text", text);
  }

  get themeSelected() {
    if (this.storage) return this.storage.getItem("theme-selected");
  }

  set themeSelected(themeName) {
    if (this.storage) this.storage.setItem("theme-selected", themeName);
  }

  _storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      console.log(e);
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }
}