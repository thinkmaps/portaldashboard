import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserClock, faUserTimes, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { IUser } from "../bo/RestInterfaces";
import { AppManager } from "../bo/AppManager";
export interface IUserCardProps {
  app: AppManager;
  key: string;
  item: IUser;
}

export default class UserCard extends React.Component<IUserCardProps> {

  private danger = 90;
  private warning = 20;

  private isOlderThan = (days: number) => {
    const danger = new Date();
    danger.setDate(danger.getDate() - days);
    return new Date(this.props.item.lastLogin) <= danger;
  }

  private getBorderColor = () => {
    if (this.isOlderThan(this.danger)) {
      return "border-danger"
    } else if (this.isOlderThan(this.warning)) {
      return "border-warning"
    } else {
      return "border-user"
    }
  }

  private getColor = () => {
    if (this.isOlderThan(this.danger)) {
      return "text-danger"
    } else if (this.isOlderThan(this.warning)) {
      return "text-warning"
    } else {
      return "user"
    }
  }

  private getIcon = () => {
    if (this.isOlderThan(this.danger)) {
      return <FontAwesomeIcon icon={faUserTimes} className="text-danger" />
    } else if (this.isOlderThan(this.warning)) {
      return <FontAwesomeIcon icon={faUserClock} className="text-warning" />
    } else {
      return <FontAwesomeIcon icon={faUser} className="user" />
    }
  }

  private nothing = () => {
    window.open(this.props.app.getUserContentUrl(this.props.item.username), "_blank")
  }

  public render() {
    return (
      <Card className={"bg-light " + this.getBorderColor()}>
        <Card.Body>
          <Card.Title className={this.getColor()}>
            <div className="h5 nw" title={this.props.item.fullName}>
              {this.getIcon()}{this.props.item.fullName}
            </div>
          </Card.Title>
          <Card.Text>
            Username: {this.props.item.username}<br />
            Email: {this.props.item.email}<br />
            Level: {this.props.item.level}<br />
            <span className={this.getColor()}>Last Login: {new Date(this.props.item.lastLogin).toLocaleDateString()}</span>
          </Card.Text>
        </Card.Body>
        <Card.Footer className={this.getColor() + " " + this.getBorderColor()}>
          <Button onClick={this.nothing} className="linkButton"><FontAwesomeIcon icon={faUserCog} className="codeBranch" title="Manage user items." /></Button>
        </Card.Footer>
      </Card >);
  }
}