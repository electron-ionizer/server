/// <reference path="../../typings/index.d.ts" />

interface Application {
    name: string;
}

interface UserSubState {
    user?: User,
    signedIn: boolean
}

interface AppSubState extends Application {}
type PluginSubState = IonizerPlugin[];

interface AppState {
    user: UserSubState;
    app: AppSubState;
    plugins: PluginSubState;
}

declare module '*.scss' {
  const content: {
      [className: string]: string;   
  };
  export = content;
}

declare module '*.css' {
  const content: undefined;
  export = content;
}