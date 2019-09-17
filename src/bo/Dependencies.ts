import { IItem, IDependency } from "./RestInterfaces";

enum ArcGisDependencyTypes {
  "id" = "id",
  "url" = "url",
  "serverId" = "serverId"
}

export class Dependency {
  public id: string;
  public item: IItem | undefined;
  public parents: Set<string>;
  public children: Set<string>;
  public servers: Set<string>;
  public urls: Set<string>;
  public hasErrors: boolean;
  public message: string;


  constructor(id: string, item: IItem | undefined) {
    this.id = id;
    this.item = item;
    this.parents = new Set();
    this.children = new Set();
    this.servers = new Set();
    this.urls = new Set();
    this.hasErrors = false;
    this.message = "";
  }

  public addParents = (dep: Array<IDependency>) => {
    dep.forEach(d => {
      if (d.dependencyType === ArcGisDependencyTypes.id) this.parents.add(d.id!);
      if (d.dependencyType === ArcGisDependencyTypes.url) this.urls.add(d.url!);
      if (d.dependencyType === ArcGisDependencyTypes.serverId) this.servers.add(d.id!);
      // if (d.dependencyType === ArcGisDependencyTypes.serverId) { if (this.item) console.log(this.item.title, d.id!) }
    });
  }

  public addChildren = (dep: Array<IDependency>) => {
    dep.forEach(d => {
      if (d.dependencyType === ArcGisDependencyTypes.id) this.children.add(d.id!);
      if (d.dependencyType === ArcGisDependencyTypes.url) this.urls.add(d.url!);
      if (d.dependencyType === ArcGisDependencyTypes.serverId) this.servers.add(d.id!);
      // if (d.dependencyType === ArcGisDependencyTypes.serverId) { if (this.item) console.log(this.item.title, d.id!) }
    });
  }


}