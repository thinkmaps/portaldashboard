import axios from "axios";
import { ArcGis } from "./ArcGis";
import * as  searchTerms from "./searchTerms.json";
import DependencyManager from "./DependencyManager";
import { IUser } from "./RestInterfaces";

export enum DashboardState {
  UNKNOWN,
  APP,
  MAP,
  MAPIMAGELAYER,
  FEATAURELAYER,
  TOOL,
  USER,
  SERVER,
  NOTLOGGEDIN
}

export class AppManager {

  private orgId: string = "0123456789ABCDEF";
  private arcgis: ArcGis;
  private dependencyManager: DependencyManager;
  //public config: IDashboardConfig | undefined;
  public state: DashboardState = DashboardState.UNKNOWN;


  constructor(arcgis: ArcGis) {
    this.arcgis = arcgis;
    this.dependencyManager = new DependencyManager(this.arcgis);
  }

  public getConfig = (callback: any) => {
    axios.get("./config.json").then(configResponse => {
      if (configResponse && configResponse.data) {
        //this.config = configResponse.data;
        callback(configResponse.data)
      }
    });
  }

  public servers = (callback: any): void => {
    this.arcgis.servers(this.orgId).then(serversResponse =>
      this.handleResponse(callback, serversResponse, "servers")
    );
  }

  public getItemDataUrl = (itemId: string) => this.arcgis.getItemDataUrl(itemId);
  public getItemPortalUrl = (itemId: string) => this.arcgis.getItemPortalUrl(itemId);
  public getUserContentUrl = (user: string) => this.arcgis.getUserContentUrl(user);
  public getWebmapViewerUrl = (itemId: string) => this.arcgis.getWebmapViewerUrl(itemId);
  public getServerManagerUrl = (serverUrl: string) => this.arcgis.getServerManagerUrl(serverUrl);
  public getServerAdminUrl = (serverUrl: string) => this.arcgis.getServerAdminUrl(serverUrl);
  public getServerRestUrl = (serverUrl: string) => this.arcgis.getServerRestUrl(serverUrl);

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

  public searchTools = (callback: any): void => {
    this.searchItems(callback, searchTerms.tool);
  }

  public searchUsers = (callback: any): void => {
    this.searchAll(this.orgId, this.arcgis.users, 100).then((searchResults: any) => {
      let results = searchResults
        .map((searchResult: any) => searchResult.users)
        .flat()
        .filter((u: IUser) => u.email !== "support@esri.com" && u.email !== "system_publisher@change.me")
        .sort((u1: IUser, u2: IUser) => (u1.lastLogin > u2.lastLogin) ? -1 : (u1.lastLogin < u2.lastLogin) ? 1 : 0)
      callback(results);
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
}