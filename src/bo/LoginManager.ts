import crypto from "crypto";
import { ArcGis } from "./ArcGis";

export default class LoginManager {

  public static loginToPortal = (url: string, callback: any): void => {

    // Get username and password from local storage
    let username = LoginManager.getUsername(url);
    let password = LoginManager.getPassword(url);

    /// If there are username and password
    if (username && password && username.length > 0 && password.length > 0) {

      // decrypt username and password
      username = LoginManager.decrypt(username);
      password = LoginManager.decrypt(password);

      // create instance of ArcGis
      let arcgis = new ArcGis(url, username!, password!);

      // check the credentials
      arcgis.hasValidCredentials().then(hasValidCredentials => {
        if (hasValidCredentials) {
          callback(arcgis);
        } else {
          callback(undefined)
        }
      });
    } else {
      // if there are no username and password or the credentials are invalid
      callback(undefined);

    }
  }

  public static setCredentials = (url: string, username: string, password: string): void => {
    // store username and password in the local storage
    LoginManager.setUsername(url, username);
    LoginManager.setPassword(url, password);
  }

  private static getUsername = (url: string) =>
    window.localStorage.getItem(`${LoginManager.encrypt(url)}un`);
  private static getPassword = (url: string) =>
    window.localStorage.getItem(`${LoginManager.encrypt(url)}pw`);
  private static setUsername = (url: string, username: string) =>
    window.localStorage.setItem(`${LoginManager.encrypt(url)}un`, LoginManager.encrypt(username));
  private static setPassword = (url: string, password: string) =>
    window.localStorage.setItem(`${LoginManager.encrypt(url)}pw`, LoginManager.encrypt(password));

  // https://www.thepolyglotdeveloper.com/2018/01/encrypt-decrypt-data-nodejs-crypto-library/
  private static encrypt = (data: string) => {
    var cipher = crypto.createCipher('aes-256-cbc', "f80f86dd550dc1806c483dd52a0fe4b8");
    var encrypted = Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "utf8")), cipher.final()]);
    return encrypted.toString("hex");
  }

  // https://www.thepolyglotdeveloper.com/2018/01/encrypt-decrypt-data-nodejs-crypto-library/
  private static decrypt = (data: any) => {
    data = Buffer.from(data, "hex");
    var decipher = crypto.createDecipher("aes-256-cbc", "f80f86dd550dc1806c483dd52a0fe4b8");
    var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
}