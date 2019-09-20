import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns'
import ItemCard from "./ItemCard";
import UserCard from "./UserCard";
import ToolCard from "./ToolCard";

import ServerCard from "./ServerCard";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { DashboardState, AppManager } from "../bo/AppManager";

export interface IItemsProps {
  items: Array<IItem | IUser | IServer>;
  dashboardState: DashboardState;
  app: AppManager;
}

export default class Items extends React.Component<IItemsProps> {



  private getCards = () => {
    return this.props.items.map((item: IItem | IUser | IServer, index) => {

      // AppState is unknown: return empty div
      if (this.props.dashboardState === DashboardState.UNKNOWN) {
        return <div></div>;
      }
      // AppState is USER: return a UserCard
      if (this.props.dashboardState === DashboardState.USER) {
        return <UserCard item={item as IUser} key={index.toString()} app={this.props.app} />;
      }
      // AppState is SERVER: return a ServerCard
      if (this.props.dashboardState === DashboardState.SERVER) {
        return <ServerCard item={item as IServer} key={index.toString()} app={this.props.app} />;
      }
      // AppState is TOOL: return a ToolCard
      if (this.props.dashboardState === DashboardState.TOOL) {
        return <ToolCard item={item as IItem} key={index.toString()} app={this.props.app} />;
      }
      // // AppState is anything else: must be a ItemCard
      return <ItemCard item={item as IItem} key={index.toString()} type={this.props.dashboardState} app={this.props.app} />;
    });
  }

  public render() {
    return (
      <CardColumns> {this.getCards()}</CardColumns >
    );
  }

}
