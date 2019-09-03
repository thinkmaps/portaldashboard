import * as React from 'react';
import ItemCard from "./ItemCard";
import DepCard from "./DepCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'

import { Dependency } from '../bo/Dependencies';
import { AppState } from "../bo/AppManager";

export interface IDependenciesProps {
  itemId: string;
  dependencies: Array<Dependency>;
}

export default class Dependencies extends React.Component<IDependenciesProps> {

  private getAppState = (key: string) => {
    console.log(key);
    if (key === "Web Map") return AppState.MAP;
    if (key === "Web Mapping Application") return AppState.APP;
    if (key === "Map Service") return AppState.MAPIMAGELAYER;
    if (key === "Feature Service") return AppState.FEATAURELAYER;

    return AppState.USER
  }

  private getItemFromDependencies = (itemId: string) => {
    return this.props.dependencies.filter(d => d.id === itemId)[0];
  }

  private renderParents = (ids: Set<string>) => {

    let ts: Array<React.ReactNode> = [];

    ids.forEach(id => {
      ts.push(this.getParents(id));
    });
    return ts;
  }

  private getParents = (id: string) => {
    let c = this.getItemFromDependencies(id);

    if (c && c.item) {
      return (<table>
        <tr>
          <td align="right">{this.renderParents(c.parents)}</td>
          <td><DepCard item={c.item} key={Date.now().toString()} type={this.getAppState(c.item!.type)} /></td>
        </tr>
      </table>);
    }
    if (c && !c.item) {
      return (<table>
        <tr>
          <td align="right">{this.renderParents(c.parents)}</td>
          <td ><div className="border-danger"><FontAwesomeIcon icon={faSkullCrossbones} className="text-danger" />Error: missing item!</div></td>
        </tr>
      </table>);
    }

    return null;
  }

  private renderChildren = (ids: Set<string>) => {

    let ts: Array<React.ReactNode> = [];

    ids.forEach(id => {
      ts.push(this.getChildren(id));
    });
    return ts;
  }

  private getChildren = (id: string) => {
    let c = this.getItemFromDependencies(id);

    if (c && c.item) {
      return (<table>
        <tr>
          <td><DepCard item={c.item!} key={Date.now().toString()} type={this.getAppState(c.item!.type)} /></td>
          <td>{this.renderParents(c.children)}</td>
        </tr>
      </table>);
    }
    if (c && !c.item) {
      return (<table>
        <tr>
          <td align="right">{this.renderParents(c.parents)}</td>
          <td ><div className="border-danger"><FontAwesomeIcon icon={faSkullCrossbones} className="text-danger" />Error: missing item!</div></td>
        </tr>
      </table>);
    }
    return null;
  }

  private get = () => {

    let root = this.getItemFromDependencies(this.props.itemId);
    if (root) {
      return (<table className="dialogTable">
        <tr>
          <td className="sub" align="right">{this.renderParents(root.parents)}</td>
          <td className="main"><ItemCard item={root.item!} key={Date.now().toString()} type={this.getAppState(root.item!.type)} /></td>
          <td className="sub">{this.renderChildren(root.children)}</td>
        </tr>
      </table>);
    }
    return;

  }


  public render() {
    return (
      <div>
        {this.get()}
      </div>
    );
  }
}
