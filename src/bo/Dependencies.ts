import { Item } from "./ItemTypes";

enum ArcGisDependencyTypes {
  "id" = "id",
  "url" = "url",
  "serverId" = "serverId"
}

interface ArcGisDependency {
  dependencyType: string;
  id?: string;
  url?: string;
}

export class Dependency {
  public id: string;
  public item: Item | undefined;
  public parents: Set<string>;
  public children: Set<string>;
  public urls: Set<string>;
  public hasErrors: boolean;
  public message: string;


  constructor(id: string, item: Item | undefined) {
    this.id = id;
    this.item = item;
    this.parents = new Set();
    this.children = new Set();
    this.urls = new Set();
    this.hasErrors = false;
    this.message = "";
  }

  public addParents = (dep: Array<ArcGisDependency>) => {
    dep.forEach(d => {
      if (d.dependencyType === ArcGisDependencyTypes.id) this.parents.add(d.id!);
      if (d.dependencyType === ArcGisDependencyTypes.url) this.urls.add(d.url!);
    });
  }

  public addChildren = (dep: Array<ArcGisDependency>) => {
    dep.forEach(d => {
      if (d.dependencyType === ArcGisDependencyTypes.id) this.children.add(d.id!);
      if (d.dependencyType === ArcGisDependencyTypes.url) this.urls.add(d.url!);
    });
  }


}