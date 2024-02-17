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

# 現在分かっている不具合、未実装機能について

1. 実行環境のeth0のIPを特定してListen IPを決定しますが、正しくListen IPを決められない場合があります。特定関数の改良が必要です
2. ECHONET Lite Web APIとIoT House Simulator間はWeb Socketにより通信しています。通信は非同期であるため、リクエストとレスポンスの対応付けが必要です。このため、通信電文内にユニークIDを挿入していますが、ユニークIDの生成、ならびに、対応付けが未実装です。ですので、送受信が忙しくなりすぎると、電文を取り違える問題があります。対応策としては、ユニークIDの実装が必要です
