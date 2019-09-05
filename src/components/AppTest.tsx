import * as React from 'react';
import { AppManager } from "../bo/AppManager";

export interface IAppTestProps {
}

export default class AppTest extends React.Component<IAppTestProps> {

  private app: AppManager;

  constructor(props: IAppTestProps) {
    super(props);
    this.app = new AppManager();
  }

  private callback = (e: any) => {
    console.log(e);
  }

  private doSomething = () => {
    this.app.getItemDependencies(this.callback, "4b0cab97e4eb4577ab621ba20a599b5f");
    this.app.getItemDependenciesTo(this.callback, "4b0cab97e4eb4577ab621ba20a599b5f");
    return <div></div>;
  }

  public render() {
    return (
      <div>{this.doSomething()}</div>
    );
  }
}
