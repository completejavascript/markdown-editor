import React, { Component } from 'react';
import { markdownToHTML } from '../libs/markdownConverter';

export default class Previewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const previewerClassName = "previewer " + (this.props.readerMode ? "center" : this.props.editMode ? "hide" : "");
    const htmlContent = markdownToHTML(this.props.markdownText);

    return (
      <div className={previewerClassName}>
        <div id="preview"
          className="previewer-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}>
        </div>
      </div>
    )
  }
}