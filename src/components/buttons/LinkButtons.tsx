import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faInfoCircle, faUserCog, faLink, faEye, faWrench, faCog } from '@fortawesome/free-solid-svg-icons'
import { AppManager } from '../../bo/AppManager';
import { IItem, IUser, IServer } from '../../bo/RestInterfaces';

export interface IItemLinkButtonProps {
  app: AppManager;
  item: IItem;
}

export interface IUserLinkButtonProps {
  app: AppManager;
  user: IUser;
}

export interface IServerLinkButtonProps {
  app: AppManager;
  server: IServer;
}

export class ItemDataButton extends React.PureComponent<IItemLinkButtonProps> {

  private openItemDataUrl = () => {
    this.props.app.getItemDataUrl(this.props.item.id).then(url =>
      window.open(url, "_blank")
    )
  }
  public render = () =>
    <Button onClick={this.openItemDataUrl} className="linkButton">
      <FontAwesomeIcon icon={faCode} className="codeBranch" title="Show JSON." />
    </Button>
}

export class ItemDetailsButton extends React.PureComponent<IItemLinkButtonProps> {

  private openItemDetailsUrl = () =>
    window.open(this.props.app.getItemPortalUrl(this.props.item.id), "_blank")
  public render = () =>
    <Button onClick={this.openItemDetailsUrl} className="linkButton">
      <FontAwesomeIcon icon={faInfoCircle} className="codeBranch" title="Show Portal Item Details." />
    </Button>
}

export class ManageUserItemsButton extends React.PureComponent<IUserLinkButtonProps> {

  private openMangeUserItemsUrl = () =>
    window.open(this.props.app.getUserContentUrl(this.props.user.username), "_blank")
  public render = () =>
    <Button onClick={this.openMangeUserItemsUrl} className="linkButton">
      <FontAwesomeIcon icon={faUserCog} className="codeBranch" title="Manage user items." />
    </Button>
}

export class RestLinkButton extends React.PureComponent<IItemLinkButtonProps> {

  private openServerLink = () =>
    window.open(this.props.item.url, "_blank")
  public render = () =>
    <Button onClick={this.openServerLink} className="linkButton">
      <FontAwesomeIcon icon={faLink} className="codeBranch" title="Open REST endpoint." />
    </Button>
}

export class ViewAppButton extends React.PureComponent<IItemLinkButtonProps> {

  private openServerLink = () =>
    window.open(this.props.item.url, "_blank")
  public render = () =>
    <Button onClick={this.openServerLink} className="linkButton">
      <FontAwesomeIcon icon={faEye} className="codeBranch" title="View application." />
    </Button>
}

export class ViewMapButton extends React.PureComponent<IItemLinkButtonProps> {

  private openMapviewerLink = () =>
    window.open(this.props.app.getWebmapViewerUrl(this.props.item.id), "_blank")
  public render = () =>
    <Button onClick={this.openMapviewerLink} className="linkButton">
      <FontAwesomeIcon icon={faEye} className="codeBranch" title="View Map." />
    </Button>
}

export class ServerManagerButton extends React.PureComponent<IServerLinkButtonProps> {

  private openServerManagerLink = () =>
    window.open(this.props.app.getServerManagerUrl(this.props.server.adminUrl), "_blank")
  public render = () =>
    <Button onClick={this.openServerManagerLink} className="linkButton">
      <FontAwesomeIcon icon={faCog} className="codeBranch" title="Open Server Manager." />
    </Button>
}

export class ServerAdminButton extends React.PureComponent<IServerLinkButtonProps> {

  private openServerAdminLink = () =>
    window.open(this.props.app.getServerAdminUrl(this.props.server.adminUrl), "_blank")
  public render = () =>
    <Button onClick={this.openServerAdminLink} className="linkButton">
      <FontAwesomeIcon icon={faWrench} className="codeBranch" title="Open Server Admin." />
    </Button>
}

export class ServerRestButton extends React.PureComponent<IServerLinkButtonProps> {

  private openServerAdminLink = () =>
    window.open(this.props.app.getServerRestUrl(this.props.server.url), "_blank")
  public render = () =>
    <Button onClick={this.openServerAdminLink} className="linkButton">
      <FontAwesomeIcon icon={faLink} className="codeBranch" title="List Servers REST interface." />
    </Button>
}