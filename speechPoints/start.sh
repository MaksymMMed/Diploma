#!/bin/bash
echo conf start
echo

BLUE='\033[0;34m'
NC='\033[0m'

kaldiroot=/home/maksymm/my/kaldi
otherfolder=/home/maksymm/my/kaldi/egs/a_my/other
echo kaldi root: $kaldiroot
cd $kaldiroot/egs/a_my/

create_symlink() {
    target=$1
    link_name=$2
    if [ ! -e "$link_name" ]; then
        ln -s "$target" "$link_name"
    else
        echo "Link '$link_name' already exists."
    fi
}

create_symlink ../wsj/s5/steps ./steps
create_symlink ../wsj/s5/utils ./utils
create_symlink ../../src ./src

# copy path.sh
cp ../wsj/s5/path.sh .
# change path
sed -i '1s#.*#export KALDI_ROOT=`pwd`/../..#' path.sh

create_directory() {
    dir=$1
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir" && echo "dir '$dir' created."
    else
        echo "dir '$dir' already exists."
    fi
}

create_directory "exp"
create_directory "conf"
create_directory "data/train"


# data prep for train/data
echo 
echo -e $BLUE train/data prep below $NC
echo 

echo python scripts start


echo
echo -e $BLUE config $NC
echo
# copy paralel run file 
cp $kaldiroot/egs/wsj/s5/utils/parallel/run.pl .
echo copied $kaldiroot/egs/wsj/s5/utils/parallel/run.pl to $kaldiroot/egs/a_my/run.pl

#create mfcc config
cd conf  
echo "--use-energy=false" > mfcc.conf
echo "--sample-frequency=22050" >> mfcc.conf
echo "--num-mel-bins=40" >> mfcc.conf
echo "--num-ceps=40" >> mfcc.conf
echo "--low-freq=20" >> mfcc.conf
echo "--high-freq=-400" >> mfcc.conf
echo "--frame-shift=5" >> mfcc.conf


echo $kaldiroot/egs/a_my/conf/mfcc.conf created 

cd ..

# get mfcc and cmvn
chmod +x extract.sh 
./extract.sh 

chmod +x points.sh 
./points.sh 