# SmartHomeSimulatorについて

SmartHomeSimulatorはHome IoT プログラミング研修のために作成されたソフトウエアであり、ECHONET Lite Web APIとIoT House Simulatorで構成されます。
ソフトウエアはJavaScriptで記述されており、ECHONET Lite Web APIはNode.js上で動作し、IoT House Simulatorはブラウザ上で動作します。
上記２つのソフトウエアはWebSocketで通信しています。

# ソフトウエアのインストール方法

または、node.jsが動くLinux環境またはWindows環境において、ファイル一式を配置してください。app.js類が置かれているファイルにおいて、以下のコマンドによりインストールできます
npm  install

もしバージョンが古い等の問題がありましたら、必要なパッケージ類を個別にインストールすることも可能です。

# ソフトウエアの起動方法

app.jsが置かれているフォルダで以下のコマンドによりソフトウエアを起動できます

node app.js
