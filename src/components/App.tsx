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
import Dependencies from "./Dependencies";

// Business objects
import { AppState, AppManager } from "../bo/AppManager";
import { Item, User } from "../bo/ItemTypes";
import { Dependency } from '../bo/Dependencies';

// CSS style sheet
import "./App.css"

interface IAppProps { }
interface IAppState {
  items: Array<Item | User>;
  type: AppState;
  dependencies: Array<Dependency>;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], type: AppState.MAP, dependencies: [] };
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

  private getItemDep = () => {

    this.app.getAllDependencies(this.showDep, "94ea6de850214355af4eefd76f31c846", true, true, true);

    // kputte Map 94ea6de850214355af4eefd76f31c846
    // MapImageLayer Bundesländer d16a2201300b4676b09f385264ed0c7d
    // Map Bundesländer 6bdb29c036b64176839c86c9c2f55f71

    // MapImageLayer Wetterstationen b18b9e0d4fa841818997554a53508d6e
    // Map Wetterstationen c17c8011750347b7bf14d1b8fa686d9e
    // FeatureLayer Wetterstationen a7dabede7b9548e99fb8e1833f5f102a

    // Bundesländer_Wetterstationen_Map 68a523ad147749b9ab172a6eb77f77f0
    // Wetterstationen_App e1dbac700e654ce08620f49c69066068


    // map 7f2e752eb12d418bbd7b064994393f76
    // app cc1cf4dc9948476aba6b5c0bae36ce48
    // this.app.getItemDependenciesTo(this.showDep, "b70115868061469fbf06a79ecec924eb");
    return <div></div>
  }

  private showDep = (e: Dependency) => {

    // // 1. copy the current state
    const dependencies = [...this.state.dependencies];
    // // 2. add value
    dependencies.push(e);
    // // 3. Update state
    this.setState({ dependencies: dependencies });

  }

  public componentDidMount() {
    this.getItemDep();
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
                <div className="counter"></div>
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
