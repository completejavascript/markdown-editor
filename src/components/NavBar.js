import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const root = ReactDOM.findDOMNode(this);
    this.themeSelectElm = root.querySelector('select');

    for (var i = 0; i < this.themeSelectElm.options.length; i++) {
      if (this.themeSelectElm.options[i].value === this.props.themeSelected) {
        this.themeSelectElm.selectedIndex = i;
        break;
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.editMode !== this.props.editMode ||
      nextProps.readerMode !== this.props.readerMode ||
      nextProps.themeSelected !== this.props.themeSelected;
  }

  componentDidUpdate() {
    for (var i = 0; i < this.themeSelectElm.options.length; i++) {
      if (this.themeSelectElm.options[i].value === this.props.themeSelected) {
        this.themeSelectElm.selectedIndex = i;
        break;
      }
    }
  }

  render() {
    const editModeClassName = "fas fa-pencil-alt navbar-wrapper-icon" + (this.props.editMode ? " choosen" : "");
    const readerModeClassName = "fas fa-eye navbar-wrapper-icon" + (this.props.readerMode ? " choosen" : "");
    const saveAsHTMLClassName = "fas fa-download navbar-wrapper-icon";
    const openFromDiskClassName = "fas fa-upload navbar-wrapper-icon";
    const resetToDefaultClassName = "fas fa-undo navbar-wrapper-icon";

    return (
      <nav className="navbar">
        <div className="navbar-wrapper name">
          <h1 className="navbar-wrapper-name">
            <a href="https://github.com/completejavascript/markdown-editor">Markdown Editor</a>
          </h1>
        </div>
        <div className="navbar-wrapper">
          <select className="navbar-wraper-select-theme" onChange={this.props.onThemeSelectChanged} title="Change theme">
            <option value="select-a-theme" disabled>Select a theme</option>
            <option value={this.props.defaultTheme}>default</option>
            {
              this.props.themes.map((themeName, index) => {
                return <option key={index} value={themeName}>{themeName}</option>
              })
            }
          </select>
          <i className={editModeClassName} onClick={this.props.onToggleEditMode} title="Edit mode"></i>
          <i className={readerModeClassName} onClick={this.props.onToggleReaderMode} title="Reader mode"></i>
          <i className={saveAsHTMLClassName} onClick={this.props.onSaveAsHTML} title="Save as HTML"></i>
          <i className={openFromDiskClassName} onClick={this.props.onOpenFromDisk} title="Open from Disk"></i>
          <i className={resetToDefaultClassName} onClick={this.props.onResetToDefault} title="Reset to Default"></i>
        </div>
      </nav>
    )
  }
}