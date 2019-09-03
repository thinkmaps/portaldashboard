import * as React from 'react';
import Nav from 'react-bootstrap/Nav'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ISearchLinkProps {
  icon: any;
  css: string;
  caption: string;
  action: any;
}

export default class SearchLink extends React.Component<ISearchLinkProps> {

  public render() {
    return (
      <Nav.Item>
        <Nav.Link href="#" onClick={this.props.action} className={this.props.css}>
          <FontAwesomeIcon icon={this.props.icon} className={"icon " + this.props.css} /> {this.props.caption}
        </Nav.Link>
      </Nav.Item>
    );
  }
}
