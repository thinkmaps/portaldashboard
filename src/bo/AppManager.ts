import axios from "axios";
import crypto from "crypto";
import { ArcGis } from "./ArcGis";
import * as  searchTerms from "./searchTerms.json";
import DependencyManager from "./DependencyManager";
import { IPortal } from "../bo/Portals";

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

  private orgId: string = "0123456789ABCDEF";
  private arcgis: ArcGis = new ArcGis("", "", "");
  private portals: Array<IPortal> = [];
  private dependencyManager: DependencyManager = new DependencyManager(this.arcgis);

  constructor() {
    const x = this.encrypt("Hello World");
    const y = this.decrypt(x);
    console.log(x, y);
  }

  public servers = (callback: any): void => {
    this.arcgis.servers(this.orgId).then(serversResponse =>
      this.handleResponse(callback, serversResponse, "servers")
    );
  }

  public getPortalsFromConfig = (callback: any) => {
    axios.get("/config.json").then(portals => {
      this.portals = portals.data.portals;
      window.localStorage.clear();
      // window.localStorage.setItem("PortalDashboard", JSON.stringify(this.portals));
      callback(portals.data.portals)
    });
  }

  public setPortal = (portal: IPortal) => {

    // Look p local storage for username and password
    let username = window.localStorage.getItem(`${this.encrypt(portal.url)}a1`);
    let password = window.localStorage.getItem(`${this.encrypt(portal.url)}b2`);


    this.arcgis = new ArcGis(portal.url, portal.username!, portal.password!);
    this.dependencyManager = new DependencyManager(this.arcgis);
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

  // https://www.thepolyglotdeveloper.com/2018/01/encrypt-decrypt-data-nodejs-crypto-library/
  private encrypt = (data: string) => {
    var cipher = crypto.createCipher('aes-256-cbc', "f80f86dd550dc1806c483dd52a0fe4b8");
    var encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()]);
    return encrypted.toString("hex");
  }

  private decrypt = (data: any) => {
    data = Buffer.from(data, "hex");
    var decipher = crypto.createDecipher("aes-256-cbc", "f80f86dd550dc1806c483dd52a0fe4b8");
    var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString());
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