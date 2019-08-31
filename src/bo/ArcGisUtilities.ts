import ArcGis from "./ArcGis";

export default class ArcGisUtitlities {

  private arcgis: ArcGis;

  constructor(url: string, username: string, password: string) {
    this.arcgis = new ArcGis(url, username, password)
  }

  public searchAllItems = async (term: string) => {

    let all: Array<any> = []

    let first = await this.arcgis.search(1, 1, term)

    if (first && first.total) {
      for (let i = 1; i < parseInt(first.total); i = i + 25) {
        let next = await this.arcgis.search(i, 25, term)
        if (next && next.results) {
          next.results.forEach((r: any) => {
            all.push(r)
          })
        }
      }
    }
    return await all
  }

  // TODO: Make these two one function!
  public searchAllUsers = async (orgid: string) => {

    let all: Array<any> = []

    let first = await this.arcgis.users(orgid, 1, 1)

    if (first && first.total) {
      for (let i = 1; i < parseInt(first.total); i = i + 25) {
        let next = await this.arcgis.users(orgid, i, 25)
        if (next && next.results) {
          next.results.forEach((r: any) => {
            all.push(r)
          })
        }
      }
    }
    return await all
  }


}