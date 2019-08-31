import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'

import { Item } from "../bo/ItemTypes";

export interface IItemsProps {
  items: Array<Item>;
}

export default class Items extends React.Component<IItemsProps> {


  private getCards = () => {
    return this.props.items.map((item, index) => (
      <Card key={index} className="bg-light">
        <Card.Body>
          <Card.Title><div className="h5 nw" title={item.title}>{item.title}</div> </Card.Title>
          <Card.Text>
            By: {item.owner}<br />
            Created: {item.created.toLocaleDateString()}
          </Card.Text>
        </Card.Body>
      </Card >))
  }

  public render() {

    return (
      <CardColumns column-count="5">{this.getCards()}</CardColumns>
    );
  }
}
