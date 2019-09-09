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

// Business objects
import { AppState, AppManager } from "../bo/AppManager";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";

interface IAppProps { }
interface IAppState {
  items: Array<IItem | IUser | IServer>;
  filteredItems: Array<IItem | IUser | IServer>;
  filterTerm: string;
  type: AppState;
}

export default class App extends React.Component<IAppProps, IAppState> {

  private app: AppManager;
  private filterTerm: string = "";

  constructor(props: IAppProps) {
    super(props);
    this.state = { items: [], filteredItems: [], filterTerm: "", type: AppState.UNKNOWN };
    this.app = new AppManager();
  }

  private displayServer = (servers: Array<IServer>) => {
    this.setState({ items: servers, filteredItems: servers, type: AppState.SERVER });
  }

  private displayApps = (e: any) => {
    this.setState({ items: e, filteredItems: e, type: AppState.APP });
    this.filter();
  }

  private displayMaps = (e: any) => {
    this.setState({ items: e, filteredItems: e, type: AppState.MAP });
    this.filter();
  }

  private displayUsers = (e: any) => {
    this.setState({ items: e, filteredItems: e, type: AppState.USER });
    this.filter();
  }

  private displayMapImageLayers = (e: any) => {
    this.setState({ items: e, filteredItems: e, type: AppState.MAPIMAGELAYER });
    this.filter();
  }

  private displayFeatureLayers = (e: any) => {
    this.setState({ items: e, filteredItems: e, type: AppState.FEATAURELAYER });
    this.filter();
  }

  private filter = () => {

    if (this.filterTerm.length === 0) this.setState({ filteredItems: this.state.items });

    let f = this.state.items.filter(item => {

      if (this.state.type === AppState.USER) {
        item = item as IUser;
        return (
          item.fullName.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.userName.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1 ||
          item.email.toLowerCase().indexOf(this.filterTerm.toLocaleLowerCase()) !== -1
        )
      }

      if (this.state.type === AppState.APP || this.state.type === AppState.MAP || this.state.type === AppState.MAPIMAGELAYER || this.state.type === AppState.FEATAURELAYER) {
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
    if (this.state.type === AppState.SERVER) return "server"
    if (this.state.type === AppState.APP) return "app"
    if (this.state.type === AppState.MAP) return "map"
    if (this.state.type === AppState.MAPIMAGELAYER) return "mapLayer"
    if (this.state.type === AppState.FEATAURELAYER) return "featureLayer"
    if (this.state.type === AppState.USER) return "user"
    if (this.state.type === AppState.UNKNOWN) return "transparent"
  }

  public render() {
    return (
      <>
        <NavBar setFilter={this.setFilter} />
        <Container fluid={true} >
          <Row>

            <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
              <div className="sidebar-sticky">

                <SearchLink icon={faTabletAlt} css="app" caption="Web Apps" action={() => this.app.searchApps(this.displayApps)} />
                <SearchLink icon={faMap} css="map" caption="Web Maps" action={() => this.app.searchMaps(this.displayMaps)} />
                <SearchLink icon={faLayerGroup} css="mapLayer" caption="Map Image Layer" action={() => this.app.searchMapLayers(this.displayMapImageLayers)} />
                <SearchLink icon={faDrawPolygon} css="featureLayer" caption="Feature Layers" action={() => this.app.searchFeatureLayers(this.displayFeatureLayers)} />
                <SearchLink icon={faUser} css="user" caption="Users" action={() => this.app.searchUsers(this.displayUsers)} />
                <SearchLink icon={faServer} css="server" caption="Server" action={() => this.app.servers(this.displayServer)} />

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
              <Items items={this.state.filteredItems} type={this.state.type} />
            </main>

          </Row>
        </ Container>


      </>);
  }
}
