# ls-psvr-encoder

A command line tool to encode your 180, 360, and fixed-frame videos for sideloading with Littlstar's VR Cinema apps.

## Features

* Encoding profiles for Littlstar's VR Cinema apps on the PSVR, Daydream, GearVR, and WindowsMR platforms.
* Supports 360, 180, and fixed-frame video projections.
* Supports monoscopic, over-under, and side-by-side formats.
* Properly names encoded videos for compatibility with VR Cinema's file naming conventions.
* Embeds a thumbnail into the output video for easier library navigation.

## Usage

**macOS users may use the [Quick Start](https://github.com/littlstar/ls-psvr-encoder/wiki#quick-start-guide-macos) guide.**

Getting started is easy for Linux users, too. To get started, elicit the following command: `npm install littlstar/ls-psvr-encoder -g`. This will place the application into your `PATH`, and can be executed by eliciting the command `lspe`.

*As of version 0.3.4, default command line options are no longer offered, due to the growing number of platforms this tool now supports. To get a list of all available CLI options, run `lspe -h` for a detailed help output.*

## Dependencies

ls-psvr-encoder has been tested on the latest macOS as well as several flavors of Linux (Ubuntu, Debian, Arch, CentOS). Windows 10 is not supported yet, but we are working on it!

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

## Notes

### Video/Audio Compatibility

Any equirectangular 180 or 360 video, either monoscopic or stereoscopic, should work fine with this tool. If your source video is footage taken straight from the RAW output of a high-end camera, or if your source video is packaged in one of the more esoteric containers that are out there, you may need to convert or re-mux as necessary so that the file can be read via FFmpeg.

**At this time, only stereo audio is supported for sideloaded content. If your source video contains only a multichannel or spatial audio track, it will be downmixed to stereo for compatibility.**

### File Sizes
The output video file may big larger than the input. This is because the Playstation 4's hardware and decoding capabilities are not up to today's standards, and smaller file sizes place too much strain on the system. Making the files bigger allows the PS4 to work less as hard to play the content, leading to fewer buffering events that lead to a poor experience.
