# sequelizeの接続設定を`.env`で行う手順

  * 1行にまとめると「config.json」⇒「config.js」にして`require('dotenv').config();`すれば、後は`process.env`の値を埋め込めます。

## 前書き

* sequelizeはcliを利用することで、設定ファイル(config.json)、Model、Migration、Seederのひな形を作ることができて便利ですが、DB接続設定がファイルに直書きされるため不便な場合があります。

* 設定ファイル(config.json)を書き換えて、`config.use_env_variable`を利用すれば環境変数使えますが、.envで書き換えることはできません(読み込む場所がない)

* そこで、config.jsonをconfig.jsに変更し、.envから設定を読み込んで実行ができるようにします。
  もちろんmigration、seederも.envで設定します。


## 詳細手順

### 準備

* sequelizeをインストールします。Databaseはsqliteを使います(別途インストール不要なため)

```bash
npm init -y

npm install sequelize sequelize-cli sqlite3 dotenv
```

package.json は下記のようになります。
```
  "dependencies": {
    "dotenv": "^10.0.0",
    "sequelize": "^6.6.2",
    "sequelize-cli": "^6.2.0",
    "sqlite3": "^5.0.2"
  }
```


## sequelizeの初期化を行う前に設定ファイル`.sequelizerc`をプロジェクトルートに作成します

```bash
touch .sequelizerc
```

ポイントは2つ
* sequelizeフォルダ配下にファイルをまとめます
* 接続設定を`config.js`から読むようにします。(通常はjsonファイルのため、値を動的に変更することが難しいです)

```javascript
const path = require('path');

module.exports = {
    'config': path.resolve('./sequelize/config', 'config.js'),
    'models-path': path.resolve('./sequelize/models'),
    'seeders-path': path.resolve('./sequelize/seeders'),
    'migrations-path': path.resolve('./sequelize/migrations'),
};
```

### sequelize初期化

```
npx sequelize init
```

下記ファイルが生成されます。
```
./sequelize
    ├─config
    │   └ config.js
    ├─migrations
    ├─models
    │   └ index.js
    └seeders
```
### ./sequelize/config/config.js の変更

* 変更前

```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

* 変更後

  `.env`ファイルから設定を読み込みます。
  > require('dotenv').config();


```
require('dotenv').config();

config = {
  dialect: process.env.DB_DIARECT,
  storage: process.env.DB_STORAGE,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,    
}
module.exports = config;
```

### ./sequelize/models/index.js の変更

config.jsに変更した際、設定ファイルの構成を変えているので、読み込み側を少し変更します。

```javascript
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
```

`NODE_ENV`を利用しないように書き換えます。(NODE_ENVで環境の切替ができなくなります。.envファイルの内容を書き換えて利用します)

```javascript
// const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js');
```

### `.env`ファイル作成

```bash
touch .env
```

.env  sqliteを利用する設定(MySQLを利用する時はコメントを外してください)

```conf
NODE_ENV=development

# sqlite
DB_DIARECT=sqlite
DB_STORAGE=./db/app_dev.sqlite

# MySQL
# DB_DIARECT=mysql
# DB_NAME=test_db
# DB_HOST='localhost'
# DB_PORT='3306'
# DB_USER='root'
# DB_PASSWORD='please-modify-this-item'
```

### migration確認のためのファイル作成(user)

* 動作確認のためテーブル作成(migrationファイル作成)を行います
  
  modelとseederのひな形を作成します。
```
npx sequelize model:generate --name User --attributes name:string,birth:date,email:string
npx sequelize seed:generate --name user
```

 * seederを書き換えデータ登録できるようにします

 ```javascript
 'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return await queryInterface.bulkInsert("Users",[
      { name: "name1", email: "email1", birth: now, createdAt: now, updatedAt: now},
      { name: "name2", email: "email2", birth: now, createdAt: now, updatedAt: now},
      { name: "name3", email: "email3", birth: now, createdAt: now, updatedAt: now},
      { name: "name4", email: "email4", birth: now, createdAt: now, updatedAt: now},
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Users", null, {} );
  }
};
 ```

### 実行と確認


### migrationの実行

* database作成

  MySQLの場合は実行してください。sqliteは不要(エラーになる)です。

```bash
$ npx sequelize db:create
```
* migration実行

  ./db/app_dev.sqlite ファイルが作成されます。


```bash
$ npx sequelize db:migrate

Sequelize CLI [Node: 14.15.1, CLI: 6.2.0, ORM: 6.6.2]

Loaded configuration file "sequelize\config\config.js".
== 20210522085748-create-user: migrating =======
== 20210522085748-create-user: migrated (0.036s)
```



* seeder実行

  データが登録されます。

```bash
$ npx sequelize db:seed:all

Sequelize CLI [Node: 14.15.1, CLI: 6.2.0, ORM: 6.6.2]

Loaded configuration file "sequelize\config\config.json".
Using environment "development".
== 20210522072600-user: migrating =======
== 20210522072600-user: migrated (0.042s)
```

### 動作確認

index.jsを作成し、Userテーブルを正しくselect出来ることを確認します。

```javascript
const db = require('./sequelize/models/index'); // cliでinitした時に作成されるmodels配下のindex.js

// findAll
(async () => {
   const users = await db.User.findAll();
  for(user of users) {
    console.log(users);
  }
})();

```

実行
```js
$ node index.js
Executing (default): SELECT `id`, `name`, `birth`, `email`, `createdAt`, `updatedAt` FROM `Users` AS `User`;
[
  User {
    dataValues: {
      id: 1,
      name: 'name1',
      birth: 2021-05-08T14:27:06.852Z,
      email: 'email1',
      createdAt: 2021-05-08T14:27:06.852Z,
      updatedAt: 2021-05-08T14:27:06.852Z
    },
    _previousDataValues: {
      id: 1,
      name: 'name1',
      birth: 2021-05-08T14:27:06.852Z,
      email: 'email1',
      createdAt: 2021-05-08T14:27:06.852Z,
      updatedAt: 2021-05-08T14:27:06.852Z
    },
    _changed: Set(0) {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  },
  // ～～ 以下省略 ～～
```
