import { ArcGis, IDependencyResponse } from "./ArcGis";
import { Item } from "./ItemTypes";

import { Dependency } from "./Dependencies";



export default class DependencyManager {

  private arcgis: ArcGis;
  private dependencyIds: Set<string> = new Set();
  private num = 50;

  constructor(arcgis: ArcGis) {
    this.arcgis = arcgis;
  }

  // TODO: Remove static num and start
  public getItemDependencies = (callback: any, itemId: string) => {
    this.searchAllItems(itemId, this.arcgis.itemDependencies).then(all => callback(all));
  }

  public getItemDependenciesTo = (callback: any, itemId: string) => {
    this.searchAllItems(itemId, this.arcgis.itemDependenciesTo).then(all => callback(all));
  }

  private searchAllItems = async (itemId: string, functionToCall: any) => {

    let allResults: Array<IDependencyResponse> = []

    let first = await functionToCall(itemId, 1, this.num);
    allResults.push(first);
    if (first.nextStart < 0) return allResults;

    do {
      first = await functionToCall(itemId, first.nextStart, this.num);
      allResults.push(first);
    }
    while (first.nextStart > 0)
    return allResults
  }

  private getDependencies = async (itemId: string) => {

    let d: Dependency;

    let item = await this.arcgis.getItem(itemId);

    if (item.error) {
      d = new Dependency(itemId, undefined);
    } else {
      d = new Dependency(itemId, new Item(item.id, item.type, item.title, item.owner, item.created));
    }


    let children = await this.searchAllItems(itemId, this.arcgis.itemDependencies);
    children.forEach(child => {
      if (child.error) {
        d.hasErrors = true;
        d.message = child.error.message;
        return d;
      } else {
        d.addChildren(child.list);
      }
    });

    let parents = await this.searchAllItems(itemId, this.arcgis.itemDependenciesTo);
    parents.forEach(parent => {
      if (parent.error) {
        d.hasErrors = true;
        d.message = parent.error.message;
        return d;
      } else {
        d.addParents(parent.list);
      }
    });
    return d;
  }

  public getAllDependencies = async (callback: any, itemId: string, init: boolean, searchForChildren: boolean, searchForParents: boolean) => {

    if (init) this.dependencyIds = new Set();

    if (!this.dependencyIds.has(itemId)) {


      this.dependencyIds.add(itemId);

      let d = await this.getDependencies(itemId);
      // if (d.item) {
      //   console.table(d.item.title, d.parents.size, d.children.size);
      // }
      // console.log(d);

      if (searchForChildren) {
        d.children.forEach(async (childId: string) => {
          return await this.getAllDependencies(callback, childId, false, true, false);
        });
      }
      if (searchForParents) {
        d.parents.forEach(async (parentId: string) => {
          return await this.getAllDependencies(callback, parentId, false, false, true);
        });
      }
      callback(d);
      return
    }
    return
  }


}