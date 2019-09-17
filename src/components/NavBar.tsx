import * as React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { IPortal } from "../bo/Portals";
import { DashboardState } from "../bo/AppManager";

export interface INavBarProps {
  setFilter: any;
  portals: Array<IPortal>;
  dashboardState: DashboardState;
  activePortal: IPortal | undefined;
  setPortal: any;
}

// TODOs:
// - strikethrough the portal name, if credentials are invalid

export default class NavBar extends React.Component<INavBarProps> {

  private textInput: React.RefObject<any>;

  constructor(props: INavBarProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.textInput = React.createRef();
  }

  private onChange = () => {
    let inputElement = this.textInput.current as HTMLInputElement;
    if (inputElement) this.props.setFilter(inputElement.value);
  }

  private onClick = () => {
    let inputElement = this.textInput.current as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
      this.props.setFilter(inputElement.value);
    }
  }

  private onPortalClick = (portal: IPortal) => {
    this.props.setPortal(portal)
  }

  private getPortalLinks = () => {
    if (this.props.portals) {
      return this.props.portals.map(portal =>
        <NavDropdown.Item href={"#/" + portal.name}
          key={portal.name}
          title={portal.url}
          onClick={() => this.onPortalClick(portal)}>{portal.name}
        </NavDropdown.Item>)
    }
  }

  private getBrandStyle = () => this.props.dashboardState === DashboardState.NOTLOGGEDIN ? "portal strike" : "portal";


  public render() {

    return (
      <Navbar className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <Navbar.Brand className={"navbar-brand col-sm-3 col-md-2 mr-0 " + this.getBrandStyle()}>
          <FontAwesomeIcon icon={faHome} className="portal" />
          {this.props.activePortal ? this.props.activePortal.name : ""}
        </Navbar.Brand>
        <Nav className="mr-auto">
          <NavDropdown title="Change Portal" id="basic-nav-dropdown">
            {this.getPortalLinks()}
          </NavDropdown>
        </Nav>

        <Form inline>
          <Form.Control type="text" placeholder="Filter" aria-label="Search" className="form-control-dark mr-sm-2" onKeyUp={this.onChange} ref={this.textInput} />
          <Button variant="secondary" onClick={this.onClick}>Reset</Button>
        </Form>

      </Navbar>
    );
  }
}
