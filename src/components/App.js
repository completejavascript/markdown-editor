import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Storage from '../libs/storage';
import { markdownToHTML } from '../libs/markdownConverter';
import NavBar from './NavBar';
import Editor from './Editor';
import Previewer from './Previewer';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.mapThemeLoaded = {};
    this.storage = new Storage("localStorage");
    this.state = {
      editMode: false,
      readerMode: false,
      isOpenFromDisk: false,
      isResetToDefault: false,
      themeSelected: this.storage.themeSelected || this.props.defaultTheme,
      markdownText: this.storage.markdownText || this.props.defaultText
    }

    this.onTextChanged = this.onTextChanged.bind(this);
    this.onToggleEditMode = this.onToggleEditMode.bind(this);
    this.onToggleReaderMode = this.onToggleReaderMode.bind(this);
    this.onSaveAsHTML = this.onSaveAsHTML.bind(this);
    this.onOpenFromDisk = this.onOpenFromDisk.bind(this);
    this.onEditorScroll = this.onEditorScroll.bind(this);
    this.onPreviewScroll = this.onPreviewScroll.bind(this);
    this.setOpenFromDiskFinished = this.setOpenFromDiskFinished.bind(this);
    this.onThemeSelectChanged = this.onThemeSelectChanged.bind(this);
    this.onResetToDefault = this.onResetToDefault.bind(this);
    this.setResetToDefaultFinished = this.setResetToDefaultFinished.bind(this);

    this.loadCodeMirrorThemeCSS(this.state.themeSelected);
  }

  loadCodeMirrorThemeCSS(name) {
    if (name === this.props.defaultTheme || this.mapThemeLoaded[name]) return;

    this.mapThemeLoaded[name] = true;

    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = `./lib/codemirror-5.39.2/theme/${name}.css`;

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);

    return link;
  }

  setOpenFromDiskFinished() {
    this.setState({
      isOpenFromDisk: false
    });
  }

  setResetToDefaultFinished() {
    this.setState({
      isResetToDefault: false
    });
  }

  onThemeSelectChanged({ target }) {
    const name = target.value;
    this.storage.themeSelected = name;

    this.loadCodeMirrorThemeCSS(name);
    this.setState({
      themeSelected: name
    });
  }

  onResetToDefault() {
    this.storage.themeSelected = this.props.defaultTheme;
    this.storage.markdownText = this.props.defaultText;

    this.setState({
      isResetToDefault: true,
      themeSelected: this.props.defaultTheme,
      markdownText: this.props.defaultText
    });
  }

  onToggleEditMode() {
    const newEditModeState = !this.state.editMode;
    const newReaderModeState = newEditModeState ? false : this.state.readerMode;

    this.setState({
      readerMode: newReaderModeState,
      editMode: newEditModeState
    });
  }

  onToggleReaderMode() {
    const newReaderModeState = !this.state.readerMode;
    const newEditModeState = newReaderModeState ? false : this.state.editMode;

    this.setState({
      readerMode: newReaderModeState,
      editMode: newEditModeState
    });
  }

  onSaveAsHTML() {
    const content = markdownToHTML(this.state.markdownText);
    const fileName = "export.html";

    if (navigator.msSaveBlob) { // IE
      navigator.msSaveBlob(new Blob([content], { type: 'text/html;charset=utf-8;' }), fileName);
    } else {
      const a = document.createElement('a');
      a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(content);
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  onOpenFromDisk() {
    const input = document.body.appendChild(
      document.createElement("input")
    );
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".md, .txt");

    input.addEventListener("change", ({ target }) => {
      if (target.files && target.files[0]) {
        const fileReader = new FileReader();
        fileReader.onload = ({ target }) => {
          const text = target.result;
          this.storage.markdownText = text;

          this.setState({
            markdownText: text,
            isOpenFromDisk: true
          });
          document.body.removeChild(input);
        }
        fileReader.readAsText(target.files[0]);
      }
    });
    input.click();
  }

  onTextChanged({ target }) {
    const text = target.value;
    this.storage.markdownText = text;

    this.setState({
      markdownText: text
    });
  }

  componentDidMount() {
    const root = ReactDOM.findDOMNode(this);
    this.previewElm = root.querySelector('#preview');
    this.editorElm = root.querySelector('.CodeMirror-vscrollbar');

    if (this.previewElm) this.previewElm.addEventListener('scroll', this.onPreviewScroll);
    if (this.editorElm) this.editorElm.addEventListener('scroll', this.onEditorScroll);
  }

  onPreviewScroll() {
    this.editorElm.removeEventListener("scroll", this.onEditorScroll);
    this.editorElm.scrollTop = this.previewElm.scrollTop;

    window.clearTimeout(this.isPreviewScrolling);
    this.isPreviewScrolling = setTimeout(() => {
      this.editorElm.addEventListener("scroll", this.onEditorScroll);
    }, 33);
  }

  onEditorScroll() {
    this.previewElm.removeEventListener("scroll", this.onPreviewScroll);
    this.previewElm.scrollTop = this.editorElm.scrollTop;

    window.clearTimeout(this.isEditorScrolling);
    this.isEditorScrolling = setTimeout(() => {
      this.previewElm.addEventListener("scroll", this.onPreviewScroll);
    }, 33);
  }

  render() {
    return (
      <div>
        <NavBar
          editMode={this.state.editMode}
          readerMode={this.state.readerMode}
          themeSelected={this.state.themeSelected}
          defaultTheme={this.props.defaultTheme}
          themes={this.props.themes}
          onToggleEditMode={this.onToggleEditMode}
          onToggleReaderMode={this.onToggleReaderMode}
          onSaveAsHTML={this.onSaveAsHTML}
          onOpenFromDisk={this.onOpenFromDisk}
          onThemeSelectChanged={this.onThemeSelectChanged}
          onResetToDefault={this.onResetToDefault}
        />
        <div className="workspace">
          <Editor
            markdownText={this.state.markdownText}
            editMode={this.state.editMode}
            readerMode={this.state.readerMode}
            themeSelected={this.state.themeSelected}
            isOpenFromDisk={this.state.isOpenFromDisk}
            isResetToDefault={this.state.isResetToDefault}
            onTextChanged={this.onTextChanged}
            setOpenFromDiskFinished={this.setOpenFromDiskFinished}
            setResetToDefaultFinished={this.setResetToDefaultFinished}
          />
          <Previewer
            markdownText={this.state.markdownText}
            readerMode={this.state.readerMode}
            editMode={this.state.editMode}
          />
        </div>
      </div>
    )
  }
}