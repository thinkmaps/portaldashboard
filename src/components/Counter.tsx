import * as React from 'react';

export interface ICounterProps {
  cssClass: string;
  itemCount: number;
  filteredItemCount: number;
}

export default class Counter extends React.Component<ICounterProps> {
  public render() {
    return (
      <>
        <div className="counterWrapper">
          <div className={"counter " + this.props.cssClass}>Items total:</div>
          <div className={"counter large " + this.props.cssClass}>{this.props.itemCount}</div>
        </div>
        <div className="counterWrapper">
          <div className={"counter " + this.props.cssClass}>Items filtered:</div>
          <div className={"counter large " + this.props.cssClass}>{this.props.filteredItemCount}</div>
        </div>
      </>
    );
  }
}
