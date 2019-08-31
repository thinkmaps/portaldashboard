import axios from "axios";
import https from "https";
import FormData from 'form-data'

export default class ArcGis {

  private httpsAgent = new https.Agent({ rejectUnauthorized: false });
  private url: string;
  private username: string;
  private password: string;
  private token: string | undefined = undefined;

  //private selfUrl = () => `${this.url}/sharing/rest/portals/self`
  private itemUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}`;
  //private itemDataUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}/data`;
  private searchUrl = (start: number, num: number, q: string) =>
    `${this.url}/sharing/rest/search?start=${start}&num=${num}&q=${q}`;
  private usersUrl = (orgId: string, start: number, num: number) => `${this.url}/sharing/rest/portals/${orgId}/users?start=${start}&num=${num}`;

  constructor(url: string, username: string, password: string) {
    this.url = url;
    this.username = username;
    this.password = password;
  }

  //public self = () => this._getWithToken(this.selfUrl())
  //public getItem = (id: string) => this._getWithToken(this.itemUrl(id));
  //public getItemData = (id: string) => this._getWithToken(this.itemDataUrl(id))

  public users = async (orgId: string, start: number, num: number) => {
    return await this.getWithToken(this.usersUrl(orgId, start, num));
  }

  public search = async (start: number, num: number, term: string) => {
    return await this.getWithToken(this.searchUrl(start, num, term));
  }

  public getItem = async (id: string) => {
    return await this.getWithToken(this.itemUrl(id));
  }

  private getWithToken = async (url: string) => {

    const token = await this.getToken()
    url = await this.addJsonParameter(url)
    url = await this.addTokenParameter(url, token)
    const result = await axios.get(url, { httpsAgent: this.httpsAgent })
    return await result.data

  }

  private addJsonParameter = (url: string) => {
    return this.addParameter(url, "f", "json")
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
    return await repsonse.data.token
  }
}