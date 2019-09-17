import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { IServer } from "../bo/RestInterfaces";

interface IServerCardProps {
  key: string;
  item: IServer;
}

export const ServerCard: React.FC<IServerCardProps> = (props: IServerCardProps) => (
  <Card className="bg-light border-server">
    <Card.Body>
      <Card.Title className="server">
        <div className="h5 nw" title={props.item.id}>
          <FontAwesomeIcon icon={faServer} className="server" />
          {props.item.id}
        </div>
      </Card.Title>
      <Card.Text>
        Url: {props.item.url}<br />
        Is Hosted: {props.item.isHosted.toString()}<br />
        Server Type: {props.item.serverType}<br />
        Server Role: {props.item.serverRole}<br />
      </Card.Text>
    </Card.Body>
  </Card>
);