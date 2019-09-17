import * as React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { IPortal } from '../bo/Portals';
import LoginManager from "../bo/LoginManager";

interface ILoginDialogProps {
  portal: IPortal | undefined; // the portal to log in
  onClose: any; // function to call, when the dialog is closed by hitting the close button ot the "x".
}

interface ILoginDialogState {
  show: boolean; // visibility state if the dialog.
  message: string;
}

export default class LoginDialog extends React.Component<ILoginDialogProps, ILoginDialogState> {

  // the references to the HTMLInputElements for username and password.
  private usernameInput: React.RefObject<any>;
  private passwordInput: React.RefObject<any>;
  private loginManager: LoginManager;
  private portal: IPortal | undefined;
  private message: string = "Please type in your credentials.";
  private errorMessage: string = "Invalid credentials. Unable to log in.";

  constructor(props: ILoginDialogProps) {
    super(props);
    this.state = { show: true, message: this.message };
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.loginManager = new LoginManager();
    this.portal = undefined;
  }

  private onLoad = () => {
    if (this.props.portal) {
      this.loginManager.loginToPortal(this.props.portal.url, (arcgis: any) => {
        if (arcgis === undefined) {
          this.setState({ message: this.errorMessage })
        }
        this.props.onClose(arcgis);
        this.setState({ show: arcgis === undefined });
      });
    }
  }

  private onCloseButtonClick = () => {
    this.props.onClose(undefined);
    this.setState({ show: false, message: this.message });
  }


  private onLoginButtonClick = () => {

    if (this.props.portal) {
      // Read values form the textboxes and call the function defined by the app.
      let usernameInput = this.usernameInput.current as HTMLInputElement;
      let passwordInput = this.passwordInput.current as HTMLInputElement;
      this.loginManager.setCredentials(this.props.portal.url, usernameInput.value, passwordInput.value);
      this.onLoad();
    }
  }

  public componentDidUpdate = () => {
    if (this.portal === undefined) {
      this.portal = this.props.portal;
      this.onLoad();
    }

    if (this.props.portal && this.portal) {
      if (this.props.portal.url !== this.portal.url) {
        this.portal = this.props.portal;
        this.onLoad();
      }
    }
  }

  private onKeyUp = (e: any) => {
    if (e && e.keyCode) {
      if (e.keyCode === 13 && e.shiftKey === false) {
        e.preventDefault();
        this.onLoginButtonClick();
      }
    }
  }

  public render() {

    return (

      <Modal show={this.state.show} onHide={this.onCloseButtonClick} >

        <Modal.Header closeButton >
          <Modal.Title>Login for: {this.props.portal ? this.props.portal.name : ""}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username:</Form.Label>
              <Form.Control type="text" placeholder="Enter username" ref={this.usernameInput} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" placeholder="Enter password" ref={this.passwordInput} onKeyUp={this.onKeyUp} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>{this.state.message}</Form.Label>
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.onCloseButtonClick}>Cancel</Button>
          <Button variant="primary" onClick={this.onLoginButtonClick}>Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
