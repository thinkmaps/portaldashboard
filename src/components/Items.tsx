import * as React from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Button from "react-bootstrap/Button";
import ItemCard from "./cards/ItemCard";
import UserCard from "./cards/UserCard";
import ToolCard from "./cards/ToolCard";

import ServerCard from "./cards/ServerCard";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { DashboardState, AppManager } from "../bo/AppManager";

interface ICheckItem {
  item: IItem;
  check: number;
}

export interface IItemsProps {
  items: Array<IItem | IUser | IServer>;
  dashboardState: DashboardState;
  app: AppManager;
}

interface IItemsState {
  cs: Array<ICheckItem>;
}

export default class Items extends React.Component<IItemsProps, IItemsState> {

  private checkStates: Array<ICheckItem>;

  constructor(props: IItemsProps) {
    super(props);
    this.checkStates = [];
    this.state = { cs: [] }
  }

  private getCards = () => {

    this.checkStates = [];

    let result = this.props.items.map((item: IItem | IUser | IServer, index) => {

      // AppState is unknown: return empty div
      if (this.props.dashboardState === DashboardState.UNKNOWN) {
        return <div></div>;
      }
      // AppState is USER: return a UserCard
      else if (this.props.dashboardState === DashboardState.USER) {
        return <UserCard item={item as IUser} key={index.toString()} app={this.props.app} />;
      }
      // AppState is SERVER: return a ServerCard
      else if (this.props.dashboardState === DashboardState.SERVER) {
        return <ServerCard item={item as IServer} key={index.toString()} app={this.props.app} />;
      }
      // AppState is TOOL: return a ToolCard
      else if (this.props.dashboardState === DashboardState.TOOL) {
        return <ToolCard item={item as IItem} key={index.toString()} app={this.props.app} />;
      }
      // // AppState is anything else: must be a ItemCard
      else {

        this.checkStates.push({ item: item as IItem, check: 0 });
        return <ItemCard item={item as IItem} parents={0} children={0} key={index.toString()} type={this.props.dashboardState} app={this.props.app} mode="card" check={this.getCheckState(item as IItem)} reportState={this.reportState} />;
      }
    });
    return result;

  }

  private getCheckState = (item: IItem) => {
    let f = this.state.cs.filter(c => c.item.id === item.id);
    if (f && f.length === 1) {
      return f[0].check;
    } else {
      return 0;
    }
  }

  public reportState = (item: IItem, state: number) => {
    let cs = [...this.state.cs];
    cs.forEach(c => {
      if (c.item.id === item.id) {
        c.check = state;
      }
    })
    this.checkStates = [...cs];
    this.setState({ cs: this.checkStates });
  }

  private onCheckClick = () => {
    console.log(this.checkStates);
    let cs = [...this.checkStates];
    cs.forEach(c => c.check = 1);
    this.checkStates = [...cs];
    this.setState({ cs: cs });
  }

  public render() {
    return (
      <>
        <Button onClick={this.onCheckClick}>Hallo</Button>
        <CardColumns>{this.getCards()}</CardColumns >
      </>
    );
  }

}
