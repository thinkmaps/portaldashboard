import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'

import "./App.css"

// FontAwesome icons
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faUser, faServer } from '@fortawesome/free-solid-svg-icons'

// Custom components
import NavBar from "./NavBar";
import SearchLink from "./SearchLink";
import Items from "./Items";
import LoginDialog from "./LoginDialog";

// Business objects
import { AppState, AppManager } from "../bo/AppManager";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { IPortal } from "../bo/Portals";

interface IAppProps { }
interface IAppState {
  portals: Array<IPortal>;
  activePortal: string;
  items: Array<IItem | IUser | IServer>;
  filteredItems: Array<IItem | IUser | IServer>;
  filterTerm: string;
  state: AppState;
  loginOpen: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;
  private filterTerm: string = "";

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], filteredItems: [], filterTerm: "", state: AppState.UNKNOWN, portals: [], activePortal: "", loginOpen: true };
    this.app = new AppManager();
  }

  public componentDidMount = () => {
    this.app.getPortalsFromConfig(this.updatePortals);
  }

  private updatePortals = (portals: Array<IPortal>) => {
    this.app.setPortal(portals[0]);
    this.setState({ portals: portals, activePortal: portals[0].name });
  }

  public setPortal = (portal: IPortal) => {
    this.app.setPortal(portal);
    this.setState({ activePortal: portal.name });
    this.setAppState(this.state.state);
  }

  private setAppState = (state: AppState) => {

    if (state === AppState.APP) {
      this.app.searchApps((apps: Array<IItem>) => {
        this.setState({ items: apps, filteredItems: apps, state: AppState.APP });
        this.filter();
      });
    }
    if (state === AppState.MAP) {
      this.app.searchMaps((maps: Array<IItem>) => {
        this.setState({ items: maps, filteredItems: maps, state: AppState.MAP });
        this.filter();
      });
    }
    if (state === AppState.MAPIMAGELAYER) {
      this.app.searchMapLayers((mapLayers: Array<IItem>) => {
        this.setState({ items: mapLayers, filteredItems: mapLayers, state: AppState.MAPIMAGELAYER });
        this.filter();
      });
    }
    if (state === AppState.FEATAURELAYER) {
      this.app.searchMapLayers((featureLayers: Array<IItem>) => {
        this.setState({ items: featureLayers, filteredItems: featureLayers, state: AppState.FEATAURELAYER });
        this.filter();
      });
    }
    if (state === AppState.USER) {
      this.app.searchUsers((users: Array<IUser>) => {
        this.setState({ items: users, filteredItems: users, state: AppState.USER });
        this.filter();
      });
    }
    if (state === AppState.SERVER) {
      this.app.servers((server: Array<IServer>) => {
        this.setState({ items: server, filteredItems: server, state: AppState.SERVER });
      });
    }

  }

  private filter = () => {

    if (this.filterTerm.length === 0) this.setState({ filteredItems: this.state.items });

    let f = this.state.items.filter(item => {

      if (this.state.state === AppState.USER) {
        item = item as IUser;
        return (
          item.fullName.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.username.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.email.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
        )
      }

      if (this.state.state === AppState.APP || this.state.state === AppState.MAP || this.state.state === AppState.MAPIMAGELAYER || this.state.state === AppState.FEATAURELAYER) {
        item = item as IItem;
        return item.title.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 || item.owner.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
      }

      return false;
    });
    this.setState({ filteredItems: f })

  }

  private setFilter = (e: string) => {
    this.filterTerm = e;
    this.filter();
  }

  private getColor = () => {
    if (this.state.state === AppState.SERVER) return "server"
    if (this.state.state === AppState.APP) return "app"
    if (this.state.state === AppState.MAP) return "map"
    if (this.state.state === AppState.MAPIMAGELAYER) return "mapLayer"
    if (this.state.state === AppState.FEATAURELAYER) return "featureLayer"
    if (this.state.state === AppState.USER) return "user"
    if (this.state.state === AppState.UNKNOWN) return "transparent"
  }

  private closeLoginDialog = () => {
    this.setState({ loginOpen: false });
  }

  public render() {
    return (
      <>
        <NavBar setFilter={this.setFilter} portals={this.state.portals} setPortal={this.setPortal} activePortal={this.state.activePortal} />
        <Container fluid={true} >
          <Row>

            <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
              <div className="sidebar-sticky">

                <SearchLink icon={faTabletAlt} css="app" caption="Web Apps" action={() => this.setAppState(AppState.APP)} />
                <SearchLink icon={faMap} css="map" caption="Web Maps" action={() => this.setAppState(AppState.MAP)} />
                <SearchLink icon={faLayerGroup} css="mapLayer" caption="Map Image Layer" action={() => this.setAppState(AppState.MAPIMAGELAYER)} />
                <SearchLink icon={faDrawPolygon} css="featureLayer" caption="Feature Layers" action={() => this.setAppState(AppState.FEATAURELAYER)} />
                <SearchLink icon={faUser} css="user" caption="Users" action={() => this.setAppState(AppState.USER)} />
                <SearchLink icon={faServer} css="server" caption="Server" action={() => this.setAppState(AppState.SERVER)} />

                <div className="counterWrapper">
                  <div className={"counter " + this.getColor()}>Items total:</div>
                  <div className={"counter large " + this.getColor()}>{this.state.items.length}</div>
                </div>
                <div className="counterWrapper"></div>
                <div className={"counter " + this.getColor()}>Items filtered:</div>
                <div className={"counter large " + this.getColor()}>{this.state.filteredItems.length}</div>
              </div>

            </nav>

            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Items items={this.state.filteredItems} type={this.state.state} app={this.app} />
            </main>

          </Row>
        </ Container>

        <LoginDialog show={this.state.loginOpen} portalName={this.state.activePortal} close={this.closeLoginDialog} />

      </>);
  }
}
