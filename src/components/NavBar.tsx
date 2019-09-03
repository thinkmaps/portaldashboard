import * as React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export interface INavBarProps {
  setFilter: any;
}

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

  public render() {

    return (
      <Navbar className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <Navbar.Brand className="navbar-brand col-sm-3 col-md-2 mr-0">
          Portal Dashboard
        </Navbar.Brand>
        <Nav><Nav.Item><Nav.Link onClick={this.onClick}>Reset</Nav.Link></Nav.Item></Nav>

        <Form inline className="w-100">
          <Form.Control type="text" placeholder="Filter" aria-label="Search" className="form-control-dark w-100" onKeyUp={this.onChange} ref={this.textInput} />
        </Form>


      </Navbar>
    );
  }
}
