import * as React from 'react';
import ItemCard from "./cards/ItemCard";
import { AppManager } from "../bo/AppManager";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug } from '@fortawesome/free-solid-svg-icons'

import { Dependency } from '../bo/Dependencies';
import { DashboardState } from "../bo/AppManager";

export interface IDependenciesProps {
  itemId: string;
  dependencies: Array<Dependency>;
  app: AppManager;
}

interface ITable {
  title: string;
  table: any;
}

export default class Dependencies extends React.Component<IDependenciesProps> {

  private counter = 0;

  private getAppState = (key: string) => {
    if (key === "Web Map") return DashboardState.MAP;
    if (key === "Web Mapping Application") return DashboardState.APP;
    if (key === "Map Service") return DashboardState.MAPIMAGELAYER;
    if (key === "Feature Service") return DashboardState.FEATURELAYER;
    return DashboardState.UNKNOWN;
  }

  private getKey = () => {
    // https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private getDependencyFromDependencies = (itemId: string) => {
    return this.props.dependencies.filter(d => d.id === itemId)[0];
  }

  private renderDependendElements = (ids: Set<string>, renderFunction: any) => {
    return Array.from(ids)
      // map id to dependency
      .map(id => this.getDependencyFromDependencies(id))
      // filter all valid in the moment availabe dependecies
      .filter(d => d !== undefined)
      // map to tables with title in order to sort them 
      .map(d => renderFunction(d))
      // sort dependencies by item title
      .sort((t1, t2) => (t1.title > t2.title) ? 1 : ((t2.title > t1.title) ? -1 : 0))
      // return only the HTML part
      .map(t => t ? t.table : undefined);
  }

  private getParents = (dependency: Dependency): ITable => {
    let table = (<table key={this.getKey()}>
      <tbody>
        <tr>
          <td align="right">{this.renderDependendElements(dependency.parents, this.getParents)}</td>
          <td>{this.getDepCard(dependency)}</td>
        </tr>
      </tbody>
    </table>);
    let title = dependency.item ? dependency.item.title : "";
    return { title: title, table: table };
  }

  private getChildren = (dependency: Dependency): ITable => {
    let table = (<table key={this.getKey()}>
      <tbody>
        <tr>
          <td>{this.getDepCard(dependency)}</td>
          <td>{this.renderDependendElements(dependency.children, this.getChildren)}</td>
        </tr>
      </tbody>
    </table>);
    let title = dependency.item ? dependency.item.title : "";
    return { title: title, table: table };
  }

  private getDepCard = (dependency: Dependency) => {
    if (dependency.item) {
      return (
        <ItemCard item={dependency.item} parents={dependency.parents.size} children={dependency.children.size} key={dependency.id} type={this.getAppState(dependency.item.type)} app={this.props.app} mode="badge" />
      )
    }
    return <div className="border-danger"><FontAwesomeIcon icon={faBug} className="text-danger" />Error: missing item!</div>
  }


  private getRootTable = () => {

    let root = this.getDependencyFromDependencies(this.props.itemId);
    if (!root) return;

    return (<table>
      <tbody>
        <tr>
          <td className="sub" align="right">{this.renderDependendElements(root.parents, this.getParents)}</td>
          <td className="main"><ItemCard item={root.item!} parents={0} children={0} key={"dependencies" + this.counter} type={this.getAppState(root.item!.type)} app={this.props.app} mode="card" /></td>
          <td className="sub">{this.renderDependendElements(root.children, this.getChildren)}</td>
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
