import * as React from 'react';
import Modal from "react-bootstrap/Modal";
import Dependencies from "./Dependencies";
import { Dependency } from '../bo/Dependencies';
import { AppManager } from '../bo/AppManager';

interface IDependencyDialogProps {
  show: boolean;
  close: any;
  dependencies: Array<Dependency>;
  itemId: string;
  app: AppManager;
}

export default class DependencyDialog extends React.Component<IDependencyDialogProps> {

  public render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close} dialogClassName="dialog">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Relations between portal items:</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ccenter">
          <Dependencies dependencies={this.props.dependencies} itemId={this.props.itemId} app={this.props.app} />
        </Modal.Body>
      </Modal>
    );
  }
}
