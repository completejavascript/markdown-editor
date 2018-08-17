import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CodeMirror } from '../libs/codeMirror';

export default class Editor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const root = ReactDOM.findDOMNode(this);
    const textarea = root.querySelector('#editor');
    const themeSelected = this.props.themeSelected;

    this.codeMirrorEditor = CodeMirror.fromTextArea(textarea, {
      mode: "markdown",
      theme: themeSelected
    });

    this.codeMirrorEditor.on("change", _ => {
      this.props.onTextChanged({
        target: {
          value: this.codeMirrorEditor.getValue()
        }
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.markdownText !== this.props.markdownText ||
      nextProps.editMode !== this.props.editMode ||
      nextProps.readerMode !== this.props.readerMode ||
      nextProps.themeSelected !== this.props.themeSelected;
  }

  componentDidUpdate() {
    if (this.props.isOpenFromDisk) {
      this.codeMirrorEditor.setValue(this.props.markdownText);
      this.props.setOpenFromDiskFinished();
    } else if (this.props.isResetToDefault) {
      this.codeMirrorEditor.setValue(this.props.markdownText);
      this.props.setResetToDefaultFinished();
    }
    this.codeMirrorEditor.setOption("theme", this.props.themeSelected);
    this.codeMirrorEditor.refresh();
  }

  render() {
    const editorClassName = "editor " + (this.props.editMode ? "center" : this.props.readerMode ? "hide" : "");

    return (
      <div className={editorClassName}>
        <textarea id="editor" className="editor-textarea"
          onChange={this.props.onTextChanged}
          value={this.props.markdownText}>
        </textarea>
      </div>
    )
  }
}