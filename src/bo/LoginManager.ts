import crypto from "crypto";
import { ArcGis } from "./ArcGis";

export default class LoginManager {

  public loginToPortal = (url: string, callback: any): ArcGis | undefined => {

    let username = this.getUsername(url);
    let password = this.getPassword(url);

    if (username && password && username.length > 0 && password.length > 0) {
      username = this.decrypt(username);
      password = this.decrypt(password);

      let arcgis = new ArcGis(url, username!, password!);
      arcgis.hasValidCredentials().then(hasValidCredentials => {
        if (hasValidCredentials) {
          callback(arcgis);
        } else { callback(undefined) }
      })
    } else {
      return callback(undefined);
    }
  }

  public setCredentials = (url: string, username: string, password: string) => {
    this.setUsername(url, username);
    this.setPassword(url, password);
  }

  private getUsername = (url: string) =>
    window.localStorage.getItem(`${this.encrypt(url)}un`);
  private getPassword = (url: string) =>
    window.localStorage.getItem(`${this.encrypt(url)}pw`);
  private setUsername = (url: string, username: string) =>
    window.localStorage.setItem(`${this.encrypt(url)}un`, this.encrypt(username));
  private setPassword = (url: string, password: string) =>
    window.localStorage.setItem(`${this.encrypt(url)}pw`, this.encrypt(password));

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

}