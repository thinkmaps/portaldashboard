import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { IServer } from "../../bo/RestInterfaces";
import { ServerManagerButton, ServerAdminButton, ServerRestButton } from '../buttons/LinkButtons';
import { AppManager } from '../../bo/AppManager';

interface IServerCardProps {
  key: string;
  item: IServer;
  app: AppManager;
}

export default class ServerCard extends React.Component<IServerCardProps> {

  public render() {

    return (
      <Card className="bg-light border-server">
        <Card.Body>
          <Card.Title className="server">
            <div className="h5 nw" title={this.props.item.id}>
              <FontAwesomeIcon icon={faServer} className="server" />
              {this.props.item.id}
            </div>
          </Card.Title>
          <Card.Text>
            Url: {this.props.item.url}<br />
            Is Hosted: {this.props.item.isHosted.toString()}<br />
            Server Type: {this.props.item.serverType}<br />
            Server Role: {this.props.item.serverRole}<br />
          </Card.Text>
        </Card.Body>
        <Card.Footer className="server">
          <ServerManagerButton app={this.props.app} server={this.props.item} />
          <ServerAdminButton app={this.props.app} server={this.props.item} />
          <ServerRestButton app={this.props.app} server={this.props.item} />
        </Card.Footer>
      </Card>
    );
  }
}