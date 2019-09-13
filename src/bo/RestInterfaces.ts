export interface IError {
  code?: string;
  messageCode?: string;
  message: string;
  details?: Array<string>
}

// https://developers.arcgis.com/rest/users-groups-and-items/servers.htm
export interface IServer {
  id: string;
  name: string;
  url: string;
  isHosted: boolean;
  serverType: string;
  serverRole: string;
  serverFunction: string;
}

// https://developers.arcgis.com/rest/users-groups-and-items/item.htm
export interface IItem {
  id: string;
  type: string;
  title: string;
  owner: string;
  created: string;
}

// https://developers.arcgis.com/rest/users-groups-and-items/users.htm
export interface IUser {
  username: string;
  fullName: string;
  email: string;
  level: string;
  lastLogin: string;
}

// https://support.esri.com/en/technical-article/000021183
export interface IDependencyResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  list: Array<any>;
  error: IError | undefined;
}
export interface IDependency {
  dependencyType: string;
  id?: string;
  url?: string;
}

