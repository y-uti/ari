ari
===

ランド指数 (Rand Index) および調整ランド指数 (Adjusted Rand Index) の計算を PHP で実装したものです。
実験のため k-means によるクラスタリングを行うプログラムも実装しました。

### 実行方法

二回のクラスタリングの結果をそれぞれ配列として与えます。
二つの配列の要素数は一致している必要があります。

    $c1 = array(1, 1, 2, 2, 3, 3, 4, 4);
    $c2 = array(1, 2, 3, 1, 2, 3, 1, 2);
    echo 'RI=' . calc_rand_index($c1, $c2) . "\n";
    echo 'ARI=' . calc_adjusted_rand_index($c1, $c2) . "\n";

このデータで実行すると以下の結果になります。

    RI=0.60714285714286
    ARI=-0.22222222222222

### 実験プログラム

experiments/RUNME.sh を実行すると、日本の都道府県庁所在地の緯度経度をデータ点として
k-means によるクラスタリングを繰り返し実行し、それらのクラスタリング間のランド指数を計算します。

この実験においては、国土交通省国土地理院のウェブサイトに含まれる下記ページのデータを利用しています。

    都道府県庁の経度緯度
    http://www.gsi.go.jp/KOKUJYOHO/kencho/kenchobl.html

プログラムの実行の様子を以下に示します。

    $ ./experiments/RUNME.sh
    Downloading data file from http://www.gsi.go.jp/KOKUJYOHO/kencho/kenchobl.html
    ...
    Converting data file into csv
    Clustering by k-means (K=2, 10 trials)
    Clustering by k-means (K=3, 10 trials)
    ...
    Calculating RI and ARI (K1=2, K2=2)
    Calculating RI and ARI (K1=2, K2=3)
    Calculating RI and ARI (K1=2, K2=4)
    ...

実験結果は experiments/out ディレクトリに出力されます。

    $ ls -1 experiments/out
    cluster_002_010.csv
    cluster_003_010.csv
    cluster_004_010.csv
    cluster_005_010.csv
    kenchobl.csv
    kenchobl.html
    results_005_010.csv

+ kenchobl.html  
  都道府県庁の緯度経度情報を含む html ファイルです
+ kenchobl.csv  
  上記 html ファイルから都道府県名、経度、緯度を抽出した csv ファイルです
+ cluster_*K*_*N*.csv  
  k-means によるクラスタリングの結果です。47 行 *N* 列の行列形式のデータで、各行は kenchobl.csv と同じ順序で都道府県を表します。各列には *N* * 2 回の試行結果が列挙されます
+ results_*K*_*N*.csv  
  異なるクラスタリング間のランド指数、調整ランド指数を計算した結果です。先頭はヘッダ行です。K1, K2, はクラスタ数、I は試行番号を表します。RI と ARI の列が計算結果です
