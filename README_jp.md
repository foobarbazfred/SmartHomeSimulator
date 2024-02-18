# SmartHomeSimulatorについて

SmartHomeSimulatorはHome IoT プログラミング研修のために作成されたソフトウエアであり、ECHONET Lite Web APIとIoT House Simulatorで構成されます。
ソフトウエアはJavaScriptで記述されており、ECHONET Lite Web APIはNode.js上で動作し、IoT House Simulatorはブラウザ上で動作します。
上記２つのソフトウエアはWebSocketで通信しています。

# ソフトウエアのインストール方法

または、node.jsが動くLinux環境またはWindows環境において、ファイル一式を配置してください。app.jsやpackage.jsonが置かれているフォルダにおいて、以下のコマンド実行してください。必要なパッケージ類がインストールされます。
```
npm  install
```
もしバージョンが古い等の問題がありましたら、必要なパッケージ類を個別にインストールすることも可能です。必須パッケージはsocket.ioとexpressです。

# ソフトウエアの起動方法

app.jsが置かれているフォルダで以下のコマンドによりソフトウエアを起動できます
```
node app.js
```
正常に起動されると以下のようにListen IPとPortが表示されます。ブラウザから該当のIP:Portでアクセスしてください。ECHONET Lite Web APIの説明ページが表示されます。
```
ubuntu:~/somepass/SmartHomeSimulator/src$ node app.js
this is IPv4 and IP is detected
172.17.96.137
listen on 172.17.96.137:8010
```
上記の場合、ブラウザから`http://172.17.96.137:8010`でアクセスしてください。

# 現在分かっている不具合、未実装機能について

1. 実行環境のeth0のIPを特定してListen IPを決定しますが、正しくListen IPを決められない場合があります。IP判定ルーチンの改良が必要です
2. ECHONET Lite Web APIとIoT House Simulator間はWeb Socketにより通信しています。通信は非同期であるため、リクエスト（処理要求）電文とレスポンス（処理応答）電文の対応付けが必要です。交わされる電文の対応付けを可能にするため通信電文内にユニークIDを挿入していますが、ユニークIDの生成が固定値のままであり、さらに対応付けのコードが未実装です。ですので、現状では送受信される電文の対応付けが実装できていません。送受信が忙しくなりすぎると、電文を取り違える問題があります。対応策としては、ユニークIDの生成と突き合わせのためのコード実装が必要です。
3. ログ出力を正しく管理できていません。Node.jsによるアプリの場合、どのように実行ログを処理させるのが標準仕様なのかわかっておらず、現在は起動コンソールに出されるままになっています。
