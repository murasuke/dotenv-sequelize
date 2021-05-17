# sequelizeの接続設定を環境変数(.env)で設定する

## 前書き

* sequelizeはcliを利用することで、設定ファイル(config.json)、Model、Migration、Seederのひな形を作ることができて便利です。

* しかし設定ファイル(config.json)はリテラルで記述されるため、環境ごとに書き換える必要があることや、セキュリティー的にファイルに直接記載するのはどうかと思います。

* そこで、環境変数(もしくは.envファイル)から設定を読み込んで実行ができるようにします（もちろんMigration、Seed時の設定も環境変数で設定します）

## 修正のポイント

1. `config.json`を`config.js`変更し、jsファイルを読み込むようにします。

1. jsファイル内でdotenvライブラリを読み込み、.envの設定をロードします。

1. `config.js`でexportする`config`オブジェクトの内容を環境変数でセットします。

## 詳細手順

### 準備


1. プロジェクトのルートフォルダに `.sequelizerc`ファイルを作成し、設定ファイル、model、migration、seeederの各フォルダを明示的に指定します。

1. 

* `config.use_env_variable`を使うことで環境変数から設定することができますが、migrationやseedには利用できず不便です。もっと柔軟にするために「config.json」を「config.js」に変更して環境変数から柔軟に変更できるようにします

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

