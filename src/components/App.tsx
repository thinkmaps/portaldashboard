import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'

import "../css/App.css"

// FontAwesome icons
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faTools, faUser, faServer } from '@fortawesome/free-solid-svg-icons'

// Custom components
import NavBar from "./NavBar";
import SearchLink from "./SearchLink";
import Counter from "./Counter";
import Items from "./Items";
import LoginDialog from "./LoginDialog";

// Business objects
import { DashboardState, AppManager } from "../bo/AppManager";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { IPortal, IDashboardConfig } from "../bo/DashboardConfig";
import { ArcGis } from '../bo/ArcGis';

interface IAppProps { }
interface IAppState {
  activePortal: IPortal | undefined;
  items: Array<IItem | IUser | IServer>;
  filteredItems: Array<IItem | IUser | IServer>;
  filterTerm: string;
  state: DashboardState;
  config: IDashboardConfig | undefined;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;
  private filterTerm: string = "";

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], filteredItems: [], filterTerm: "", state: DashboardState.NOTLOGGEDIN, activePortal: undefined, config: undefined };
    this.app = new AppManager(new ArcGis("", "", ""));
  }

  public componentDidMount = () => {
    this.app.getConfig(this.updatePortals);
  }

  private updatePortals = (config: IDashboardConfig) => {
    this.setState({ config: config });
    if (config) {
      this.setState({ activePortal: config.portals[0] });
    }
  }

  public changePortal = (portal: IPortal) => {
    this.setState({ activePortal: portal });
  }

  private setAppState = (state: DashboardState) => {

    if (state === DashboardState.NOTLOGGEDIN || state === DashboardState.UNKNOWN) {
      this.setState({ items: [], filteredItems: [], state: state });
    }
    if (state === DashboardState.APP) {
      this.app.searchApps((apps: Array<IItem>) => this.filter(apps, state));
    }
    if (state === DashboardState.MAP) {
      this.app.searchMaps((maps: Array<IItem>) => this.filter(maps, state));
    }
    if (state === DashboardState.MAPIMAGELAYER) {
      this.app.searchMapLayers((mapLayers: Array<IItem>) => this.filter(mapLayers, state));
    }
    if (state === DashboardState.FEATURELAYER) {
      this.app.searchFeatureLayers((featureLayers: Array<IItem>) => this.filter(featureLayers, state));
    }
    if (state === DashboardState.TOOL) {
      this.app.searchTools((tools: Array<IItem>) => this.filter(tools, state));
    }
    if (state === DashboardState.USER) {
      this.app.searchUsers((users: Array<IUser>) => this.filter(users, state));
    }
    if (state === DashboardState.SERVER) {
      this.app.servers((server: Array<IServer>) => this.filter(server, state));
    }
  }

  private filter = (items: Array<any>, state: DashboardState) => {

    if (this.filterTerm.length === 0) {
      this.setState({ items: items, filteredItems: items, state: state });
    }
    else {
      let f = items.filter(item => {

        if (state === DashboardState.USER) {
          item = item as IUser;
          return (
            item.fullName.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
            item.username.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
            item.email.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
          )
        }

        if (this.state.state === DashboardState.APP ||
          this.state.state === DashboardState.MAP ||
          this.state.state === DashboardState.MAPIMAGELAYER ||
          this.state.state === DashboardState.FEATURELAYER ||
          this.state.state === DashboardState.TOOL) {
          item = item as IItem;
          return item.title.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
            item.owner.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
        }

        return false;
      });
      this.setState({ items: items, filteredItems: f, state: state })
    }
  }

  private setFilter = (e: string) => {
    this.filterTerm = e;
    this.filter(this.state.items, this.state.state);
  }

  private getColor = (): string => {
    if (this.state.state === DashboardState.SERVER) return "server"
    if (this.state.state === DashboardState.APP) return "app"
    if (this.state.state === DashboardState.MAP) return "map"
    if (this.state.state === DashboardState.MAPIMAGELAYER) return "mapLayer"
    if (this.state.state === DashboardState.FEATURELAYER) return "featureLayer"
    if (this.state.state === DashboardState.TOOL) return "tool"
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

  private getSearchLink = (icon: any, css: string, caption: string, state: DashboardState) => {
    return (<SearchLink key={this.app.getKey()}
      disabled={this.disabled()}
      icon={icon} css={css} caption={caption}
      action={() => this.setAppState(state)} />)
  }

  private getSearchLinks = () => {

    let searchLinks = [];
    if (this.state.config) {
      if (this.state.config.showApps) {
        searchLinks.push(this.getSearchLink(faTabletAlt, "app", "Web Apps", DashboardState.APP));
      }
      if (this.state.config.showMaps) {
        searchLinks.push(this.getSearchLink(faMap, "map", "Web Maps", DashboardState.MAP));
      }
      if (this.state.config.showMapayers) {
        searchLinks.push(this.getSearchLink(faLayerGroup, "mapLayer", "Map Image Layer", DashboardState.MAPIMAGELAYER));
      }
      if (this.state.config.showFeaturelayer) {
        searchLinks.push(this.getSearchLink(faDrawPolygon, "featureLayer", "Feature Layers", DashboardState.FEATURELAYER));
      }
      if (this.state.config.showTools) {
        searchLinks.push(this.getSearchLink(faTools, "tool", "Tools", DashboardState.TOOL));
      }
      if (this.state.config.showUsers) {
        searchLinks.push(this.getSearchLink(faUser, "user", "Users", DashboardState.USER));
      }
      if (this.state.config.showServer) {
        searchLinks.push(this.getSearchLink(faServer, "server", "Server", DashboardState.SERVER));
      }
    }
    return searchLinks;
  }

  public render() {
    return (
      <>
        <NavBar setFilter={this.setFilter}
          portals={this.state.config ? this.state.config.portals : undefined}
          setPortal={this.changePortal}
          activePortal={this.state.activePortal}
          dashboardState={this.state.state} />

        <Container fluid={true} >
          <Row>
            <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
              <div className="sidebar-sticky">
                {this.getSearchLinks()}
                <Counter cssClass={this.getColor()}
                  itemCount={this.state.items.length}
                  filteredItemCount={this.state.filteredItems.length} />
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
