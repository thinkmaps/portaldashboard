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
import Items from "./Items";

// Business objects
import { AppState, AppManager } from "../bo/AppManager";
import { Item, User } from "../bo/ItemTypes";

// CSS style sheet
import "./App.css"

interface IAppProps { }
interface IAppState {
  items: Array<Item | User>;
  type: AppState;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], type: AppState.MAP };
    this.app = new AppManager();
  }

  private displayApps = (e: any) => {
    this.setState({ items: e, type: AppState.APP });
  }

  private displayMaps = (e: any) => {
    this.setState({ items: e, type: AppState.MAP });
  }

  private displayUsers = (e: any) => {
    this.setState({ items: e, type: AppState.USER });
  }

  private displayMapImageLayers = (e: any) => {
    this.setState({ items: e, type: AppState.MAPIMAGELAYER });
  }

  private displayFeatureLayers = (e: any) => {
    this.setState({ items: e, type: AppState.FEATAURELAYER });
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
                  <SearchLink icon={faTabletAlt} css="icon app" caption="Web Apps" action={() => this.app.searchApps(this.displayApps)} />
                  <SearchLink icon={faMap} css="icon map" caption="Web Maps" action={() => this.app.searchMaps(this.displayMaps)} />
                  <SearchLink icon={faLayerGroup} css="icon mapLayer" caption="Map Image Layer" action={() => this.app.searchMapLayers(this.displayMapImageLayers)} />
                  <SearchLink icon={faDrawPolygon} css="icon featureLayer" caption="Feature Layers" action={() => this.app.searchFeatureLayers(this.displayFeatureLayers)} />
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
            <Items items={this.state.items} type={this.state.type} />
          </Col>
        </Row>
      </Container >

    );
  }
}
