import * as React from 'react';
import Nav from 'react-bootstrap/Nav'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ISearchLinkProps {
  icon: any;
  css: string;
  caption: string;
  action: any;
  disabled: boolean;
}

export default class SearchLink extends React.Component<ISearchLinkProps> {

  private getCss = () => this.props.disabled ? "icon disabled" : `icon ${this.props.css}`;


  public render() {
    return (
      <Nav.Item>
        <Nav.Link href="#" onClick={this.props.action} className={this.props.css} disabled={this.props.disabled}>
          <FontAwesomeIcon icon={this.props.icon} className={this.getCss()} /> {this.props.caption}
        </Nav.Link>
      </Nav.Item>
    );
  }
}
