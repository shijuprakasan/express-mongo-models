export interface ICoreModel extends ICoreLiteModel {
  created?: IChangeTrackModel;
  modified?: IChangeTrackModel;

  deleted?: boolean;
}

export interface ICoreLiteModel {
  _id: string;
}

export interface IChangeTrackModel {
  by: IUserLiteModel;
  on: Date;
}

export interface IUserLiteModel {
  _id: string;
  userName: string;
  // displayName: string;
}

export function getUserLiteModel(user: IUserLiteModel): IUserLiteModel {
  return {
    _id: user._id,
    userName: user.userName,
  } as IUserLiteModel;
}

export function newChangeTrack(user: IUserLiteModel): IChangeTrackModel {
  return {
    by: getUserLiteModel(user),
    on: new Date(),
  };
}
