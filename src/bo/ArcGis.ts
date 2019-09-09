import axios from "axios";
import https from "https";
import RestUrls from "./RestUrls";
import { IError, IDependencyResponse } from "./RestInterfaces";

export class ArcGis {

  private httpsAgent = new https.Agent({ rejectUnauthorized: false });
  private username: string;
  private password: string;
  private token: string | undefined = undefined;
  private urls: RestUrls;

  constructor(url: string, username: string, password: string) {
    this.username = username;
    this.password = password;
    this.urls = new RestUrls(url);
  }


  // Servers
  public servers = async (orgId: string) => {
    return await this.getWithTokenAsJson(this.urls.serversUrl(orgId));
  }

  // Search
  public search = async (term: string, start: number, num: number) => {
    return await this.getWithTokenAsJson(this.urls.searchUrl(start, num, term));
  }

  // Item
  public getItem = async (id: string) => {
    return await this.getWithTokenAsJson(this.urls.itemUrl(id));
  }

  // Users
  public users = async (orgId: string, start: number, num: number) => {
    return await this.getWithTokenAsJson(this.urls.usersUrl(orgId, start, num));
  }

  // Dependencies
  public itemDependencies = async (itemId: string, start: number, num: number): Promise<IDependencyResponse> => {
    let response = await this.getWithTokenAsJson(this.urls.itemDepUrl(itemId, start, num));
    return this.getDependencyResponseFromJson(response);
  }

  public itemDependenciesTo = async (itemId: string, start: number, num: number): Promise<IDependencyResponse> => {

    // This is a workaround, because in Portal 10.6.1 the JSON end point
    // does return empty lists :-(

    // 1. call JSON end point to get total, start, num, nextStart
    let response = await this.getWithTokenAsJson(this.urls.itemDepToUrl(itemId, start, num));
    if (!response.error) {
      // 2. call HTML endpoint to get the list
      let html = await this.getWithTokenAsHtml(this.urls.itemDepToUrl(itemId, start, num));
      let list = JSON.parse(this.getListFromHtml(html));
      return this.getDependencyResponseFromJson(response, list);
    }
    return this.getDependencyResponseFromJson(response);
  }

  private getDependencyResponseFromJson = (response: any, list?: Array<any>): IDependencyResponse => {

    if (response.error) {
      let error: IError = { message: response.error.message };
      return { total: -1, start: -1, num: -1, nextStart: -1, list: [], error: error };
    }

    let l = list ? list : response.list;
    return {
      total: response.total,
      start: response.start,
      num: response.num,
      nextStart: response.nextStart,
      list: l,
      error: undefined
    }
  }

  private getListFromHtml = (html: string) => {
    let dom = document.createElement("html");
    dom.innerHTML = html;
    let pre = dom.getElementsByTagName("pre")[0];
    let p = pre.innerHTML.replace(new RegExp("&nbsp;", 'g'), "");
    p = p.replace(new RegExp(/\n/, "g"), "");
    p = p.replace(new RegExp(/\\"/, "g"), '"');
    return p;
  }
  // #endregion



  public getItemPortalUrl = (itemId: string) => this.urls.itemPortalUrl(itemId);

  public getItemDataUrl = async (itemId: string) => {
    let token = await this.getToken();
    let url = this.addJsonParameter(this.urls.itemDataUrl(itemId));
    return this.addTokenParameter(url, token);
  }


  private getWithTokenAsJson = async (url: string) => {

    const token = await this.getToken()
    url = this.addJsonParameter(url)
    url = this.addTokenParameter(url, token)
    const result = await axios.get(url, { httpsAgent: this.httpsAgent })
    return result.data

  }

  private getWithTokenAsHtml = async (url: string) => {

    const token = await this.getToken()
    url = this.addHTMLParameter(url)
    url = this.addTokenParameter(url, token)
    const result = await axios.get(url, { httpsAgent: this.httpsAgent })
    return result.data
  }

  private addJsonParameter = (url: string) => {
    return this.addParameter(url, "f", "json")
  }

  private addHTMLParameter = (url: string) => {
    return this.addParameter(url, "f", "html")
  }

  private addTokenParameter = (url: string, token: string) => {
    return this.addParameter(url, "token", token)
  }

  private addParameter = (url: string, paramterKey: string, parameterValue: string) => {
    if (url.lastIndexOf("?") < 0) {
      url += "?"
    } else {
      url += "&"
    }
    return `${url}${paramterKey}=${parameterValue}`
  }

  private getToken = async () => {

    if (this.token) return this.token;

    const ref = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

    let formData = new FormData();
    formData.append("username", this.username);
    formData.append("password", this.password);
    formData.append("referer", ref);
    formData.append("expiration", "60");
    formData.append("f", "json");

    const repsonse = await axios.post(this.urls.generateTokenUrl(), formData)
    this.token = repsonse.data.token;

    // Renew token after 55 minutes
    window.setInterval(() => { this.token = undefined; console.log("Token reset.") }, 55 * 60 * 60 * 1000);

    return await repsonse.data.token
  }
}