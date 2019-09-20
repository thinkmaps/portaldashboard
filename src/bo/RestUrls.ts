export default class RestUrls {

  private url: string;
  constructor(baseUrl: string) {
    this.url = baseUrl;
  }

  // Token 
  // https://developers.arcgis.com/rest/users-groups-and-items/generate-token.htm
  public generateTokenUrl = () => `${this.url}/sharing/rest/generateToken`;

  // Servers
  // https://developers.arcgis.com/rest/users-groups-and-items/servers.htm
  public serversUrl = (orgId: string) => `${this.url}/sharing/rest/portals/${orgId}/servers`;
  public serverManagerUrl = (serverUrl: string) => `${serverUrl}/manager`;
  public serverAdminUrl = (serverUrl: string) => `${serverUrl}/admin`;
  public serverRestUrl = (serverUrl: string) => `${serverUrl}/rest`;

  // Item
  // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
  public itemUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}`;
  // https://developers.arcgis.com/rest/users-groups-and-items/item-data.htm
  public itemDataUrl = (id: string) => `${this.url}/sharing/rest/content/items/${id}/data`;
  public itemPortalUrl = (itemId: string) => `${this.url}/home/item.html?id=${itemId}`;
  public webmapViewerUrl = (itemId: string) => `${this.url}/home/webmap/viewer.html?webmap=${itemId}`;

  // Search
  // https://developers.arcgis.com/rest/users-groups-and-items/search.htm
  public searchUrl = (start: number, num: number, q: string) =>
    `${this.url}/sharing/rest/search?start=${start}&num=${num}&q=${q}`;

  // Users
  // https://developers.arcgis.com/rest/users-groups-and-items/users.htm
  public usersUrl = (orgId: string, start: number, num: number) =>
    `${this.url}/sharing/rest/portals/${orgId}/users?start=${start}&num=${num}`;
  public userContentUrl = (user: string) =>
    `${this.url}/home/content.html?user=${user}`;

  // Dependencies
  // https://support.esri.com/en/technical-article/000021183
  public itemDepUrl = (itemId: string, start: number, num: number) =>
    `${this.url}/sharing/rest/content/items/${itemId}/dependencies?start=${start}&num=${num}`;
  public itemDepToUrl = (itemId: string, start: number, num: number) =>
    `${this.url}/sharing/rest/content/items/${itemId}/dependencies/listDependentsTo?start=${start}&num=${num}`;


}