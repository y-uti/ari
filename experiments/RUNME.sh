#!/bin/bash

# 実験回数を指定する
KLIMIT=${1:-5}
TRIALS=${2:-10}

################################################################################

PROJECT_ROOT_DIR=$(cd $(dirname $0)/.. && pwd)

EXP_DIR=$PROJECT_ROOT_DIR/experiments
SRC_DIR=$PROJECT_ROOT_DIR
OUT_DIR=$EXP_DIR/out

KENCHOBL_REMOTE_URL=http://www.gsi.go.jp/KOKUJYOHO/kencho/kenchobl.html
KENCHOBL_HTML=$OUT_DIR/kenchobl.html
KENCHOBL_CSV=${KENCHOBL_HTML%.html}.csv

RESULT_FILE=$OUT_DIR/results_$(printf "%03d" $KLIMIT)_$(printf "%03d" $TRIALS).csv

function cluster_file {
    local k=$1
    local t=$2
    echo $OUT_DIR/cluster_$(printf "%03d" $k)_$(printf "%03d" $t).csv
}

pushd $EXP_DIR >/dev/null

mkdir -p $OUT_DIR

# 国土地理院のウェブサイトから都道府県庁の経度緯度データをダウンロードする
if [ ! -f $KENCHOBL_HTML ]; then
    echo "Downloading data file from $KENCHOBL_REMOTE_URL"
    wget $KENCHOBL_REMOTE_URL -O $KENCHOBL_HTML
else
    echo "Data file already exists"
fi

# html ファイルを "都道府県名,経度,緯度" の csv 形式に変換する
echo "Converting data file into csv"
cat $KENCHOBL_HTML \
| sed 's/\r//g' \
| grep '<TD>' \
| tail -n +4 \
| sed 's/<[^>]*>//g' \
| sed 's/　/ /g' \
| awk '
  (NR % 3 == 1) { gsub(" ", ""); printf("%s,", $0); }
  (NR % 3 == 2) { printf("%f," , $1 + $2 / 60 + $3 / 3600); }
  (NR % 3 == 0) { printf("%f\n", $1 + $2 / 60 + $3 / 3600); }
' >$KENCHOBL_CSV

# K-means 法を用いてクラスタリングする
for k in $(seq 2 $KLIMIT); do
    echo "Clustering by k-means (K=$k, $TRIALS trials)"
    outfile=$(cluster_file $k $TRIALS)
    php run_kmeans.php $KENCHOBL_CSV $k $(($TRIALS * 2)) >$outfile
done

# Rand Index と Adjusted Rand Index を計算する
echo K1,K2,I,RI,ARI >$RESULT_FILE
for k1 in $(seq 2 $KLIMIT); do
    for k2 in $(seq $k1 $KLIMIT); do
        echo "Calculating RI and ARI (K1=$k1, K2=$k2)"
        for i in $(seq 1 $TRIALS); do
            infile1=$(cluster_file $k1 $TRIALS)
            infile2=$(cluster_file $k2 $TRIALS)
            if [ $k1 -eq $k2 ]; then
                values=$( \
                    cut -d, -f$i,$(($i + $TRIALS)) $infile1 \
                    | php calculate.php \
                )
            else
                values=$( \
                    paste -d, $infile1 $infile2 \
                    | cut -d, -f$i,$(($i + $TRIALS * 2)) \
                    | php calculate.php \
                )
            fi
            echo $k1,$k2,$i,$values >>$RESULT_FILE
        done
    done
done

popd >/dev/null
