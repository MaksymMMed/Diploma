mfccdir=mfcc  
x=data/train

train_cmd="./run.pl"
decode_cmd="./run.pl"

kaldiroot=/home/maksymm/my/kaldi

BLUE='\033[0;34m'
NC='\033[0m'

extractor=$kaldiroot/egs/a_my/v1_extractor
model=$kaldiroot/egs/a_my/v1_chain
lang=$kaldiroot/egs/a_my/v1_lm/data


dir=$kaldiroot/egs/a_my/exp

nj=1

echo
echo -e $BLUE compute GOP $NC
echo


$train_cmd JOB=1:$nj $dir/gop_score/log/compute_gop.JOB.log $kaldiroot/src/bin/compute-gop --phone-map=$dir/data_align/phone-to-pure-phone.int $model/final.mdl \
      "ark,t:gunzip -c $dir/data_align/ali-phone.JOB.gz|" \
      "ark:exp/probs/output.JOB.ark" \
      "ark,t:$dir/gop_score/gop.JOB.txt" "ark,t:$dir/gop_score/phonefeat.JOB.txt"   || exit 1;
