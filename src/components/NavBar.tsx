import * as React from 'react';

export interface INavBarProps {
}

export default class NavBar extends React.Component<INavBarProps> {
  public render() {

    // TODO: Change to react-bootstrap
    return (
      <nav className="navbar navbar-dark">
        <a className="navbar-brand" href="#">Portal Dashboard</a>
        <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
        </form>
      </nav>
    );
  }
}
