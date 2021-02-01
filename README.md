## Guide to install Daimler Cochl. Project on NVIDIA Jetson TX2 (3rd version, delivered on 29th Jan, 2021)

### Target OS 

Ubuntu 18.04.5 LTS, Codename: bionic 

### Tager Software

To run Daimler-Cochl. resources, two different resources should be run on same NVIDIA Jetson TX2

(1) Cochl. Webserver, (2) Cochl. Sense SDK

## (1) Cochl. Webserver

To install the docker container and run it on aarch64 distribution

### Step 1. Docker installation

To install docker-compose we need to install docker as specified in this [link](https://docs.docker.com/engine/install/ubuntu/#installation-methods)

You should follow each step in order to install it

To install required libraries for docker installation
```bash
sudo apt-get update  -y

sudo apt-get install  -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common
```

To add docker repository to the package manager
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - -y

sudo add-apt-repository -y \
  "deb [arch=arm64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

Finally to install docker
```bash
sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io  -y
```

### Step 2. Docker compose

To run on a ARM64 architecture you should not imstall the latest version on docker-compose but the 1.25 which is the latest version available by apt

```bash
sudo apt-get update -y

sudo apt-get install docker-compose -y
```

Then you must then create a file named `docker-compose.yaml` and paste this code into it

```yaml
version: "3.3"
services:

  mercedes_api:
    image: daimlercochl/cochl_webserver:0.3
    ports:
      - "80:5000"
      - "3000:3000"
    restart: always
    environment:
      IP: ${IP}
```

In order to communicate with the "outside world" the local computer IP must be passed to the compose. To do so run this command on the directory which `docker-compose.yaml` exists, it will generate a `.env` file containing the local IP.

```bash
  # MacOS
  echo IP=$(ifconfig en0 | awk '/inet / {print $2}')  >> .env

  #Ubuntu
  echo IP=$(hostname  -I | cut -f1 -d' ')  >> .env
```

### Step 3. Login to Docker Hub

Finally, in order to run the file you must be logged in to be authorized to download the private docker image described in the `docker-compose.yaml` file.

To do so you must run this lines to be able to login in docker

```bash
sudo apt install gnupg2 pass -y
```

And then login with this line

```bash
sudo docker login --username=daimlercochl
```

You will be prompted for password, enter `sb7880bn!!` as password

### Step 4. Run Cochl. Webserver

To run the code simply type `sudo docker-compose up --build` and the container will start !

#### Example of docker data response messages 

```
{
	"detected": "High to low whistle",
	"duration": 50000,
	"feedback": "Window will open in %s seconds"
}
```

## (2) Cochl. Sense SDK

### Step 1. Install Virtualenv

To manage software packages for Python, install pip, a tool that will install and manage libraries or modules to use in your projects

```bash
sudo apt install -y python3-pip
```

Python packages can be installed by typing:

```bash
pip3 install package_name
```

There are a few more packages and development tools to install to ensure that we have a robust set-up for our programming environment:

```bash
sudo apt install build-essential libssl-dev libffi-dev python3-dev
```

Virtual environments enable you to have an isolated space on your server for Python projects. We’ll use venv, part of the standard Python 3 library, which we can install by typing:

```bash
sudo apt install -y python3-venv
```

Create a Virtual Environment
```bash
python3 -m venv my_env
```

Activate the environment using the command below, where my_env is the name of your programming environment.
```bash
source my_env/bin/activate
```
### Step 2. Install libraries

#### Install Tensorflow
To install tensorflow on Jetson TX2, please read this [link](https://docs.nvidia.com/deeplearning/frameworks/install-tf-jetson-platform/index.html) and complete this process.

#### Install LLVM and Numba
LLVM and Numba are required to use 'Harmonizer' function and special steps is needed to install llvm and numba on ARM platform.

Specific dependencies (LLVM == 7.0.1, numba == 0.46)  should be installed.

Please read the details in this [link](https://github.com/jefflgaol/Install-Packages-Jetson-ARM-Family)

Dependencies Installation

```bash
sudo apt-get install cmake
sudo apt-get install python3-pip
sudo pip3 install wget
sudo pip3 install Cython
```

LLVM Installation

```bash
wget http://releases.llvm.org/7.0.1/llvm-7.0.1.src.tar.xz
tar -xvf llvm-7.0.1.src.tar.xz
cd llvm-7.0.1.src
mkdir llvm_build_dir
cd llvm_build_dir/
cmake ../ -DCMAKE_BUILD_TYPE=Release -DLLVM_TARGETS_TO_BUILD="ARM;X86;AArch64"
make -j4
sudo make install
cd bin/
echo "export LLVM_CONFIG=\""`pwd`"/llvm-config\"" >> ~/.bashrc
echo "alias llvm='"`pwd`"/llvm-lit'" >> ~/.bashrc
source ~/.bashrc
sudo pip3 install llvmlite==0.30.0
```

Numba Installation

```bash
sudo apt-get install numba==0.46
```

#### Install other Libraries
Install audio requirements on Ubuntu 18.04 

```bash
sudo apt-get install libasound-dev portaudio19-dev libportaudio2 libportaudiocpp0  
sudo apt-get install libav-tools
 ```

If ffmpeg is not istalled, please read [this](https://linuxize.com/post/how-to-install-ffmpeg-on-ubuntu-18-04/)

Install rest of libraries with pip

```bash
sudo pip3 install -r requirements.txt
 ```
 
### Step 3. Run Cochl. Sense SDK

To run Cochl. Sense SDK, please run app.py under folder which we gave

```bash
python3 app.py
 ```

## Testing the service

For testing our entire system, please make sure the two processes (Cochl. Sense SDK, Cochl. Web server) are active.

### Supporting modes

All modes are being supported now.


### The Issues to read

#### (1) Process issue (app.py)

Due to Cochl. Sense SDK have to support 3 different deep learning models (animal, event, secret language) and 1 audio signal processing app (harmonizer), we define each mode separately and make it running on background with 'Nohub' function.

That means that processes on background should be handled properly and we define one more method called 'modeOff' in flask project to kill all previous processes.

But, when user turned off the flask app while the processes are living, there's no way to manage the ongoing processes and sometimes we need to be turned off manually for now.

We will guide you how to kill background processes and we will update one function to manage all processes when flask started on the next version.

When you encountered the error like this when you start 'app.py'

```bash
OSError: [Errno 98] Address already in use
```

Please type this command in terminal to check what the ongoing processes are

```bash
ps -ef | grep main.py
```

If the list of processes is like this

```bash
cochl    18759  6816 12 15:04 pts/0    00:03:00 python main.py -e
cochl    19370  8371  0 15:28 pts/0    00:00:00 grep --color=auto main.py
 ```
 
Please turn off the processes of 'python main.py -e or -a' with this command (kill pid)

```bash
kill pid (in this case, pid will be 18759)
 ```

#### (2) Connecting to mercedes API (message.py)

To connect mercedes API, you need to define and implement the API action in message.py

We define python function called mercedesWebAPI

```bash
def mercedesWebAPI(tag_result):
    if tag_result == 'Whistle':
        # Action for doing API call for mercedes API
	
    return response
```

Please edit this function to connect the mercedes API

Also, we will update the setting you gave us about controlling the machine on the next version.


#### (3) Secret Language Memory Issue

Due to run all applications (web-server, Cochl. Sense SDK) together in one machine (NVIDIA Jetson TX2), RAM memory isn't enough to run it all sometimes. At that moment, the training stage can't be initilized.

When the training page (the scene which SDK is training now) is stuck over 3 minutes. Please restart your app and check the memory status.

Generally, memory consumption from browser (chromium) and docker process are the main factors to consume the most of memory, please check thoese processes.

You can clean your docker images from this command

```bash
sudo docker system prune
```

It's very rarely happened in our environment, but if this behavior occurred, please contact us.

#### (4) Harmonizer (how to use)

To use harmonizer function, please read this guide before trying.

- Basic function of the voice harmonizer is to transforms the singing voice to generate harmony.
- When the voice pitch remains constant for (approx.) 0.2 seconds, the voice harmonization starts.
- Harmonized voices begin in a small volume and gradually increases.
- Harmonized voices consist of two pitches, each of which has minor 3rd and Perfect 5th relationship with the original voice. (i.e., When your voice pitch is C, the harmonized voices will have A and F, respectively.)
- Beware of the howling in case the microphone is too close to the speaker. Testing with earphones is recommended.

#### (5) Secret Language (how to use)

To use secret language function, please read and see the steps we explain

- (1) Collecting the ambient noise 
- (2) Recording the sound of secret language (tartget sound) 8 times
- (3) Wait until the process of training is finished (generally 2 minutes)
- (4) After finishing the training process, you can use it in 'always on' mode

We alse share the demo video of the whole processes
