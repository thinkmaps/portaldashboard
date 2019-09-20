import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import { IItem } from "../bo/RestInterfaces";
import { AppManager } from '../bo/AppManager';
import { ItemDetailsButton, RestLinkButton } from "./buttons/LinkButtons";

interface IToolCardProps {
  key: string;
  item: IItem;
  app: AppManager;
}

export default class ToolCard extends React.Component<IToolCardProps> {
  public render() {
    return (
      <Card className="bg-light border-tool">
        <Card.Body>
          <Card.Title className="tool">
            <div className="h5 nw" title={this.props.item.id}>
              <FontAwesomeIcon icon={faTools} className="tool" />
              {this.props.item.title}
            </div>
          </Card.Title>
          <Card.Text>
            By: {this.props.item.owner}<br />
            Created: {new Date(this.props.item.created).toLocaleDateString()}<br />
          </Card.Text>
        </Card.Body>
        <Card.Footer className="tool">
          <ItemDetailsButton app={this.props.app} item={this.props.item} />
          <RestLinkButton app={this.props.app} item={this.props.item} />
        </Card.Footer>

      </Card>
    )
  }
};