import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'

import "./App.css"

// FontAwesome icons
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faUser, faServer } from '@fortawesome/free-solid-svg-icons'

// Custom components
import NavBar from "./NavBar";
import SearchLink from "./SearchLink";
import Counter from "./Counter";
import Items from "./Items";
import LoginDialog from "./LoginDialog";

// Business objects
import { DashboardState, AppManager } from "../bo/AppManager";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { IPortal } from "../bo/Portals";
import { ArcGis } from '../bo/ArcGis';

interface IAppProps { }
interface IAppState {
  portals: Array<IPortal>;
  activePortal: IPortal | undefined;
  items: Array<IItem | IUser | IServer>;
  filteredItems: Array<IItem | IUser | IServer>;
  filterTerm: string;
  state: DashboardState;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;
  private filterTerm: string = "";

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], filteredItems: [], filterTerm: "", state: DashboardState.NOTLOGGEDIN, portals: [], activePortal: undefined };
    this.app = new AppManager(new ArcGis("", "", ""));
  }

  public componentDidMount = () => {
    this.app.getPortalsFromConfig(this.updatePortals);
  }

  private updatePortals = (portals: Array<IPortal>) => {
    this.setState({ portals: portals });
    this.setState({ portals: portals, activePortal: portals[0] });
  }

  public changePortal = (portal: IPortal) => {
    this.setState({ activePortal: portal });
  }

  private setAppState = (state: DashboardState) => {

    if (state === DashboardState.NOTLOGGEDIN) {
      this.setState({ items: [], filteredItems: [], state: state });
    }

    if (state === DashboardState.UNKNOWN) {
      this.setState({ items: [], filteredItems: [], state: state });
    }

    if (state === DashboardState.APP) {
      this.app.searchApps((apps: Array<IItem>) => {
        this.setState({ items: apps, filteredItems: apps, state: state });
        this.filter();
      });
    }
    if (state === DashboardState.MAP) {
      this.app.searchMaps((maps: Array<IItem>) => {
        this.setState({ items: maps, filteredItems: maps, state: state });
        this.filter();
      });
    }
    if (state === DashboardState.MAPIMAGELAYER) {
      this.app.searchMapLayers((mapLayers: Array<IItem>) => {
        this.setState({ items: mapLayers, filteredItems: mapLayers, state: state });
        this.filter();
      });
    }
    if (state === DashboardState.FEATAURELAYER) {
      this.app.searchFeatureLayers((featureLayers: Array<IItem>) => {
        this.setState({ items: featureLayers, filteredItems: featureLayers, state: state });
        this.filter();
      });
    }
    if (state === DashboardState.USER) {
      this.app.searchUsers((users: Array<IUser>) => {
        this.setState({ items: users, filteredItems: users, state: state });
        this.filter();
      });
    }
    if (state === DashboardState.SERVER) {
      this.app.servers((server: Array<IServer>) => {
        this.setState({ items: server, filteredItems: server, state: state });
      });
    }
  }

  private filter = () => {

    if (this.filterTerm.length === 0) this.setState({ filteredItems: this.state.items });

    let f = this.state.items.filter(item => {

      if (this.state.state === DashboardState.USER) {
        item = item as IUser;
        return (
          item.fullName.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.username.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.email.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
        )
      }

      if (this.state.state === DashboardState.APP || this.state.state === DashboardState.MAP || this.state.state === DashboardState.MAPIMAGELAYER || this.state.state === DashboardState.FEATAURELAYER) {
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

  private getColor = (): string => {
    if (this.state.state === DashboardState.SERVER) return "server"
    if (this.state.state === DashboardState.APP) return "app"
    if (this.state.state === DashboardState.MAP) return "map"
    if (this.state.state === DashboardState.MAPIMAGELAYER) return "mapLayer"
    if (this.state.state === DashboardState.FEATAURELAYER) return "featureLayer"
    if (this.state.state === DashboardState.USER) return "user"
    if (this.state.state === DashboardState.UNKNOWN) return "transparent"
    return "";
  }

  private closeLoginDialog = (arcgis: any) => {

    if (arcgis) {
      this.app = new AppManager(arcgis);
      if (this.state.state === DashboardState.NOTLOGGEDIN) {
        this.setAppState(DashboardState.UNKNOWN);
      }
      this.setAppState(this.state.state);
    } else {
      this.setAppState(DashboardState.NOTLOGGEDIN);
      this.app = new AppManager(new ArcGis("", "", ""));
    }
  }

  private disabled = () => this.state.state === DashboardState.NOTLOGGEDIN;

  public render() {
    return (
      <>
        <NavBar setFilter={this.setFilter}
          portals={this.state.portals}
          setPortal={this.changePortal}
          activePortal={this.state.activePortal}
          dashboardState={this.state.state} />

        <Container fluid={true} >
          <Row>

            <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
              <div className="sidebar-sticky">

                <SearchLink disabled={this.disabled()} icon={faTabletAlt} css="app" caption="Web Apps" action={() => this.setAppState(DashboardState.APP)} />
                <SearchLink disabled={this.disabled()} icon={faMap} css="map" caption="Web Maps" action={() => this.setAppState(DashboardState.MAP)} />
                <SearchLink disabled={this.disabled()} icon={faLayerGroup} css="mapLayer" caption="Map Image Layer" action={() => this.setAppState(DashboardState.MAPIMAGELAYER)} />
                <SearchLink disabled={this.disabled()} icon={faDrawPolygon} css="featureLayer" caption="Feature Layers" action={() => this.setAppState(DashboardState.FEATAURELAYER)} />
                <SearchLink disabled={this.disabled()} icon={faUser} css="user" caption="Users" action={() => this.setAppState(DashboardState.USER)} />
                <SearchLink disabled={this.disabled()} icon={faServer} css="server" caption="Server" action={() => this.setAppState(DashboardState.SERVER)} />

                <Counter cssClass={this.getColor()} itemCount={this.state.items.length} filteredItemCount={this.state.filteredItems.length} />

              </div>

            </nav>

            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Items items={this.state.filteredItems} dashboardState={this.state.state} app={this.app} />
            </main>

          </Row>
        </ Container>

        <LoginDialog portal={this.state.activePortal!} onClose={this.closeLoginDialog} />

      </>);
  }
}
