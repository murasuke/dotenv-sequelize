# sequelizeの接続設定を環境変数から構成する方法

* `config.use_env_variable`を使うことで環境変数から設定することができますが、もっと柔軟にするために「config.json」を「config.js」に変更して環境変数から柔軟に変更できるようにします

```bash
npm init -y
npm i sequelize sequelize-cli sqlite3 dotenv
```

## sequelizeの初期化を行う前に設定ファイル`.sequelizerc`をプロジェクトルートに作成します。

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

* sequelizeの初期化を実行しｍさう
```bash
npx sequelize init
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

```
require('dotenv').config();

config = {
  [process.env.NODE_ENV] : {
    dialect: process.env.DB_DIARECT,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,    
  }
}
module.exports = config;

```


## 参考 環境変数「use_env_variable」を利用する場合
