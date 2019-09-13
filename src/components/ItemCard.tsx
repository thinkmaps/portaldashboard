import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dependencies from "./Dependencies";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faCodeBranch, faCode, faEye } from '@fortawesome/free-solid-svg-icons'
import { IItem } from "../bo/RestInterfaces";
import { Dependency } from '../bo/Dependencies';
import { AppManager, AppState } from "../bo/AppManager";

export interface ItemCardProps {
  key: string;
  item: IItem;
  app: AppManager;
  type: AppState;
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

  private openJsonUrl = () => {
    this.props.app.getItemDataUrl(this.props.item.id).then(url =>
      window.open(url, "_blank")
    )
  }

  private openPortalUrl = () => {
    window.open(this.props.app.getItemPortalUrl(this.props.item.id), "_blank")
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
              Created: {new Date(parseInt(this.props.item.created)).toLocaleDateString()}<br />
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button onClick={this.handleShow} className="linkButton"><FontAwesomeIcon icon={faCodeBranch} className="codeBranch" title="Show dependencies." /></Button>
            <Button onClick={this.openJsonUrl} className="linkButton"><FontAwesomeIcon icon={faCode} className="codeBranch" title="Show JSON." /></Button>
            <Button onClick={this.openPortalUrl} className="linkButton"><FontAwesomeIcon icon={faEye} className="codeBranch" title="Show Portal Item Details." /></Button>
          </Card.Footer>
        </ Card >


        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="dialog">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Dependencies:</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ccenter">
            <Dependencies dependencies={this.state.dependencies} itemId={this.props.item.id} app={this.props.app} />
          </Modal.Body>
        </Modal>

      </>);
  }
}
