import * as React from 'react';
import Card from 'react-bootstrap/Card'

// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon } from '@fortawesome/free-solid-svg-icons'

import { Item } from "../bo/ItemTypes";
import { AppState } from "../bo/AppManager";


export interface IItemCardProps {
  key: string;
  item: Item;
  type: AppState;
}

export default class ItemCard extends React.Component<IItemCardProps> {

  private getIcon = () => {
    if (this.props.type === AppState.APP) return <FontAwesomeIcon icon={faTabletAlt} className="app" />
    if (this.props.type === AppState.MAP) return <FontAwesomeIcon icon={faMap} className="map" />
    if (this.props.type === AppState.MAPIMAGELAYER) return <FontAwesomeIcon icon={faLayerGroup} className="mapLayer" />
    if (this.props.type === AppState.FEATAURELAYER) return <FontAwesomeIcon icon={faDrawPolygon} className="featureLayer" />
  }

  private getBorderColor = () => {
    if (this.props.type === AppState.APP) return "border-app"
    if (this.props.type === AppState.MAP) return "border-map"
    if (this.props.type === AppState.MAPIMAGELAYER) return "border-mapLayer"
    if (this.props.type === AppState.FEATAURELAYER) return "border-featureLayer"
  }

  public render() {
    return (
      <Card className={"bg-light " + this.getBorderColor()}>
        <Card.Body>
          <Card.Title><div className="h5 nw" title={this.props.item.title}>
            {this.getIcon()}{this.props.item.title}
          </div>
          </Card.Title>
          <Card.Text>
            By: {this.props.item.owner}<br />
            Created: {this.props.item.created.toLocaleDateString()}<br />
          </Card.Text>
        </Card.Body>
      </ Card >);
  }
}
