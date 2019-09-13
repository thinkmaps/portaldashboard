import * as React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface ILoginDialogProps {
  show: boolean;
  portalName: string;
  close: any;
}

export default class LoginDialog extends React.Component<ILoginDialogProps> {

  private userInput: React.RefObject<any>;
  private passWordInput: React.RefObject<any>;

  constructor(props: ILoginDialogProps) {
    super(props);
    this.userInput = React.createRef();
    this.passWordInput = React.createRef();
  }

  private onLogin = () => {
    let userInput = this.userInput.current as HTMLInputElement;
    let passWordInput = this.passWordInput.current as HTMLInputElement;
    console.log(userInput.value, passWordInput.value);
  }

  public render() {

    return (
      <Modal show={this.props.show} onHide={this.props.close}>

        <Modal.Header closeButton >
          <Modal.Title>Login for: {this.props.portalName}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username:</Form.Label>
              <Form.Control type="text" placeholder="Enter username" ref={this.userInput} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" placeholder="Password" ref={this.passWordInput} />
            </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.close}>Cancel</Button>
          <Button variant="primary" onClick={this.onLogin}>Login</Button>
        </Modal.Footer>
      </Modal>

    );
  }
}
