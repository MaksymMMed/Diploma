mfccdir=mfcc  
x=data/train

train_cmd="./run.pl"
decode_cmd="./run.pl"

BLUE='\033[0;34m'
NC='\033[0m'

nj=1

kaldiroot=/home/maksymm/my/kaldi

echo 
echo -e $BLUE make mffc $NC
echo

steps/make_mfcc.sh --cmd $train_cmd --nj $nj $x exp/make_mfcc/$x $mfccdir

echo 
echo -e $BLUE make cmvn $NC
echo

steps/compute_cmvn_stats.sh $x exp/make_mfcc/$x $mfccdir

echo 
echo -e $BLUE utils/fix data $NC
echo


utils/fix_data_dir.sh $x

extractor=$kaldiroot/egs/a_my/v1_extractor/
model=$kaldiroot/egs/a_my/v1_chain
lang=$kaldiroot/egs/a_my/v1_lm/data/

echo 
echo -e $BLUE extract i-vectors $NC
echo

steps/online/nnet2/extract_ivectors_online.sh --cmd $train_cmd --nj $nj $x $extractor exp/nnet3_cleaned/ivectors

echo
echo -e $BLUE compute log likehood for GOP $NC
echo

steps/nnet3/compute_output.sh --cmd $train_cmd --nj $nj --online-ivector-dir exp/nnet3_cleaned/ivectors data/train $model exp/probs

echo
echo -e $BLUE make alignment $NC
echo

steps/nnet3/align.sh --cmd $train_cmd --nj $nj --use_gpu false --online_ivector_dir exp/nnet3_cleaned/ivectors data/train $lang $model exp/data_align


dir=$kaldiroot/egs/a_my/exp/data_align


cp $kaldiroot/egs/a_my/other/phone-to-pure-phone.int $dir
cp $kaldiroot/egs/a_my/other/phones-pure.txt $dir

echo 
echo -e $BLUE make ali to phones $NC
echo 


$train_cmd JOB=1:$nj $dir/log/ali_to_phones.JOB.log \
    src/bin/ali-to-phones --per-frame=true $model/final.mdl "ark,t:gunzip -c $dir/ali.JOB.gz|" \
       "ark,t:|gzip -c >$dir/ali-phone.JOB.gz" || exit 1;



