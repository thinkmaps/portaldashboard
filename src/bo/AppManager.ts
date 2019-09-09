import { ArcGis } from "./ArcGis";
import * as  searchTerms from "./searchTerms.json";
import DependencyManager from "./DependencyManager";

export enum AppState {
  APP,
  MAP,
  MAPIMAGELAYER,
  FEATAURELAYER,
  USER,
  SERVER,
  UNKNOWN
}
export class AppManager {

  // TODO: Remove hard coded orgId.
  private orgId: string = "0123456789ABCDEF";
  private arcgis: ArcGis;
  private dependencyManager: DependencyManager;


  constructor() {
    // TODO: Remove hard coded credentials.

    // this.arcgis = new ArcGis("https://maps-q.kaufland.com/portal", "python_scriptuser", "X0MAhTHkzIC9BjMhJXPL");
    this.arcgis = new ArcGis("https://vsdev1720.esri-de.com/portal", "portaladmin", "portaladmin1234");
    // this.arcgis = new ArcGis("https://vsdev2426.esri-de.com/portal", "s.mendler", "Sonne1234");
    this.dependencyManager = new DependencyManager(this.arcgis);
  }

  public servers = (callback: any): void => {
    this.arcgis.servers(this.orgId).then(serversResponse =>
      this.handleResponse(callback, serversResponse, "servers")
    );
  }

  private handleResponse = (callback: any, response: any, key: string) => {
    if (response.error) {
      console.error(response.error);
      callback(response.error);
    } else {
      if (response[key]) {
        callback(response[key])
      }
    }
  }



  public getItemDataUrl = (itemId: string) => this.arcgis.getItemDataUrl(itemId);
  public getItemPortalUrl = (itemId: string) => this.arcgis.getItemPortalUrl(itemId);

  public getItem = (callback: any, itemId: string) => {
    this.arcgis.getItem(itemId).then(item => callback(item))
  }

  public getItemDependencies = (callback: any, itemId: string) => {
    this.dependencyManager.getItemDependencies(callback, itemId);
  }

  public getItemDependenciesTo = (callback: any, itemId: string) => {
    this.dependencyManager.getItemDependenciesTo(callback, itemId);
  }

  public getAllDependencies = async (callback: any, itemId: string) => {
    return this.dependencyManager.getAllDependencies(callback, itemId, true, true, true);
  }


  public searchApps = (callback: any): void => {
    this.searchItems(callback, searchTerms.app);
  }

  public searchMaps = (callback: any): void => {
    this.searchItems(callback, searchTerms.map);
  }

  public searchMapLayers = (callback: any): void => {
    this.searchItems(callback, searchTerms.mapImageLayer);
  }

  public searchFeatureLayers = (callback: any): void => {
    this.searchItems(callback, searchTerms.featureLayer);
  }

  public searchUsers = (callback: any): void => {
    this.searchAll(this.orgId, this.arcgis.users, 100).then((searchResults: any) => {
      let results = searchResults.map((searchResult: any) => searchResult.users).flat();
      callback(results);
      // let allUsers = users
      //   .map((item: any) => new User(item.username, item.fullName, item.email, item.level, item.lastLogin))
      //   .filter((user: User) => user.email !== "support@esri.com")
      //   .sort((u1: User, u2: User) => (u1.lastLogin > u2.lastLogin) ? -1 : ((u2.lastLogin > u1.lastLogin) ? 1 : 0));
      // callback(allUsers);
    });
  }

  private searchItems = (callback: any, term: string) => {
    this.searchAll(term, this.arcgis.search, 100).then((searchResults: any) => {
      let results = searchResults.map((searchResult: any) => searchResult.results).flat();
      callback(results);
    });
  }


  private searchAll = async (parameter: string, functionToCall: any, num: number) => {

    let allResults: Array<any> = []

    let first = await functionToCall(parameter, 1, num);
    allResults.push(first);
    if (first.nextStart < 0) return allResults;

    do {
      first = await functionToCall(parameter, first.nextStart, num);
      allResults.push(first);
    }
    while (first.nextStart > 0)
    return allResults
  }


  // private searchAllItems = async (term: string) => {

  //   let allResults: Array<any> = []

  //   let first = await this.arcgis.search(1, 1, term)

  //   if (first && first.total) {
  //     for (let i = 1; i < parseInt(first.total); i = i + 25) {
  //       let next = await this.arcgis.search(i, 25, term)
  //       if (next && next.results) {
  //         next.results.forEach((result: any) => {
  //           allResults.push(result)
  //         })
  //       }
  //     }
  //   }
  //   return allResults
  // }

  // private searchAllUsers = async () => {

  //   let all: Array<any> = []

  //   let first = await this.arcgis.users(this.orgId, 1, 1)

  //   if (first && first.total) {
  //     for (let i = 1; i < parseInt(first.total); i = i + 25) {
  //       let next = await this.arcgis.users(this.orgId, i, 25)
  //       if (next && next.users) {
  //         next.users.forEach((r: any) => {
  //           all.push(r)
  //         })
  //       }
  //     }
  //   }
  //   return all
  // }
}