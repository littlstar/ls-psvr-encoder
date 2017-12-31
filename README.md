# ls-psvr-encoder

A command line tool to encode your 180, 360, and fixed-frame videos for sideloading with Littlstar's VR Cinema apps.

## Features

* Encoding profiles for Littlstar's VR Cinema apps on the **Playstation VR**, **Google Daydream**, **Samsung Gear VR**, and **Microsoft Windows MR** platforms.
* Supports **360**, **180**, and **fixed-frame** video projections.
* Supports monoscopic, over-under, and side-by-side formats.
* Properly names encoded videos for compatibility with VR Cinema's file naming conventions.
* Subtitle track overlay (for 2D fixed-frame video only)
* Embeds a thumbnail into the output video for easier library navigation.

## Usage

**macOS users may use the [Quick Start](https://github.com/littlstar/ls-psvr-encoder/wiki#quick-start-guide-macos) guide.**

Getting started is easy for Linux users, too. To get started, elicit the following command: `npm install littlstar/ls-psvr-encoder -g`. This will place the application into your PATH, and can be executed by eliciting the command `lspe`.

Once you've installed lspe, check out the [Usage Examples](https://github.com/littlstar/ls-psvr-encoder/wiki#usage-examples) section of our wiki to get started.

*As of version 0.3.4, default command line options are no longer offered, due to the growing number of platforms this tool now supports. To get a list of all available CLI options, run* `lspe -h` *for a detailed help output.*

### Dependencies

ls-psvr-encoder has been tested on the latest macOS as well as several flavors of Linux (Ubuntu, Debian, Arch, CentOS). Windows 10 is not supported yet, but we are working on it!

This is a Node CLI application, so [Node](https://nodejs.org/en/blog/release/v8.9.0/) is required. We recommend using at least Node 8.9.0, the current LTS version. Versions <7 have been found to cause installation issues on Linux, and could potentially be problematic on other OSes as well.

Also the following binary applications are required:

* FFmpeg compiled with support for the `libx264`, `libass`, and `libfdk_aac` libraries
* FFprobe
* MP4Box (a command line tool shipped with the `gpac` libraries)

See the [FFmpeg](https://ffmpeg.org) and [GPAC](https://gpac.io) project pages for more information about these dependencies.

#### macOS

macOS users can use the [Quick Start](https://github.com/littlstar/ls-psvr-encoder/wiki#quick-start-guide-macos) guide to get everything installed and running quickly.

*If you do not wish to use homebrew, you may install the following binary builds for [FFmpeg](https://evermeet.cx/ffmpeg/ffmpeg-3.2.4.dmg) and [MP4Box](http://download.tsi.telecom-paristech.fr/gpac/latest_builds/macosx_64/gpac-0.6.2-DEV-latest-master.dmg)*

#### Linux

Use your distribution's package manager to install `MP4Box` (commonly found in the `gpac` package), `libx264` (8-bit version), and `ffmpeg`.

## Notes

### Video/Audio Compatibility

Any equirectangular 180 or 360 video, either monoscopic or stereoscopic, should work fine with this tool. If your source video is footage taken straight from the RAW output of a high-end camera, or if your source video is packaged in one of the more esoteric containers that are out there, you may need to convert or re-mux as necessary so that the file can be read via FFmpeg.

Traditional planar video is now (experimentally) supported, in both 2D and 3D (over-under & side-by-side) formats. If any issues are experienced with these kinds of video, we welcome users to submit a new issue to help us address all possible use-cases.

**At this time, only stereo audio is supported for sideloaded content. If your source video contains only a multichannel or spatial audio track, it will be downmixed to stereo for compatibility.** Stereo downmixes made with this tool will not contain any of the LFE audio, in order to prevent saturation/clipping on the encoded video.

### Subtitles

Subtitle files (SRT) may be overlayed onto 2D fixed-frame videos. This feature generates subtitles on top of the video, so they are burned into the resulting file. The subtitles, therefore, cannot be hidden during playback.

### PSVR File Sizes

When encoding for PSVR, the output video file's size may big larger than the input's was. This is because the Playstation 4's hardware and decoding capabilities are a bit limited compared to more contemporary devices. Smaller file sizes make content more compressed, which can place too much strain on the PS4's graphics hardware during de-compression. Making the files bigger allows the PS4 to work less hard to play the content, leading to fewer buffering events.

### Feature Requests

We welcome feature requests! Simply open a new Github issue detailing the feature you'd like us to consider. If available, a link pointing to some test content is extremely helpful to include in the issue. We offer an anonymous and private delivery portal for files of a sensitive nature. You may request access to this portal by sending an email to media@littlstar.com.

#### Planned Features

* Expanded subtitle track support
* (3D) BluRay support
* HDR and 10-bit color
