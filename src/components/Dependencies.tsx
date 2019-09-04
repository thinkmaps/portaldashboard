import * as React from 'react';

import ItemCard from "./ItemCard";
import DepCard from "./DepCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'

import { Dependency } from '../bo/Dependencies';
import { AppState } from "../bo/AppManager";
import { Item } from "../bo/ItemTypes";

export interface IDependenciesProps {
  itemId: string;
  dependencies: Array<Dependency>;
}

export default class Dependencies extends React.Component<IDependenciesProps> {

  private counter = 0;

  private getAppState = (key: string) => {
    if (key === "Web Map") return AppState.MAP;
    if (key === "Web Mapping Application") return AppState.APP;
    if (key === "Map Service") return AppState.MAPIMAGELAYER;
    if (key === "Feature Service") return AppState.FEATAURELAYER;
    return AppState.UNKNOWN;
  }

  private getKey = () => {
    // https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private getDependencyFromDependencies = (itemId: string) => {
    return this.props.dependencies.filter(d => d.id === itemId)[0];
  }

  private renderParents = (ids: Set<string>) => {
    return Array.from(ids).map(id => this.getParents(id));
  }

  private renderChildren = (ids: Set<string>) => {
    return Array.from(ids).map(id => this.getChildren(id));
  }

  private getParents = (id: string) => {
    let dependency = this.getDependencyFromDependencies(id);
    if (!dependency) return
    return (<table key={this.getKey()}>
      <tbody>
        <tr>
          <td align="right">{this.renderParents(dependency.parents)}</td>
          <td>{this.getDepCard(dependency)}</td>
        </tr>
      </tbody>
    </table>);

  }

  private getChildren = (id: string) => {
    let dependency = this.getDependencyFromDependencies(id);
    if (!dependency) return
    return (<table key={this.getKey()}>
      <tbody>
        <tr>
          <td>{this.getDepCard(dependency)}</td>
          <td>{this.renderChildren(dependency.children)}</td>
        </tr>
      </tbody>
    </table>);
  }

  private getDepCard = (dependency: Dependency) => {
    if (dependency.item) {
      return (
        <>
          <DepCard depenedency={dependency} key={dependency.id} type={this.getAppState(dependency.item.type)}></DepCard>
        </>
      )
    }
    return <div className="border-danger"><FontAwesomeIcon icon={faSkullCrossbones} className="text-danger" />Error: missing item!</div>
  }


  private getRootTable = () => {

    let root = this.getDependencyFromDependencies(this.props.itemId);
    if (!root) return;

    return (<table className="dialogTable">
      <tbody>
        <tr>
          <td className="sub" align="right">{this.renderParents(root.parents)}</td>
          <td className="main"><ItemCard item={root.item!} key={"dependencies" + this.counter} type={this.getAppState(root.item!.type)} /></td>
          <td className="sub">{this.renderChildren(root.children)}</td>
        </tr>
      </tbody>
    </table>);
  }

  public render() {
    return (
      <div>
        {this.getRootTable()}
      </div>
    );
  }
}
