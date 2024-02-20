export const DBConfig = {
  name: 'TooltipsDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'TooltipsObjectStore',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'data', keypath: 'data', options: { unique: false } },
        { name: 'videoData', keypath: 'videoData', options: { unique: false } },
      ],
    },
  ],
};
