export class Item {

  public id: string;
  public type: string;
  public title: string;
  public owner: string;
  public created: Date;

  constructor(id: string, type: string, title: string, owner: string, created: string) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.owner = owner;
    this.created = new Date(parseInt(created));
  }
}

export class User {

  public username: string;
  public fullname: string;
  public email: string;
  public level: string;
  public lastLogin: Date;

  constructor(username: string, fullname: string, email: string, level: string, lastLogin: string) {
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.level = level;
    this.lastLogin = new Date(parseInt(lastLogin));
  }
}