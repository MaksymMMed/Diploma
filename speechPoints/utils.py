import librosa
import soundfile as sf
import os
import shutil
root = "/home/maksymm/my/kaldi/egs/a_my"

def delete_dir(path):
    if os.path.isdir(f"{root}/{path}"):
        shutil.rmtree(f"{root}/{path}")

def prepare_data(audio,text):

    delete_dir("conf")
    delete_dir("data")
    delete_dir("exp")
    delete_dir("mfcc")

    os.makedirs(f"{root}/data/train",exist_ok=True)

    try:
        audio.save(f"{root}/other/test_user/target_raw.wav")
    except Exception as e:
        print(f"Audio saving error: {e}")



    try:
        with open(f"{root}/data/train/text", 'w') as f:
            f.write(f"1 {text.upper()}")
    except Exception as e:
        print(f"Error creating file: {e}")

    resample_audio(f"{root}/other/test_user/target_raw.wav",f"{root}/other/test_user/target_prep.wav")
    prepare_scp(f"{root}/other/test_user/target_prep.wav")
    prepare_utt2spk()

def resample_audio(input_file, output_file, target_sr=22050):
    try:
        y, sr = librosa.load(input_file)
        sf.write(output_file, y, samplerate=target_sr)
    except Exception as e:
        print(f"Помилка обробки аудіофайлу '{input_file}': {e}")


def prepare_scp(target_path):
    with open(f'{root}/data/train/wav.scp', 'w') as file:
        file.write(f'1 {target_path}\n')

def prepare_utt2spk():
    with open(f"{root}/data/train/utt2spk", 'w', newline='\n') as f:  # Встановлюємо LF як символ кінця рядка
        f.write(f"1 1\n")

    with open(f"{root}/data/train/spk2utt", 'w', newline='\n') as f:  # Встановлюємо LF як символ кінця рядка
        f.write(f"1 1\n")