# ls-psvr-encoder

A simple command line tool to encode your 180, 360, and fixed-frame videos for sideloading with Littlstar's VR Cinema apps.

## Dependencies

ls-psvr-encoder has been tested on the latest macOS as well as several flavors of Linux (Ubuntu, Debian, Arch, CentOS). Windows is not supported yet, but we are working on it!

This is a Node CLI application, so Node.JS and npm are both required.

Also the following binary applications are required:

* FFmpeg compiled with `libx264` and `libfdk_aac` libraries
* FFprobe
* MP4Box

See the [FFmpeg](https://ffmpeg.org) and [GPAC](https://gpac.io) project pages for more information about these dependencies.

#### macOS

macOS users can use the [Quick Start](https://github.com/littlstar/ls-psvr-encoder/wiki#quick-start-guide-macos) guide to get everything installed and running quickly.

*If you do not wish to use homebrew, you may install the following binary builds for [FFmpeg](https://evermeet.cx/ffmpeg/ffmpeg-3.2.4.dmg) and [MP4Box](http://download.tsi.telecom-paristech.fr/gpac/latest_builds/macosx_64/gpac-0.6.2-DEV-latest-master.dmg)*

#### Linux

Use your distribution's package manager to install `MP4Box`, `libx264`, and `ffmpeg`.

## Video Compatibility

Any equirectangular 180 or 360 video, either monoscopic or stereoscopic, should work fine with this tool. If your source video is footage taken straight from the RAW output of a high-end camera, or if your source video is packaged in one of the more esoteric containers that are out there, you may need to convert or re-mux as necessary so that the file can be read via FFmpeg.

**At this time, only stereo audio is supported on the VR Cinema PSVR app. If your source video contains only a multichannel audio track, it will be downmixed to stereo for compatibility.**

## Usage

**macOS users may use the [Quick Start](https://github.com/littlstar/ls-psvr-encoder/wiki#quick-start-guide-macos) guide.**

Getting started is easy for Linux users, too. To get started, elicit the following command: `npm install littlstar/ls-psvr-encoder -g`. This will place the application into your `PATH`, and can be executed by eliciting the command `lspe`.

Basic functionality is achieved by running `lspe -i /path/to/video.mp4`. This will assume default values regarding the input video (monoscopic, 360) and will output to the same directory that holds the input file (in this case, `/path/to`). The output file will be renamed to match the PSVR app's requirements, i.e. `/path/to/video_psvr.mp4`.

To get more granular options, run `lspe -h` for a more detailed help output.

## Notes

The output video file may big larger than the input. This is because the Playstation 4's hardware and decoding capabilities are not up to today's standards, and smaller file sizes place too much strain on the system. Making the files bigger allows the PS4 to work less as hard to play the content, leading to fewer buffering events that lead to a poor experience.
