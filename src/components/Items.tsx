import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns'
import ItemCard from "./ItemCard";
import UserCard from "./UserCard";
import { Item, User } from "../bo/ItemTypes";
import { AppState } from "../bo/AppManager";

export interface IItemsProps {
  items: Array<Item | User>;
  type: AppState;
}

export default class Items extends React.Component<IItemsProps> {


  private getCards = () => {
    return this.props.items.map((item: Item | User, index) => {
      if (item instanceof Item) {
        return <ItemCard item={item} key={index.toString()} type={this.props.type} />;
      }
      if (item instanceof User) {
        return <UserCard item={item} key={index.toString()} />;
      }
      return <div></div>
    });
  }

  public render() {
    return (
      <CardColumns> {this.getCards()}</CardColumns >
    );
  }

}
