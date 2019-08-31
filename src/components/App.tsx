import * as React from 'react';
// React components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// FontAwesome icons
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faUser } from '@fortawesome/free-solid-svg-icons'

// Custom components
import NavBar from "./NavBar";
import SearchLink from "./SearchLink";

// Business objects
import AppManager from "../bo/AppManager";

// CSS style sheet
import "./App.css"

interface IAppProps { }
interface IAppState {
}

enum AppState {
  MAP,
  APP,
  MAPIMAGELAYER,
  FEATAURELAYER,
  USER
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;

  constructor(props: IAppProps) {
    super(props);
    this.app = new AppManager();
  }

  private displayMaps = (e: any) => {
    console.log(e);
  }

  private displayUsers = (e: any) => {
    console.log(e);
  }


  public render() {

    return (
      /* This is the general page layout */
      < Container fluid={true} >

        {/* First row is a navigation bar */}
        <Row>
          <Col className="navBar">
            <NavBar />
          </Col>
        </Row>

        {/* Second row contains a sidebar and the main panel */}
        <Row>
          <Col className="col-2 sidebar">

            <Row>
              <Col>
                <nav className="nav flex-column">
                  <SearchLink icon={faMap} css="icon map" caption="Web Maps" action={() => this.app.searchMaps(this.displayMaps)} />
                  <SearchLink icon={faUser} css="icon user" caption="Users" action={() => this.app.searchUsers(this.displayUsers)} />
                </nav>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="counter">9999</div>
              </Col>
            </Row>


          </Col>
          <Col className="col-10 main">

          </Col>
        </Row>
      </Container >

    );
  }
}
