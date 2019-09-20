import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Dependencies from "./Dependencies";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faTools } from '@fortawesome/free-solid-svg-icons'
import { IItem } from "../bo/RestInterfaces";
import { Dependency } from '../bo/Dependencies';
import { AppManager, DashboardState } from "../bo/AppManager";
import { DependencyButton } from "./buttons/DependencyButton";
import { ItemDataButton, ItemDetailsButton, RestLinkButton, ViewAppButton, ViewMapButton } from "./buttons/LinkButtons";

export interface ItemCardProps {
  key: string;
  item: IItem;
  app: AppManager;
  type: DashboardState;
}

interface IItemCardState {
  show: boolean;
  dependencies: Array<Dependency>;
}

export default class ItemCard extends React.Component<ItemCardProps, IItemCardState> {

  constructor(props: ItemCardProps) {
    super(props);
    this.state = { show: false, dependencies: [] }
  }

  private updateDependencies = (e: Dependency) => {
    // // 1. copy the current state
    const dependencies = [...this.state.dependencies];
    // // 2. add value
    dependencies.push(e);
    // // 3. Update state
    this.setState({ dependencies: dependencies });
  }

  private handleClose = () => this.setState({ show: false });

  private handleShow = () => {
    this.setState({ dependencies: [] });

    this.props.app.getAllDependencies(this.updateDependencies, this.props.item.id);


    this.setState({ show: true })
  };

  private getIcon = () => {
    if (this.props.type === DashboardState.APP) return <FontAwesomeIcon icon={faTabletAlt} className="app" />
    if (this.props.type === DashboardState.MAP) return <FontAwesomeIcon icon={faMap} className="map" />
    if (this.props.type === DashboardState.MAPIMAGELAYER) return <FontAwesomeIcon icon={faLayerGroup} className="mapLayer" />
    if (this.props.type === DashboardState.FEATAURELAYER) return <FontAwesomeIcon icon={faDrawPolygon} className="featureLayer" />
    if (this.props.type === DashboardState.TOOL) return <FontAwesomeIcon icon={faTools} className="tool" />
  }

  private getBorderColor = () => {
    if (this.props.type === DashboardState.APP) return "border-app"
    if (this.props.type === DashboardState.MAP) return "border-map"
    if (this.props.type === DashboardState.MAPIMAGELAYER) return "border-mapLayer"
    if (this.props.type === DashboardState.FEATAURELAYER) return "border-featureLayer"
    if (this.props.type === DashboardState.TOOL) return "border-tool"
  }

  private getButtons = () => {

    let buttons = [];
    buttons.push(<DependencyButton key={buttons.length} onClick={this.handleShow} />);
    buttons.push(<ItemDataButton key={buttons.length} app={this.props.app} item={this.props.item} />);
    buttons.push(<ItemDetailsButton key={buttons.length} app={this.props.app} item={this.props.item} />)
    if (this.props.type === DashboardState.APP) {
      buttons.push(<ViewAppButton key={buttons.length} app={this.props.app} item={this.props.item} />);
    }
    if (this.props.type === DashboardState.MAP) {
      buttons.push(<ViewMapButton key={buttons.length} app={this.props.app} item={this.props.item} />);
    }
    if (this.props.type === DashboardState.MAPIMAGELAYER || this.props.type === DashboardState.FEATAURELAYER) {
      buttons.push(<RestLinkButton key={buttons.length} app={this.props.app} item={this.props.item} />);
    }
    return buttons;
  }

  public render() {
    return (
      <>
        <Card className={"bg-light " + this.getBorderColor()}>
          <Card.Body>
            <Card.Title>
              <div className="h5 nw" title={this.props.item.title}>
                {this.getIcon()}
                {this.props.item.title}
              </div>
            </Card.Title>
            <Card.Text>
              By: {this.props.item.owner}<br />
              Created: {new Date(this.props.item.created).toLocaleDateString()}<br />
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            {this.getButtons()}
          </Card.Footer>
        </ Card >


        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="dialog">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Relations between portal items:</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ccenter">
            <Dependencies dependencies={this.state.dependencies} itemId={this.props.item.id} app={this.props.app} />
          </Modal.Body>
        </Modal>

      </>);
  }
}
