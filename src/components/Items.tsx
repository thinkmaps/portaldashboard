import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns'
import ItemCard from "./ItemCard";
import UserCard from "./UserCard";
import { ServerCard } from "./ServerCard";
import { IItem, IUser, IServer } from "../bo/RestInterfaces";
import { AppState, AppManager } from "../bo/AppManager";

export interface IItemsProps {
  items: Array<IItem | IUser | IServer>;
  type: AppState;
  app: AppManager;
}

export default class Items extends React.Component<IItemsProps> {


  private getCards = () => {
    return this.props.items.map((item: IItem | IUser | IServer, index) => {

      // AppState is unknown: return empty div
      if (this.props.type === AppState.UNKNOWN) {
        return <div></div>;
      }
      // AppState is USER: return a UserCard
      if (this.props.type === AppState.USER) {
        return <UserCard item={item as IUser} key={index.toString()} />;
      }
      // AppState is SERVER: return a ServerCard
      if (this.props.type === AppState.SERVER) {
        return <ServerCard item={item as IServer} key={index.toString()} />;
      }
      // // AppState is anything else: must be a ItemCard
      return <ItemCard item={item as IItem} key={index.toString()} type={this.props.type} app={this.props.app} />;
    });
  }

  public render() {
    return (
      <CardColumns> {this.getCards()}</CardColumns >
    );
  }

}
