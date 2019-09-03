import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Dependencies from "./Dependencies";

// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faCodeBranch } from '@fortawesome/free-solid-svg-icons'

import { Item } from "../bo/ItemTypes";
import { Dependency } from '../bo/Dependencies';
import { AppManager, AppState } from "../bo/AppManager";

export interface IDepCardProps {
  key: string;
  item: Item;
  type: AppState;
}

export interface IDepCardState {
  show: boolean;
  dependencies: Array<Dependency>;
}

export default class DepCard extends React.Component<IDepCardProps, IDepCardState> {

  private app: AppManager;

  constructor(props: IDepCardProps) {
    super(props);
    this.app = new AppManager();
    this.state = { show: false, dependencies: [] }
  }

  // const [show:boolean, setShow:any] = useState(false);
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
    this.app.getAllDependencies(this.updateDependencies, this.props.item.id, true, true, true);
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

  public render() {
    return (
      <>
        <div className={"bg-light hundred " + this.getBorderColor()}>
          <div className="h6 nw" title={this.props.item.title}>
            {this.getIcon()}
            <a onClick={this.handleShow}><FontAwesomeIcon icon={faCodeBranch} className="codeBranch" /></a>
            {this.props.item.title}
          </div>
        </div>


        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="dialog">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Dependencies:</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ccenter">
            <Dependencies dependencies={this.state.dependencies} itemId={this.props.item.id} />
          </Modal.Body>

        </Modal>

      </>);
  }
}
