import * as React from "react";
import Card from "react-bootstrap/Card";
import Badge from 'react-bootstrap/Badge';
import Spinner from "react-bootstrap/Spinner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTabletAlt, faMap, faLayerGroup, faDrawPolygon, faTools, faCheckCircle, faBug } from '@fortawesome/free-solid-svg-icons'
import { IItem } from "../../bo/RestInterfaces";
import { Dependency } from '../../bo/Dependencies';
import { AppManager, DashboardState } from "../../bo/AppManager";
import { DependencyButton } from "../buttons/DependencyButton";
import { ItemDataButton, ItemDetailsButton, RestLinkButton, ViewAppButton, ViewMapButton } from "../buttons/LinkButtons";
import DependencyDialog from "../DependencyDialog";

export interface ItemCardProps {
  key: string;
  item: IItem;
  parents: number;
  children: number;
  app: AppManager;
  type: DashboardState;
  mode: string; // "card" or "badge"
  check: number;
  reportState: any;
}

interface IItemCardState {
  show: boolean;
  dependencies: Array<Dependency>;
}

export default class ItemCard extends React.Component<ItemCardProps, IItemCardState> {

  private check: number = 0;
  private hasDependencyErrors = false;

  constructor(props: ItemCardProps) {
    super(props);
    this.state = { show: false, dependencies: [] }
  }


  private updateDependencies = (e: Dependency) => {

    if (e.hasErrors) { this.hasDependencyErrors = true };
    this.hasDependencyErrors ? this.props.reportState(this.props.item, 3) : this.props.reportState(this.props.item, 2);
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
    if (this.props.type === DashboardState.FEATURELAYER) return <FontAwesomeIcon icon={faDrawPolygon} className="featureLayer" />
    if (this.props.type === DashboardState.TOOL) return <FontAwesomeIcon icon={faTools} className="tool" />
  }

  private getBorderColor = () => {
    if (this.props.type === DashboardState.APP) return "border-app"
    if (this.props.type === DashboardState.MAP) return "border-map"
    if (this.props.type === DashboardState.MAPIMAGELAYER) return "border-mapLayer"
    if (this.props.type === DashboardState.FEATURELAYER) return "border-featureLayer"
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
    if (this.props.type === DashboardState.MAPIMAGELAYER || this.props.type === DashboardState.FEATURELAYER) {
      buttons.push(<RestLinkButton key={buttons.length} app={this.props.app} item={this.props.item} />);
    }
    return buttons;
  }

  public componentDidUpdate = () => {
    // console.log("componentDidUpdate", this.props.check, this.check);
    if (this.check !== 1 && this.props.check === 1) {
      this.check = this.props.check;
      console.log("Must do something", this.props.check);
      this.props.app.getAllDependencies(this.updateDependencies, this.props.item.id);
    }
  }

  private getCheckUI = () => {

    if (this.props.check === 0) return <div></div>;
    if (this.props.check === 1) return <Spinner animation="border" role="status" variant="secondary" />
    if (this.props.check === 2) return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
    if (this.props.check === 3) return <FontAwesomeIcon icon={faBug} className="text-danger" />
    return <div></div>


  }

  private getCard = () => {

    // extended card
    if (this.props.mode === "card") {
      return (<Card className={"bg-light " + this.getBorderColor()}>
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
          <div className="itemstatus">
            {this.getCheckUI()}
          </div>
        </Card.Footer>
      </ Card >)
    }

    // compressed card for dependencies
    if (this.props.mode === "badge") {
      if (this.props.item) {
        return (<div className="badgeContainerC">
          <Badge variant="secondary" className="badgeContainer" title={this.props.parents + " parents / " + this.props.children + " children"}>{this.props.parents + "/" + this.props.children}</Badge>
          <div className={"bg-light hundred " + this.getBorderColor()}>
            <div className="h6 nw" title={this.props.item.title}>
              {this.getIcon()}
              <DependencyButton onClick={this.handleShow} />
              {this.props.item!.title}
            </div>
          </div>
        </div>)
      }

    }

  }

  public render() {
    return (
      <>
        {this.getCard()}

        <DependencyDialog show={this.state.show}
          close={this.handleClose}
          dependencies={this.state.dependencies}
          itemId={this.props.item.id}
          app={this.props.app}
        />


      </>);
  }
}