import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons'

export interface IButtonProps {
  onClick: any;
}

export function DependencyButton(props: IButtonProps) {
  return (
    <Button onClick={props.onClick} className="linkButton"><FontAwesomeIcon icon={faCodeBranch} className="codeBranch" title="Show dependencies." /></Button>
  );
}
