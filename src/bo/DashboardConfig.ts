export interface IPortal {
  name: string;
  url: string;
}

export interface IDashboardConfig {

  "portals": Array<IPortal>;
  "showApps": string;
  "showMaps": string;
  "showMapayers": string;
  "showFeaturelayer": string;
  "showTools": string;
  "showUsers": string;
  "showServer": string;

}