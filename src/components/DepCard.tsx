import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Dependencies from "./Dependencies";

// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faCodeBranch } from '@fortawesome/free-solid-svg-icons'

import { Dependency } from '../bo/Dependencies';
import { AppManager, AppState } from "../bo/AppManager";

export interface IDepCardProps {
  key: string;
  depenedency: Dependency;
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
    this.app.getAllDependencies(this.updateDependencies, this.props.depenedency.id);
    this.setState({ show: true })
  };

  private getIcon = () => {
    if (this.props.type === AppState.APP) return <FontAwesomeIcon icon={faTabletAlt} className="app" />
    if (this.props.type === AppState.MAP) return <FontAwesomeIcon icon={faMap} className="map" />
    if (this.props.type === AppState.MAPIMAGELAYER) return <FontAwesomeIcon icon={faLayerGroup} className="mapLayer" />
    if (this.props.type === AppState.FEATAURELAYER) return <FontAwesomeIcon icon={faDrawPolygon} className="featureLayer" />
  }

  private getBorderColor = () => {
    if (this.props.type === AppState.APP) return "border-app";
    if (this.props.type === AppState.MAP) return "border-map";
    if (this.props.type === AppState.MAPIMAGELAYER) return "border-mapLayer";
    if (this.props.type === AppState.FEATAURELAYER) return "border-featureLayer";
  }

  public render() {
    return (
      <>
        <div className="badgeContainerC">
          <Badge variant="secondary" className="badgeContainer" title={this.props.depenedency.parents.size + " parents / " + this.props.depenedency.children.size + " children"}>{this.props.depenedency.parents.size + "/" + this.props.depenedency.children.size}</Badge>
          <div className={"bg-light hundred " + this.getBorderColor()}>
            <div className="h6 nw" title={this.props.depenedency.item!.title}>
              {this.getIcon()}
              <Button onClick={this.handleShow} className="linkButton"><FontAwesomeIcon icon={faCodeBranch} className=" codeBranch" /></Button>
              {this.props.depenedency.item!.title}
            </div>
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="dialog">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>Dependencies:</Modal.Title>
          </Modal.Header>
          <Modal.Body className="ccenter">
            <Dependencies dependencies={this.state.dependencies} itemId={this.props.depenedency.id} />
          </Modal.Body>

        </Modal>

      </>);
  }
}
