import axios from "axios";
import https from "https";

export interface IPagedResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
}

export interface IDependencyResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  list: Array<any>;
  error: IError | undefined;
}

export interface IError {
  message: string;
}

export class ArcGis {

  private httpsAgent = new https.Agent({ rejectUnauthorized: false });
  private url: string;
  private username: string;
  private password: string;
  private token: string | undefined = undefined;

  //private selfUrl = () => `${this.url}/sharing/rest/portals/self`
  private itemUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}`;
  private itemDataUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}/data`;
  private searchUrl = (start: number, num: number, q: string) => `${this.url}/sharing/rest/search?start=${start}&num=${num}&q=${q}`;
  private usersUrl = (orgId: string, start: number, num: number) => `${this.url}/sharing/rest/portals/${orgId}/users?start=${start}&num=${num}`;
  private itemDepUrl = (itemId: string, start: number, num: number) => `${this.url}/sharing/rest/content/items/${itemId}/dependencies?start=${start}&num=${num}`;
  private itemDepToUrl = (itemId: string, start: number, num: number) => `${this.url}/sharing/rest/content/items/${itemId}/dependencies/listDependentsTo?start=${start}&num=${num}`;
  private itemPortalUrl = (itemId: string) => `${this.url}/home/item.html?id=${itemId}`;

  constructor(url: string, username: string, password: string) {
    this.url = url;
    this.username = username;
    this.password = password;
  }

  // #region Dependencies
  public itemDependencies = async (itemId: string, start: number, num: number): Promise<IDependencyResponse> => {
    let response = await this.getWithTokenAsJson(this.itemDepUrl(itemId, start, num));
    return this.getDependencyResponseFromJson(response);
  }

  public itemDependenciesTo = async (itemId: string, start: number, num: number): Promise<IDependencyResponse> => {

    // This is a workaround, because in Portal 10.6.1 the JSON end point
    // does return empty lists :-(

    // 1. call JSON end point to get total, start, num, nextStart
    let response = await this.getWithTokenAsJson(this.itemDepToUrl(itemId, start, num));
    if (!response.error) {
      // 2. call HTML endpoint to get the list
      let html = await this.getWithTokenAsHtml(this.itemDepToUrl(itemId, start, num));
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



  public getItemPortalUrl = (itemId: string) => this.itemPortalUrl(itemId);

  public getItemDataUrl = async (itemId: string) => {
    let token = await this.getToken();
    let url = this.addJsonParameter(this.itemDataUrl(itemId));
    return this.addTokenParameter(url, token);
  }



  public users = async (orgId: string, start: number, num: number) => {
    return await this.getWithTokenAsJson(this.usersUrl(orgId, start, num));
  }

  public search = async (start: number, num: number, term: string) => {
    return await this.getWithTokenAsJson(this.searchUrl(start, num, term));
  }

  public getItem = async (id: string) => {
    return await this.getWithTokenAsJson(this.itemUrl(id));
  }

  private getWithTokenAsJson = async (url: string) => {

    const token = await this.getToken()
    url = await this.addJsonParameter(url)
    url = await this.addTokenParameter(url, token)
    const result = await axios.get(url, { httpsAgent: this.httpsAgent })
    return await result.data

  }

  private getWithTokenAsHtml = async (url: string) => {

    const token = await this.getToken()
    url = await this.addHTMLParameter(url)
    url = await this.addTokenParameter(url, token)
    const result = await axios.get(url, { httpsAgent: this.httpsAgent })
    return await result.data
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

    const repsonse = await axios.post(
      `${this.url}/sharing/rest/generateToken`,
      formData
    )
    this.token = repsonse.data.token;
    return await repsonse.data.token
  }
}